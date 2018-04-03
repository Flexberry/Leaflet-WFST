/**
 * Coordinate array parser for linearRing element
 *
 * @class GML.LinearRing
 * @extends GML.PointSequence
 */

L.GML.LinearRing = L.GML.PointSequence.extend({
  initialize: function () {
    L.GML.PointSequence.prototype.initialize.call(this);
    this.elementTag = 'gml:LinearRing';
  },

  /**
   * Parse element into array of coordinates
   *
   * @method parse
   * @param {Element} element
   * @param {Object} options
   * @return {Array} array of L.Point
   */
  parse: function (element, options) {
    var coords = L.GML.PointSequence.prototype.parse.call(this, element, options);

    // for leaflet polygons its not recommended insert additional last point equal to the first one,
    // but GML linearRing contains it
    coords.pop();
    return coords;
  }
});
