/**
 * Created by PRadostev on 28.01.2015.
 */
L.WFS = L.FeatureGroup.extend({

  options: {
    crs: L.CRS.EPSG3857,
    showExisting: true,
    geometryField: 'Shape',
    url: '',
    version: '1.1.0',
    typeNS: '',
    typeName: '',
    typeNSName: '',
    maxFeatures: null,
    filter: null,
    style: {
      color: 'black',
      weight: 1
    },
    namespaceUri: ''
  },

  state: {},

  initialize: function (options, readFormat) {
    L.setOptions(this, options);

    this.state = {exist: 'exist'};

    this._layers = {};

    this.readFormat = readFormat || new L.Format.GML({
      crs: this.options.crs,
      geometryField: this.options.geometryField
    });

    this.options.typeNSName = this.namespaceName(this.options.typeName);
    this.options.srsName = this.options.crs.code;

    var that = this;
    this.describeFeatureType(function () {
      if (that.options.showExisting) {
        that.loadFeatures(that.options.filter);
      }
    }, function(errorMessage) {
      that.fire('error', {
        error: new Error(errorMessage)
      });
    });
  },

  namespaceName: function (name) {
    return this.options.typeNS + ':' + name;
  },

  describeFeatureType: function (successCallback, errorCallback) {
    var requestData = L.XmlUtil.createElementNS('wfs:DescribeFeatureType', {
      service: 'WFS',
      version: this.options.version
    });
    requestData.appendChild(L.XmlUtil.createElementNS('TypeName', {}, {value: this.options.typeNSName}));

    var that = this;
    L.Util.request({
      url: this.options.url,
      data: L.XmlUtil.serializeXmlDocumentString(requestData),
      headers: this.options.headers || {},
      success: function (data) {
        // If some exception occur, WFS-service can response successfully, but with ExceptionReport,
        // and such situation must be handled.
        var exceptionReport = L.XmlUtil.parseOwsExceptionReport(data);
        if (exceptionReport) {
          if (typeof(errorCallback) === 'function') {
            errorCallback(exceptionReport.message);
          }

          return;
        }

        var xmldoc = L.XmlUtil.parseXml(data);
        var featureInfo = xmldoc.documentElement;
        that.readFormat.setFeatureDescription(featureInfo);
        that.options.namespaceUri = featureInfo.attributes.targetNamespace.value;
        if (typeof(successCallback) === 'function') {
          successCallback();
        }
      },
      error: function(errorMessage) {
        if (typeof(errorCallback) === 'function') {
          errorCallback(errorMessage);
        }
      }
    });
  },

  getFeature: function (filter) {
    var request = L.XmlUtil.createElementNS('wfs:GetFeature',
      {
        service: 'WFS',
        version: this.options.version,
        maxFeatures: this.options.maxFeatures,
        outputFormat: this.readFormat.outputFormat
      });

    var query = request.appendChild(L.XmlUtil.createElementNS('wfs:Query',
      {
        typeName: this.options.typeNSName,
        srsName: this.options.srsName
      }));

    if (filter && filter.toGml) {
      query.appendChild(filter.toGml());
    }

    return request;
  },

  loadFeatures: function (filter) {
    var that = this;
    L.Util.request({
      url: this.options.url,
      data: L.XmlUtil.serializeXmlDocumentString(that.getFeature(filter)),
      headers: this.options.headers || {},
      success: function (responseText) {
        // If some exception occur, WFS-service can response successfully, but with ExceptionReport,
        // and such situation must be handled.
        var exceptionReport = L.XmlUtil.parseOwsExceptionReport(responseText);
        if (exceptionReport) {
          that.fire('error', {
            error: new Error(exceptionReport.message)
          });

          return that;
        }

        // Request was truly successful (without exception report),
        // so convert response to layers.
        var layers = that.readFormat.responseToLayers(responseText, {
          coordsToLatLng: that.options.coordsToLatLng,
          pointToLayer: that.options.pointToLayer
        });
        layers.forEach(function (element) {
          element.state = that.state.exist;
          that.addLayer(element);
        });

        that.setStyle(that.options.style);
        that.fire('load', {
          responseText: responseText
        });

        return that;
      },
      error: function(errorMessage) {
        that.fire('error', {
          error: new Error(errorMessage)
        });

        return that;
      }
    });
  }
});

L.wfs = function (options, readFormat) {
  return new L.WFS(options, readFormat);
};
