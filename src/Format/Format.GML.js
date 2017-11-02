/**
 * Created by PRadostev on 30.01.2015.
 */


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
      var featureAsLayer = this.processFeature(feature);
      if (featureAsLayer) {
        layers.push(featureAsLayer);
      }
    }

    var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
    if (featureMembersNode.length > 0) {
      var features = featureMembersNode[0].childNodes;
      for (var j = 0; j < features.length; j++) {
        var node = features[j];
        if (node.nodeType !== document.ELEMENT_NODE) {
          continue;
        }

        var nodeAsLayer = this.processFeature(node);
        if (nodeAsLayer) {
          layers.push(nodeAsLayer);
        }
      }
    }

    return layers;
  },

  processFeature: function (feature) {
    var layer = this.generateLayer(feature);
    if (!layer) {
      return null;
    }

    layer.feature = this.featureType.parse(feature);
    return layer;
  },

  generateLayer: function (feature) {
    var geometryField = feature.getElementsByTagNameNS(this.namespaceUri, this.options.geometryField)[0];
    if (!geometryField) {
      console.log(
        'Geometry field \'' + this.options.geometryField + '\' doesn\' exist inside received feature: \'' + feature.innerHTML + '\', ' +
        'so feature will be skipped and won\'t be converted into leaflet layer');

      return null;
    }

    return this.parseElement(geometryField.firstChild, this.options);
  }
});
