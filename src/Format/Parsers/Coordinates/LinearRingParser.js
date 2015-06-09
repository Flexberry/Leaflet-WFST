/**
 * Created by PRadostev on 09.06.2015.
 */

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
