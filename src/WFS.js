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
        style: {
            color: 'black',
            weight: 1
        },
        namespaceUri: ''
    },

    state: {},

    initialize: function (options, readFormat) {
        L.setOptions(this, options);

        this.state =  {exist: 'exist'};

        this._layers = {};

        this.readFormat = readFormat || new L.Format.GeoJSON({crs: this.options.crs});

        this.options.typeNSName = this.namespaceName(this.options.typeName);
        this.options.srsName = this.options.crs.code;

        if (this.options.showExisting) {
            this.loadFeatures();
        }
    },

    namespaceName: function (name) {
        return this.options.typeNS + ':' + name;
    },

    getFeature: function (filter) {
        var request = L.XmlUtil.createElementNS('wfs:GetFeature',
            {
                service: 'WFS',
                version: this.options.version,
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
            data: L.XmlUtil.createXmlDocumentString(that.getFeature(filter)),
            success: function (data) {
                var layers = that.readFormat.responseToLayers(data,
                    {
                        coordsToLatLng: that.options.coordsToLatLng,
                        pointToLayer: that.options.pointToLayer
                    });
                layers.forEach(function (element) {
                    element.state = that.state.exist;
                    that.addLayer(element);
                });

                that.setStyle(that.options.style);
                that.fire('load');

                return that;
            }
        });
    }
});

L.wfs = function (options, readFormat) {
    return new L.WFS(options, readFormat);
};