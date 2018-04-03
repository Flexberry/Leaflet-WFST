/**
 * Coordinate parser for gml:LineString element.
 *
 * @class GML.LineStringNode
 * @extends GML.PointSequence
 */

L.GML.LineStringNode = L.GML.PointSequence.extend({
  initialize: function () {
    this.elementTag = 'gml:LineString';
    L.GML.PointSequence.prototype.initialize.call(this);
  }
});
