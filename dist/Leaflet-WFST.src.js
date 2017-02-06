/*! Leaflet-WFST 1.1.0 2016-12-23 */
(function(window, document, undefined) {

"use strict";

L.XmlUtil = {
  namespaces: {
    xlink: 'http://www.w3.org/1999/xlink',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xsd: 'http://www.w3.org/2001/XMLSchema',
    xsi: 'http://www.w3.org/2001/XMLSchema-instance',
    wfs: 'http://www.opengis.net/wfs',
    gml: 'http://www.opengis.net/gml',
    ogc: 'http://www.opengis.net/ogc',
    ows: 'http://www.opengis.net/ows'
  },

  // TODO: find another way to create a new document with doctype text/xml?
  xmldoc: (new DOMParser()).parseFromString('<root />', 'text/xml'),

  setAttributes: function (node, attributes) {
    for (var name in attributes) {
      if (attributes[name] != null && attributes[name].toString) {
        var value = attributes[name].toString();
        var uri = this.namespaces[name.substring(0, name.indexOf(':'))] || null;
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
      uri = this.namespaces[name.substring(0, name.indexOf(':'))];
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
    if (value ||
      value === 0) {

      return this.xmldoc.createTextNode(value);
    }

    return this.xmldoc.createTextNode('');
  },

  serializeXmlDocumentString: function (node) {
    var doc = document.implementation.createDocument('', '', null);
    doc.appendChild(node);
    var serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  },

  serializeXmlToString: function (node) {
    var serializer = new XMLSerializer();
    return serializer.serializeToString(node);
  },

  parseXml: function (rawXml) {
    if (typeof window.DOMParser !== 'undefined') {
      return ( new window.DOMParser() ).parseFromString(rawXml, 'text/xml');
    } else if (typeof window.ActiveXObject !== 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
      var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
      xmlDoc.async = 'false';
      xmlDoc.loadXML(rawXml);
      return xmlDoc;
    } else {
      throw new Error('No XML parser found');
    }
  },

  parseOwsExceptionReport: function(rawXml) {
    var exceptionReportElement = L.XmlUtil.parseXml(rawXml).documentElement;
    if (!exceptionReportElement || exceptionReportElement.tagName !== 'ows:ExceptionReport') {
      return null;
    }

    var exceptionReport = {
      exceptions: [],
      message: ''
    };

    var exceptionsNodes = exceptionReportElement.getElementsByTagNameNS(L.XmlUtil.namespaces.ows, 'Exception');
    for (var i = 0, exceptionsNodesCount = exceptionsNodes.length; i < exceptionsNodesCount; i++) {
      var exceptionNode = exceptionsNodes[i];
      var exceptionCode = exceptionNode.getAttribute('exceptionCode');
      var exceptionsTextNodes = exceptionNode.getElementsByTagNameNS(L.XmlUtil.namespaces.ows, 'ExceptionText');
      var exception = {
        code: exceptionCode,
        text: ''
      };

      for (var j = 0, textNodesCount = exceptionsTextNodes.length; j < textNodesCount; j++) {
        var exceptionTextNode = exceptionsTextNodes[j];
        var exceptionText = exceptionTextNode.innerHTML;

        exception.text += exceptionText;
        if (j < textNodesCount - 1) {
          exception.text += '. ';
        }
      }

      exceptionReport.message += exception.code + ' - ' + exception.text;
      if (i < exceptionsNodesCount - 1) {
        exceptionReport.message += ' ';
      }

      exceptionReport.exceptions.push(exception);
    }

    return exceptionReport;
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
      console.log('Ajax request fail');
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

L.Filter.BBox = L.Filter.extend({
  append: function(bbox, geometryField, crs) {
    var bboxElement = L.XmlUtil.createElementNS('ogc:BBOX');
    bboxElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: geometryField }));
    bboxElement.appendChild(bbox.toGml(crs));

    this.filter.appendChild(bboxElement);

    return this; 
  }
});

L.Filter.Intersects = L.Filter.extend({
  append: function(geometryLayer, geometryField, crs) {
    var intersectsElement = L.XmlUtil.createElementNS('ogc:Intersects');
    intersectsElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: geometryField }));
    intersectsElement.appendChild(geometryLayer.toGml(crs));

    this.filter.appendChild(intersectsElement);

    return this; 
  }
});

L.Filter.EQ = L.Filter.extend({
  append: function (name, val) {
    var eqElement = L.XmlUtil.createElementNS('ogc:PropertyIsEqualTo');
    var nameElement = L.XmlUtil.createElementNS('ogc:PropertyName', {}, {value: name});
    var valueElement = L.XmlUtil.createElementNS('ogc:Literal', {}, {value: val});
    eqElement.appendChild(nameElement);
    eqElement.appendChild(valueElement);
    this.filter.appendChild(eqElement);
    return this;
  }
});

L.Format = {};

L.Format.Scheme = L.Class.extend({
  options: {
    geometryField: 'Shape',
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  parse: function (element) {
    var featureType = new L.GML.FeatureType({
      geometryField: this.options.geometryField
    });
    var complexTypeDefinition = element.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'complexType')[0];
    var properties = complexTypeDefinition.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'sequence')[0];
    for (var i = 0; i < properties.childNodes.length; i++) {
      var node = properties.childNodes[i];
      if (node.nodeType !== document.ELEMENT_NODE) {
        continue;
      }

      var propertyAttr = node.attributes.name;
      if (!propertyAttr) {
        continue;
      }

      var propertyName = node.attributes.name.value;
      if (propertyName === this.options.geometryField) {
        continue;
      }

      var typeAttr = node.attributes.type;
      if (!typeAttr) {
        var restriction = node.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'restriction');
        typeAttr = restriction.attributes.base;
      }

      if (!typeAttr) {
        continue;
      }

      var typeName = typeAttr.value.split(':').pop();

      featureType.appendField(propertyName, typeName);
    }

    return featureType;
  }
});

L.Format.Base = L.Class.extend({
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
    },
    geometryField: 'Shape'
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
  },

  setFeatureDescription: function (featureInfo) {
    this.namespaceUri = featureInfo.attributes.targetNamespace.value;
    var schemeParser = new L.Format.Scheme({
      geometryField: this.options.geometryField
    });
    this.featureType = schemeParser.parse(featureInfo);
  }
});

L.Format.GeoJSON = L.Format.Base.extend({

  initialize: function (options) {
    L.Format.Base.prototype.initialize.call(this, options);
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
    return L.GeoJSON.geometryToLayer(feature, this.options || null, this.options.coordsToLatLng || null, null);
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

L.GML.Element = L.Class.extend({
  elementTag: '',
  parse: function () {
    throw('not implemented parse function in parser for ' + this.elementTag);
  }
});

L.GML.Geometry = L.GML.Element.extend({
  statics: {
    DIM: 2
  },

  dimensions: function (element) {
    if (element.attributes.srsDimension) {
      return parseInt(element.attributes.srsDimension.value);
    }

    return L.GML.Geometry.DIM;
  }
});

L.GML.Coordinates = L.GML.Element.extend({

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

L.GML.Pos = L.GML.Element.extend({
  initialize: function () {
    this.elementTag = 'gml:pos';
  },

  parse: function (element) {
    return element.textContent.split(' ').map(function (coord) {
      return parseFloat(coord);
    });
  }
});

L.GML.PosList = L.GML.Element.extend({
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

L.GML.PointNode = L.GML.Geometry.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.elementTag = 'gml:Point';
    this.initializeParserContainer();
    this.appendParser(new L.GML.Pos());
    this.appendParser(new L.GML.Coordinates());
  },

  parse: function (element) {
    return this.parseElement(element.firstChild, {dimensions: this.dimensions(element)});
  }
});

L.GML.PointSequence = L.GML.Geometry.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.Pos());
    this.appendParser(new L.GML.PosList());
    this.appendParser(new L.GML.Coordinates());
    this.appendParser(new L.GML.PointNode());
  },

  parse: function (element) {
    var firstChild = element.firstChild;
    var coords = [];
    var tagName = firstChild.tagName;
    if (tagName === 'gml:pos' || tagName === 'gml:Point') {
      var childParser = this.parsers[tagName];
      var elements = element.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, tagName.split(':').pop());
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

L.GML.LinearRing = L.GML.PointSequence.extend({
  initialize: function () {
    L.GML.PointSequence.prototype.initialize.call(this);
    this.elementTag = 'gml:LinearRing';
  },

  parse: function (element) {
    var coords = L.GML.PointSequence.prototype.parse.call(this, element);
    //for leaflet polygons its not recommended insert additional last point equal to the first one
    coords.pop();
    return coords;
  }
});

L.GML.LineStringNode = L.GML.PointSequence.extend({
  initialize: function () {
    this.elementTag = 'gml:LineString';
    L.GML.PointSequence.prototype.initialize.call(this);
  },

  parse: function (element) {
    return L.GML.PointSequence.prototype.parse.call(this, element);
  }
});

L.GML.PolygonNode = L.GML.Geometry.extend({

  initialize: function () {
    this.elementTag = 'gml:Polygon';
    this.linearRingParser = new L.GML.LinearRing();
  },

  parse: function (element) {
    var coords = [];
    for (var i = 0; i < element.childNodes.length; i++) {
      //there can be exterior and interior, by GML standard and for leaflet its not significant
      var child = element.childNodes[i];
      if (child.nodeType === document.ELEMENT_NODE) {
        coords.push(this.linearRingParser.parse(child.firstChild));
      }
    }

    return coords;
  }
});

L.GML.CoordsToLatLngMixin = {
  transform: function (coordinates, options) {
    if (Array.isArray(coordinates[0])) {
      var latLngs = [];
      for (var i = 0; i < coordinates.length; i++) {
        latLngs.push(this.transform(coordinates[i], options));
      }

      return latLngs;
    }

    return options.coordsToLatLng(coordinates);
  }
};

L.GML.Point = L.GML.PointNode.extend({
  includes: L.GML.CoordsToLatLngMixin,

  parse: function (element, options) {
    var coords = L.GML.PointNode.prototype.parse.call(this, element);
    var layer = new L.Marker();
    layer.setLatLng(this.transform(coords, options));
    return layer;
  }
});

L.GML.LineString = L.GML.LineStringNode.extend({

  includes: L.GML.CoordsToLatLngMixin,

  parse: function (element, options) {
    var layer = new L.Polyline([]);
    var coordinates = L.GML.LineStringNode.prototype.parse.call(this, element);
    layer.setLatLngs(this.transform(coordinates, options));
    return layer;
  }
});

L.GML.Polygon = L.GML.PolygonNode.extend({

  includes: L.GML.CoordsToLatLngMixin,

  parse: function (element, options) {
    var layer = new L.Polygon([]);
    var coordinates = L.GML.PolygonNode.prototype.parse.call(this, element);
    layer.setLatLngs(this.transform(coordinates, options));
    return layer;
  }
});

L.GML.MultiGeometry = L.GML.Geometry.extend({
  includes: [L.GML.ParserContainerMixin, L.GML.CoordsToLatLngMixin],

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

    return this.transform(childObjects, options);
  }
});

L.GML.AbstractMultiPolyline = L.GML.MultiGeometry.extend({

  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.LineStringNode());
  },

  parse: function (element, options) {
    var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var layer = new L.Polyline([]);
    layer.setLatLngs(latLngs);
    return layer;
  }
});

L.GML.AbstractMultiPolygon = L.GML.MultiGeometry.extend({

  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.PolygonNode());
  },

  parse: function (element, options) {
    var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var layer = new L.Polygon([]);
    layer.setLatLngs(latLngs);
    return layer;
  }
});

L.GML.MultiLineString = L.GML.AbstractMultiPolyline.extend({
  initialize: function () {
    L.GML.AbstractMultiPolyline.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiLineString';
  }
});

L.GML.MultiCurve = L.GML.AbstractMultiPolyline.extend({
  initialize: function () {
    L.GML.AbstractMultiPolyline.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiCurve';
  }
});

L.GML.MultiPolygon = L.GML.AbstractMultiPolygon.extend({
  initialize: function () {
    L.GML.AbstractMultiPolygon.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiPolygon';
  }
});

L.GML.MultiSurface = L.GML.AbstractMultiPolygon.extend({
  initialize: function () {
    L.GML.AbstractMultiPolygon.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiSurface';
  }
});

L.GML.MultiPoint = L.GML.MultiGeometry.extend({
  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiPoint';
    this.appendParser(new L.GML.PointNode());
  },

  parse: function (element, options) {
    var coordinates = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var multiPoint = new L.FeatureGroup();
    for (var i = 0; i < coordinates.length; i++) {
      var point = new L.Marker();
      point.setLatLng(coordinates[i]);
      multiPoint.addLayer(point);
    }

    return multiPoint;
  }
});

L.GML.FeatureType = L.Class.extend({
  options: {
    geometryField: 'Shape',
  },

  primitives: [
    {
      types: ['byte', 'decimal', 'int', 'integer', 'long', 'short'],
      parse: function (input) {
        return Number(input);
      }
    },
    {
      types: ['string'],
      parse: function (input) {
        return input;
      }
    },
    {
      types: ['boolean'],
      parse: function (input) {
        return input !== 'false';
      }
    },
    {
      types: ['date', 'time', 'datetime'],
      parse: function (input) {
        return new Date(input);
      }
    }
  ],

  initialize: function (options) {
    L.setOptions(this, options);

    this.fields = {};
  },

  appendField: function (name, type) {
    var that = this;
    this.primitives.forEach(function (primitive) {
      if (primitive.types.indexOf(type) !== -1) {
        that.fields[name] = primitive.parse;
      }
    });
  },

  parse: function (feature) {
    var properties = {};
    for (var i = 0; i < feature.childNodes.length; i++) {
      var node = feature.childNodes[i];
      if (node.nodeType !== document.ELEMENT_NODE) {
        continue;
      }

      var propertyName = node.tagName.split(':').pop();
      if (propertyName === this.options.geometryField) {
        continue;
      }

      var parseField = this.fields[propertyName];
      if (!parseField) {
        this.appendField(propertyName, "string");
        parseField = this.fields[propertyName];
      }

      properties[propertyName] = parseField(node.textContent);
    }

    return {
      type: 'Feature',
      properties: properties,
      id: feature.attributes['gml:id'].value
    };
  }
});

L.Format.GML = L.Format.Base.extend({

  includes: L.GML.ParserContainerMixin,

  initialize: function (options) {
    L.Format.Base.prototype.initialize.call(this, options);
    this.outputFormat = 'text/xml; subtype=gml/3.1.1';
    this.initializeParserContainer();
    this.appendParser(new L.GML.Point());
    this.appendParser(new L.GML.LineString());
    this.appendParser(new L.GML.Polygon());
    this.appendParser(new L.GML.MultiLineString());
    this.appendParser(new L.GML.MultiPolygon());
    this.appendParser(new L.GML.MultiCurve());
    this.appendParser(new L.GML.MultiSurface());
    this.appendParser(new L.GML.MultiPoint());
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
    var layer = this.generateLayer(feature);
    layer.feature = this.featureType.parse(feature);
    return layer;
  },

  generateLayer: function (feature) {
    var geometryField = feature.getElementsByTagNameNS(this.namespaceUri, this.options.geometryField)[0];
    if (!geometryField) {
      throw new Error(
        'Geometry field \'' +
        this.options.geometryField +
        '\' doesn\' exist inside received feature: \'' +
        feature.innerHTML +
        '\'');
    }

    return this.parseElement(geometryField.firstChild, this.options);
  }
});

L.Util.project = function (crs, latlngs) {
  if (L.Util.isArray(latlngs)) {
    var result = [];
    latlngs.forEach(function (latlng) {
      result.push(L.Util.project(crs, latlng));
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

L.LatLngBounds.prototype.toGml = function (crs) {
  var projectedSW = crs.project(this.getSouthWest());
  var projectedNE = crs.project(this.getNorthEast());

  var envelopeElement = L.XmlUtil.createElementNS('gml:Envelope', { srsName: crs.code });
  envelopeElement.appendChild(L.XmlUtil.createElementNS('gml:lowerCorner', {}, { value: projectedSW.x + ' ' + projectedSW.y }));
  envelopeElement.appendChild(L.XmlUtil.createElementNS('gml:upperCorner', {}, { value: projectedNE.x + ' ' + projectedNE.y }));

  return envelopeElement;
};

L.Marker.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:Point', {srsName: crs.code});
    node.appendChild(L.GMLUtil.posNode(L.Util.project(crs, this.getLatLng())));
    return node;
  }
});

L.Polygon.include({
  toGml: function (crs) {
    var polygons = this.getLatLngs();
    var gmlPolygons = [];

    for (var i = 0; i < polygons.length; i++) {
      var polygonCoordinates = polygons[i];
      var flat = L.Polyline._flat(polygonCoordinates);
      var node = L.XmlUtil.createElementNS('gml:Polygon', {srsName: crs.code, srsDimension: 2});
      node.appendChild(L.XmlUtil.createElementNS('gml:exterior'))
        .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
        .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, flat ? polygonCoordinates : polygonCoordinates[0]), true));

      if (!flat) {
        for (var hole = 1; hole < polygonCoordinates.length; hole++) {
          node.appendChild(L.XmlUtil.createElementNS('gml:interior'))
            .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
            .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, polygonCoordinates[hole]), true));
        }
      }

      gmlPolygons.push(node);
    }

    if (gmlPolygons.length === 1) return gmlPolygons[0];

    // else make multipolygon
    var multi = L.XmlUtil.createElementNS('gml:MultiPolygon', {srsName: crs.code, srsDimension: 2});
    var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:polygonMembers'));
    for (var p = 0; p < gmlPolygons.length; p++) {
      collection.appendChild(gmlPolygons[p]);
    }

    return multi;
  }
});

L.Polyline.include({
  _lineStringNode: function (crs, latlngs) {
    var node = L.XmlUtil.createElementNS('gml:LineString', {srsName: crs.code, srsDimension: 2});
    node.appendChild(L.GMLUtil.posListNode(L.Util.project(crs, latlngs), false));
    return node;
  },

  toGml: function (crs) {
    var latLngs = this.getLatLngs();
    if (L.Polyline._flat(latLngs)) return this._lineStringNode(crs, latLngs);

    //we have multiline
    var multi = L.XmlUtil.createElementNS('gml:MultiLineString', {srsName: crs.code, srsDimension: 2});
    var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:lineStringMembers'));
    for (var i = 0; i < latLngs.length; i++) {
      collection.appendChild(this._lineStringNode(crs, latLngs[i]));
    }

    return multi;
  }
});

var PropertiesMixin = {
  setProperties: function (obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        this.feature.properties[i] = obj[i];
      }
    }
  },
  getProperty: function (field) {
    return this.feature.properties[field];
  },
  deleteProperties: function (arr) {
    for (var i = 0; i < arr.length; i++) {
      if (this.feature.properties.hasOwnProperty(arr[i])) {
        delete this.feature.properties[arr[i]];
      }
    }
  }
};
L.Marker.include(PropertiesMixin);
L.Path.include(PropertiesMixin);

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

L.WFST = L.WFS.extend({
  initialize: function (options, readFormat) {
    L.WFS.prototype.initialize.call(this, options, readFormat);
    this.state = L.extend(this.state, {
      insert: 'insert',
      update: 'update',
      remove: 'remove'
    });

    this.changes = {};
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
      data: L.XmlUtil.serializeXmlDocumentString(transaction),
      headers: this.options.headers || {},
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

L.wfst = function (options, readFormat) {
  return new L.WFST(options, readFormat);
};

L.WFST.include({
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
      propertyNode.appendChild(L.XmlUtil.createTextNode(value));
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
      valueNode.appendChild(L.XmlUtil.createTextNode(value));
    }

    propertyNode.appendChild(valueNode);

    return propertyNode;
  }
});

L.WFST.include({

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