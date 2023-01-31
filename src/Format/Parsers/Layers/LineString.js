/**
 * Layer parser for gml:LineString element
 *
 * @class GML.LineString
 * @extends GML.LineStringNode
 */

L.GML.LineString = L.GML.LineStringNode.extend({

  includes: L.GML.CoordsToLatLngMixin,
  /**
   * Get layer from passed element
   *
   * @method parse
   * @param {Element} element
   * @param {Object} options
   * @return {L.Layer} polyline layer
   */
  parse: function (element, options) {
    var layer = new L.Polyline([]);
    var coordinates = L.GML.LineStringNode.prototype.parse.call(this, element);
    layer.setLatLngs(this.transform(coordinates, options));
    return layer;
  }
});
