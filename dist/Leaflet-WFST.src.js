/*! Leaflet-WFST 0.0.1 2015-06-09 */
(function(window, document, undefined) {

"use strict";

L.XmlUtil = {
  // comes from OL
  namespaces: {
    xlink: "http://www.w3.org/1999/xlink",
    xsi: "http://www.w3.org/2001/XMLSchema-instance",
    wfs: "http://www.opengis.net/wfs",
    gml: "http://www.opengis.net/gml",
    ogc: "http://www.opengis.net/ogc",
    ows: "http://www.opengis.net/ows",
    xmlns: "http://www.w3.org/2000/xmlns/"
  },

  //TODO: есть ли нормальная реализация для создания нового документа с doctype text/xml?
  xmldoc: (new DOMParser()).parseFromString('<root />', 'text/xml'),

  setAttributes: function (node, attributes) {
    for (var name in attributes) {
      if (attributes[name] != null && attributes[name].toString) {
        var value = attributes[name].toString();
        var uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
        node.setAttributeNS(uri, name, value);
      }
    }
  },

  evaluate: function (xpath, rawxml) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(rawxml, 'text/xml');
    var xpe = new XPathEvaluator();
    var nsResolver = xpe.createNSResolver(xmlDoc.documentElement);

    return xpe.evaluate(xpath, xmlDoc, nsResolver, XPathResult.ANY_TYPE, null);
  },

  createElementNS: function (name, attributes, options) {
    options = options || {};

    var uri = options.uri;

    if (!uri) {
      uri = this.namespaces[name.substring(0, name.indexOf(":"))];
    }

    if (!uri) {
      uri = this.namespaces[options.prefix];
    }

    var node = uri ? this.xmldoc.createElementNS(uri, name) : this.xmldoc.createElement(name);

    if (attributes) {
      this.setAttributes(node, attributes);
    }

    if (options.value != null) {
      node.appendChild(this.xmldoc.createTextNode(options.value));
    }

    return node;
  },

  createTextNode: function (value) {
    return this.xmldoc.createTextNode(value);
  },

  createXmlDocumentString: function (node) {
    var doc = document.implementation.createDocument("", "", null);
    doc.appendChild(node);
    var serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  },

  createXmlString: function (node) {
    var serializer = new XMLSerializer();
    return serializer.serializeToString(node);
  },

  parseXml: function (rawXml) {
    if (typeof window.DOMParser !== "undefined") {
      return ( new window.DOMParser() ).parseFromString(rawXml, "text/xml");
    } else if (typeof window.ActiveXObject !== "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
      var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(rawXml);
      return xmlDoc;
    } else {
      throw new Error("No XML parser found");
    }
  }
};

L.Util.request = function (options) {
  options = L.extend({
    async: true,
    method: 'POST',
    data: '',
    params: {},
    headers: {},
    url: window.location.href,
    success: function (data) {
      console.log(data);
    },
    error: function (data) {
      console.log('Ajax fail');
      console.log(data);
    },
    complete: function () {
    }
  }, options);

  // good bye IE 6,7
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        options.success(xhr.responseText);
      } else {
        options.error(xhr.responseText);
      }
      options.complete();
    }
  };

  var url = options.url + L.Util.getParamString(options.params, options.url);

  xhr.open(options.method, url, options.async);
  for (var header in options.headers) {
    xhr.setRequestHeader(header, options.headers[header]);
  }

  xhr.send(options.data);
};

L.Filter = L.Class.extend({
  initialize: function () {
    this.filter = L.XmlUtil.createElementNS('ogc:Filter');
  },

  /**
   * Represents this filter as GML node
   *
   * Returns:
   * {XmlElement} Gml representation of this filter
   */
  toGml: function () {
    return this.filter;
  },

  append: function () {
    return this;
  }
});

L.Filter.GmlObjectID = L.Filter.extend({
  append: function (id) {
    this.filter.appendChild(L.XmlUtil.createElementNS('ogc:GmlObjectId', {'gml:id': id}));
    return this;
  }
});

L.Format = L.Class.extend({
  defaultOptions: {
    crs: L.CRS.EPSG3857,
    coordsToLatLng: function (coords) {
      return new L.LatLng(coords[1], coords[0], coords[2]);
    },
    latLngToCoords: function (latlng) {
      var coords = [latlng.lng, latlng.lat];
      if (latlng.alt !== undefined) {
        coords.push(latlng.alt);
      }
      return coords;
    }
  },

  initialize: function (options) {
    L.setOptions(this, L.extend({}, this.defaultOptions, options));
    if (options.crs) {
      var crs = options.crs;
      this.options.coordsToLatLng = function (coords) {
        var point = L.point(coords[0], coords[1]);
        var ll = crs.projection.unproject(point);
        if (coords[2]) {
          ll.alt = coords[2];
        }
        return ll;
      };
      this.options.latLngToCoords = function (ll) {
        var latLng = L.latLng(ll);
        return crs.projection.project(latLng);
      };
    }
  }
});

L.Format.GeoJSON = L.Format.extend({

  initialize: function (options) {
    L.Format.prototype.initialize.call(this, options);
    this.outputFormat = 'application/json';
  },

  responseToLayers: function (rawData) {
    var layers = [];
    var geoJson = JSON.parse(rawData);

    for (var i = 0; i < geoJson.features.length; i++) {
      layers.push(this.processFeature(geoJson.features[i]));
    }

    return layers;
  },

  processFeature: function (feature) {
    var layer = this.generateLayer(feature);
    layer.feature = feature;
    return layer;
  },

  generateLayer: function (feature) {
    return L.GeoJSON.geometryToLayer(feature, this.options.pointToLayer || null, this.options.coordsToLatLng || null, null);
  }
});

L.GML = L.GML || {};

L.GML.ParserContainerMixin = {

  parsers: {},

  initializeParserContainer: function () {
    this.parsers = {};
  },

  appendParser: function (parser) {
    this.parsers[parser.elementTag] = parser;
  },

  parseElement: function (element, options) {
    var parser = this.parsers[element.tagName];
    if (!parser) throw('unknown child element ' + element.tagName);

    return parser.parse(element, options);
  }
};

L.GML.ElementParser = L.Class.extend({
  elementTag: '',
  parse: function () {
    throw('not implemented parse function in parser for ' + this.elementTag);
  }
});

L.GML.GeometryParser = L.GML.ElementParser.extend({
    statics: {
        DIM: 2
    },

    dimensions: function (element) {
        if (element.attributes.srsDimension) {
            return parseInt(element.attributes.srsDimension.value);
        }

        return L.GML.GeometryParser.DIM;
    }
});

L.GML.CoordinatesParser = L.GML.ElementParser.extend({

  defaultSeparator: {
    ds: '.', //decimal separator
    cs: ',', // component separator
    ts: ' ' // tuple separator
  },

  initialize: function () {
    this.elementTag = 'gml:coordinates';
  },

  parse: function (element) {

    var ds = this.defaultSeparator.ds;
    if (element.attributes.decimal) {
      ds = element.attributes.decimal.value;
    }

    var cs = this.defaultSeparator.cs;
    if (element.attributes.cs) {
      cs = element.attributes.cs.value;
    }

    var ts = this.defaultSeparator.ts;
    if (element.attributes.ts) {
      ts = element.attributes.ts.value;
    }

    var result = [];
    var coords = element.textContent.split(ts);

    var mapFunction = function (coord) {
      if (ds !== '.') {
        coord = coord.replace(ds, '.');
      }

      return parseFloat(coord);
    };

    for (var i = 0; i < coords.length; i++) {
      result.push(coords[i].split(cs).map(mapFunction));
    }

    if (result.length === 1) {
      return result[0];
    }

    return result;
  }
});

L.GML.PosParser = L.GML.ElementParser.extend({
  initialize: function () {
    this.elementTag = 'gml:pos';
  },

  parse: function (element) {
    return element.textContent.split(' ').map(function (coord) {
      return parseFloat(coord);
    });
  }
});

L.GML.PosListParser = L.GML.ElementParser.extend({
  initialize: function () {
    this.elementTag = 'gml:posList';
  },

  parse: function (element, options) {
    var result = [];
    var dim = options.dimensions;
    var coords = element.textContent.split(' ');
    for (var i = 0; i < coords.length; i += dim) {
      var coord = [];
      for (var j = i; j < i + dim; j++) {
        coord.push(parseFloat(coords[j]));
      }
      result.push(coord);
    }

    return result;
  }
});

L.GML.PointNodeParser = L.GML.GeometryParser.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.elementTag = 'gml:Point';
    this.initializeParserContainer();
    this.appendParser(new L.GML.PosParser());
    this.appendParser(new L.GML.CoordinatesParser());
  },

  parse: function (element) {
    return this.parseElement(element.firstChild, {dimensions: this.dimensions(element)});
  }
});

L.GML.PointSequenceParser = L.GML.GeometryParser.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.PosParser());
    this.appendParser(new L.GML.PosListParser());
    this.appendParser(new L.GML.CoordinatesParser());
    this.appendParser(new L.GML.PointNodeParser());
  },

  parse: function (element) {
    var firstChild = element.firstChild;
    var coords = [];
    var tagName = firstChild.tagName;
    if (tagName === 'gml:pos' || tagName === 'gml:Point') {
      var childParser = this.parsers[tagName];
      var elements = element.getElementsByTagName(tagName.split(':')[1]);
      for (var i = 0; i < elements.length; i++) {
        coords.push(childParser.parse(elements[i]));
      }
    }
    else {
      coords = this.parseElement(firstChild, {dimensions: this.dimensions(element)});
    }

    return coords;
  }
});

L.GML.LinearRingParser = L.GML.PointSequenceParser.extend({
  initialize: function () {
    L.GML.PointSequenceParser.prototype.initialize.call(this);
    this.elementTag = 'gml:LinearRing';
  },

  parse: function (element) {
    var coords = L.GML.PointSequenceParser.prototype.parse.call(this, element);
    //for leaflet polygons its not recommended insert additional last point equal to the first one
    coords.pop();
    return coords;
  }
});

L.GML.CoordsToLatLngMixin = {
    transform: function (coordinates, options) {
        if (Array.isArray(coordinates[0])) {
            var latLngs = [];
            for (var i = 0; i < coordinates.length; i++) {
                latLngs.push(options.coordsToLatLng(coordinates[i]));
            }

            return latLngs;
        }

        return options.coordsToLatLng(coordinates);
    }
};

L.GML.PointParser = L.GML.PointNodeParser.extend({
    includes: L.GML.CoordsToLatLngMixin,

    parse: function (element, options) {
        var coords = L.GML.PointNodeParser.prototype.parse.call(this, element);
        var layer = new L.Marker();
        layer.setLatLng(this.transform(coords, options));
        return layer;
    }
});

L.GML.LineStringParser = L.GML.PointSequenceParser.extend({

  includes: L.GML.CoordsToLatLngMixin,

  initialize: function () {
    this.elementTag = 'gml:LineString';
    L.GML.PointSequenceParser.prototype.initialize.call(this);
  },

  parse: function (element, options) {
    var layer = new L.Polyline([]);
    var coordinates = L.GML.PointSequenceParser.prototype.parse.call(this, element);
    var latLngs = this.transform(coordinates, options);
    return layer.setLatLngs(latLngs);
  }
});

L.GML.PolygonParser = L.GML.GeometryParser.extend({
    includes: L.GML.CoordsToLatLngMixin,

    initialize: function () {
        this.elementTag = 'gml:Polygon';
        this.linearRingParser = new L.GML.LinearRingParser();
    },

    getCoordinates: function (element) {
        var coords = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            //there can be exterior and interior, by GML standard and for leaflet its not significant
            var child = element.childNodes[i];
            if (child.nodeType === document.ELEMENT_NODE) {
                coords.push(this.linearRingParser.parse(child.firstChild));
            }
        }

        return coords;
    },

    parse: function (element, options) {
        var layer = new L.Polygon([]);
        var coords = this.getCoordinates(element);
        layer.setLatLngs(this.transform(coords, options));
        return layer;
    }
});

L.GML.MultiGeometryParser = L.GML.GeometryParser.extend({
    includes: L.GML.ParserContainerMixin,

    initialize: function () {
        this.initializeParserContainer();
    },

    parse: function (element, options) {
        var childObjects = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            var geometryMember = element.childNodes[i];
            if (geometryMember.nodeType !== document.ELEMENT_NODE) continue;

            for (var j = 0; j < geometryMember.childNodes.length; j++) {
                var singleGeometry = geometryMember.childNodes[j];
                if (singleGeometry.nodeType !== document.ELEMENT_NODE) continue;

                childObjects.push(this.parseElement(singleGeometry, options));
            }
        }

        return childObjects;
    }
});

L.GML.AbstractMultiPolylineParser = L.GML.MultiGeometryParser.extend({
    parse: function (element, options) {
        var childLayers = L.GML.MultiGeometryParser.prototype.parse.call(this, element, options);
        var layer = new L.MultiPolyline([]);
        for (var i = 0; i < childLayers.length; i++) {
            layer.addLayer(childLayers[i]);
        }

        return layer;
    }
});

L.GML.AbstractMultiPolygonParser = L.GML.MultiGeometryParser.extend({

  parse: function (element, options) {
    var childLayers = L.GML.MultiGeometryParser.prototype.parse.call(element, options);
    var layer = new L.MultiPolygon([]);
    for (var i = 0; i < childLayers.length; i++) {
      layer.addLayer(childLayers[i]);
    }

    return layer;
  }
});

L.GML.MultiLineStringParser = L.GML.AbstractMultiPolylineParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolylineParser.prototype.initialize.call(this);
        this.appendParser(new L.GML.LineStringParser());
        this.elementTag = 'gml:MultiLineString';
    }
});

L.GML.MultiCurveParser = L.GML.AbstractMultiPolylineParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolylineParser.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiCurve';
        this.appendParser(new L.GML.LineStringParser());
    }
});

L.GML.MultiPolygonParser = L.GML.AbstractMultiPolygonParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolygonParser.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiPolygon';
        this.appendParser(new L.GML.PolygonParser());
    }
});

L.GML.MultiSurfaceParser = L.GML.AbstractMultiPolygonParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolygonParser.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiSurface';
        this.appendParser(new L.GML.PolygonParser());
    }
});

L.Format.GML = L.Format.extend({

  includes: L.GML.ParserContainerMixin,

  initialize: function (options) {
    L.Format.prototype.initialize.call(this, options);
    this.outputFormat = 'text/xml; subtype=gml/3.1.1';
    this.initializeParserContainer();
    this.appendParser(new L.GML.PointParser());
    this.appendParser(new L.GML.LineStringParser());
    this.appendParser(new L.GML.PolygonParser());
    this.appendParser(new L.GML.MultiLineStringParser());
    this.appendParser(new L.GML.MultiPolygonParser());
    this.appendParser(new L.GML.MultiCurveParser());
    this.appendParser(new L.GML.MultiSurfaceParser());
  },

  responseToLayers: function (rawData) {
    var layers = [];
    var xmlDoc = L.XmlUtil.parseXml(rawData);
    var featureCollection = xmlDoc.documentElement;
    var featureMemberNodes = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMember');
    for (var i = 0; i < featureMemberNodes.length; i++) {
      var feature = featureMemberNodes[i].firstChild;
      layers.push(this.processFeature(feature));
    }

    var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
    if (featureMembersNode.length > 0) {
      var features = featureMembersNode[0].childNodes;
      for (var j = 0; j < features.length; j++) {
        var node = features[j];
        if (node.nodeType === document.ELEMENT_NODE) {
          layers.push(this.processFeature(node));
        }
      }
    }

    return layers;
  },

  processFeature: function (feature) {
    var geometry = feature.getElementsByTagName(this.options.geometryField)[0];
    var layer = this.generateLayer(geometry);
    var properties = {};
    for (var i = 0; i < feature.childNodes.length; i++) {
      var node = feature.childNodes[i];
      if (node.nodeType === document.ELEMENT_NODE && node !== geometry) {
        var propertyName = node.tagName.split(':').pop();
        properties[propertyName] = node.textContent;
      }
    }

    layer.feature = {properties: properties};
    return layer;
  },

  generateLayer: function (geometry) {
    return this.parseElement(geometry, this.options);
  }
});

L.Util.project = function (crs, latlngs) {
  if (L.Util.isArray(latlngs)) {
    var result = [];
    latlngs.forEach(function (latlng) {
      result.push(crs.projection.project(latlng));
    });

    return result;
  }
  else {
    return crs.projection.project(latlngs);
  }
};

L.GMLUtil = {
  posNode: function (coord) {
    return L.XmlUtil.createElementNS('gml:pos', {srsDimension: 2}, {value: coord.x + ' ' + coord.y});
  },

  posListNode: function (coords, close) {
    var localcoords = [];
    coords.forEach(function (coord) {
      localcoords.push(coord.x + ' ' + coord.y);
    });
    if (close && coords.length > 0) {
      var coord = coords[0];
      localcoords.push(coord.x + ' ' + coord.y);
    }

    var posList = localcoords.join(' ');
    return L.XmlUtil.createElementNS('gml:posList', {}, {value: posList});
  }
};

L.Marker.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:Point', {srsName: crs.code});
    node.appendChild(L.GMLUtil.posNode(L.Util.project(crs, this.getLatLng())));
    return node;
  }
});

L.MultiPolygon.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:MultiPolygon', {srsName: crs.code, srsDimension: 2});
    var collection = node.appendChild(L.XmlUtil.createElementNS('gml:polygonMembers'));
    this.eachLayer(function (polygon) {
      collection.appendChild(polygon.toGml(crs));
    });

    return node;
  }
});

L.MultiPolyline.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:MultiLineString', {srsName: crs.code, srsDimension: 2});
    var collection = node.appendChild(L.XmlUtil.createElementNS('gml:lineStringMembers'));
    this.eachLayer(function (polyline) {
      collection.appendChild(polyline.toGml(crs));
    });

    return node;
  }
});

L.Polygon.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:Polygon', {srsName: crs.code, srsDimension: 2});
    node.appendChild(L.XmlUtil.createElementNS('gml:exterior'))
      .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
      .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));

    if (this._holes && this._holes.length) {
      for (var hole in this._holes) {
        node.appendChild(L.XmlUtil.createElementNS('gml:interior'))
          .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
          .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this._holes[hole]), true));
      }
    }

    return node;
  }
});

L.Polyline.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:LineString', {srsName: crs.code, srsDimension: 2});
    node.appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));
    return node;
  }
});

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

    this.state = {exist: 'exist'};

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

L.WFS.Transaction = L.WFS.extend({
  initialize: function (options, readFormat) {
    L.WFS.prototype.initialize.call(this, options, readFormat);
    this.describeFeatureType();
    this.state = L.extend(this.state, {
      insert: 'insert',
      update: 'update',
      remove: 'remove'
    });

    this.changes = {};
  },

  describeFeatureType: function () {
    var requestData = L.XmlUtil.createElementNS('wfs:DescribeFeatureType', {service: 'WFS', version: this.options.version});
    requestData.appendChild(L.XmlUtil.createElementNS('TypeName', {}, {value: this.options.typeNSName}));

    var that = this;
    L.Util.request({
      url: this.options.url,
      data: L.XmlUtil.createXmlDocumentString(requestData),
      success: function (data) {
        var parser = new DOMParser();
        var featureInfo = parser.parseFromString(data, "text/xml").documentElement;
        that.options.namespaceUri = featureInfo.attributes.targetNamespace.value;
      }
    });
  },

  addLayer: function (layer) {
    L.FeatureGroup.prototype.addLayer.call(this, layer);
    if (!layer.feature) {
      layer.feature = {properties: {}};
    }

    if (!layer.state) {
      layer.state = this.state.insert;
      var id = this.getLayerId(layer);
      this.changes[id] = layer;
    }
    return this;
  },

  removeLayer: function (layer) {
    L.FeatureGroup.prototype.removeLayer.call(this, layer);

    var id = this.getLayerId(layer);

    if (id in this.changes) {
      var change = this.changes[id];
      if (change.state === this.state.insert) {
        delete this.changes[id];
      }
      else {
        change.state = this.state.remove;
      }
    }
    else {
      layer.state = this.state.remove;
      this.changes[id] = layer;
    }
  },

  editLayer: function (layer) {
    if (layer.state !== this.state.insert) {
      layer.state = this.state.update;
    }

    var id = this.getLayerId(layer);
    this.changes[id] = layer;
    return this;
  },

  save: function () {
    var transaction = L.XmlUtil.createElementNS('wfs:Transaction', {service: 'WFS', version: this.options.version});

    var inserted = [];

    for (var id in this.changes) {
      var layer = this.changes[id];
      var action = this[layer.state](layer);
      transaction.appendChild(action);

      if (layer.state === this.state.insert) {
        inserted.push(layer);
      }
    }

    var that = this;

    L.Util.request({
      url: this.options.url,
      data: L.XmlUtil.createXmlDocumentString(transaction),
      success: function (data) {
        var insertResult = L.XmlUtil.evaluate('//wfs:InsertResults/wfs:Feature/ogc:FeatureId/@fid', data);
        var filter = new L.Filter.GmlObjectID();
        var id = insertResult.iterateNext();
        while (id) {
          filter.append(id.value);
          id = insertResult.iterateNext();
        }

        inserted.forEach(function (layer) {
          L.FeatureGroup.prototype.removeLayer.call(that, layer);
        });

        that.once('load', function () {
          that.fire('save:success');
          that.changes = {};
        });

        that.loadFeatures(filter);
      }
    });

    return this;
  }
});

L.WFS.Transaction.include({
  gmlFeature: function (layer) {
    var featureNode = L.XmlUtil.createElementNS(this.options.typeNSName, {}, {uri: this.options.namespaceUri});
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      featureNode.appendChild(this.gmlProperty(propertyName,
        feature.properties[propertyName]));
    }

    featureNode.appendChild(this.gmlProperty(this.options.geometryField,
      layer.toGml(this.options.crs)));
    return featureNode;
  },

  gmlProperty: function (name, value) {
    var propertyNode = L.XmlUtil.createElementNS(this.namespaceName(name));
    if (value instanceof Element) {
      propertyNode.appendChild(value);
    }
    else {
      propertyNode.appendChild(L.XmlUtil.createTextNode(value || ''));
    }

    return propertyNode;
  },

  wfsProperty: function (name, value) {
    var propertyNode = L.XmlUtil.createElementNS('wfs:Property');
    propertyNode.appendChild(L.XmlUtil.createElementNS('wfs:Name', {}, {value: name}));
    var valueNode = L.XmlUtil.createElementNS('wfs:Value');
    if (value instanceof Element) {
      valueNode.appendChild(value);
    }
    else {
      valueNode.appendChild(L.XmlUtil.createTextNode(value || ''));
    }

    propertyNode.appendChild(valueNode);

    return propertyNode;
  }
});

L.WFS.Transaction.include({

  insert: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Insert');
    node.appendChild(this.gmlFeature(layer));
    return node;
  },

  update: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Update', {typeName: this.options.typeNSName});
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
    }

    node.appendChild(this.wfsProperty(this.namespaceName(this.options.geometryField),
      layer.toGml(this.options.crs)));

    var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
    node.appendChild(filter.toGml());
    return node;
  },

  remove: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Delete', {typeName: this.options.typeNSName});
    var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
    node.appendChild(filter.toGml());
    return node;
  }
});


})(window, document);