/**
 * Created by PRadostev on 11.08.2015.
 */

L.GML.LineStringNode = L.GML.PointSequence.extend({
  initialize: function () {
    this.elementTag = 'gml:LineString';
    L.GML.PointSequence.prototype.initialize.call(this);
  }
});
