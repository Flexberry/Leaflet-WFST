/**
 * Parser for WFS responses with GML3 syntax
 *
 * @class Format.GML
 * @extends Format.Base
 * @uses GML.ParserContainerMixin
 */

L.Format.GML = L.Format.Base.extend({

  includes: L.GML.ParserContainerMixin,

  outputFormat: 'text/xml; subtype=gml/3.1.1',

  initialize: function (options) {
    L.Format.Base.prototype.initialize.call(this, options);
    this.initializeParserContainer();
    this.appendParser(new L.GML.Point());
    this.appendParser(new L.GML.LineString());
    this.appendParser(new L.GML.Polygon());
    this.appendParser(new L.GML.MultiLineString());
    this.appendParser(new L.GML.MultiPolygon());
    this.appendParser(new L.GML.MultiCurve());
    this.appendParser(new L.GML.MultiSurface());
    this.appendParser(new L.GML.MultiPoint());
    this.appendParser(new L.GML.MultiGeometry());
  },

  /**
   * Convert raw data to leaflet layers array
   *
   * @method responseToLayers
   * @param {string} rawData
   * @return {Array} Array of leaflet layers
   */
  responseToLayers: function (rawData) {
    var layers = [];
    var xmlDoc = L.XmlUtil.parseXml(rawData);
    var featureCollection = xmlDoc.documentElement;
    var featureMemberNodes = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMember');
    for (var i = 0; i < featureMemberNodes.length; i++) {
      var feature = featureMemberNodes[i].firstElementChild;
      var featureAsLayer = this.processFeature(feature);
      if (featureAsLayer) {
        layers.push(featureAsLayer);
      }
    }

    var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
    if (featureMembersNode.length > 0) {
      var features = featureMembersNode[0].children;
      for (var j = 0; j < features.length; j++) {
        var node = features[j];
        var nodeAsLayer = this.processFeature(node);
        if (nodeAsLayer) {
          layers.push(nodeAsLayer);
        }
      }
    }

    return layers;
  },

  /**
   * Create layer and set its properties from xml feature element
   *
   * @method processFeature
   * @param {Element} feature
   * @return {Layer} leaflet layer with "feature" property with feature fields values
   * @private
   */
  processFeature: function (feature) {
    var layer = this.generateLayer(feature);
    if (!layer) {
      return null;
    }

    layer.feature = this.featureType.parse(feature);
    return layer;
  },

  /**
   * Create leaflet layer from xml feature element
   *
   * @method generateLayer
   * @param {Element} feature
   * @return {Layer} leaflet layer
   * @private
   */
  generateLayer: function (feature) {
    var geometryField = feature.getElementsByTagNameNS(this.namespaceUri, this.options.geometryField)[0];
    if (!geometryField) {
      console.log(
        'Geometry field \'' + this.options.geometryField + '\' doesn\' exist inside received feature: \'' + feature.innerHTML + '\', ' +
        'so feature will be skipped and won\'t be converted into leaflet layer');

      return null;
    }

    return this.parseElement(geometryField.firstElementChild, this.options);
  }
});
