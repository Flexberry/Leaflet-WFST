/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.LineString = L.GML.PointSequence.extend({

  includes: L.GML.CoordsToLatLngMixin,

  initialize: function () {
    this.elementTag = 'gml:LineString';
    L.GML.PointSequence.prototype.initialize.call(this);
  },

  parse: function (element, options) {
    var layer = new L.Polyline([]);
    var coordinates = L.GML.PointSequence.prototype.parse.call(this, element);
    var latLngs = this.transform(coordinates, options);
    return layer.setLatLngs(latLngs);
  }
});
