/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.AbstractMultiPolygon = L.GML.MultiGeometry.extend({

  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.PolygonNode());
  },

  parse: function (element, options) {
    var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var layer;
    if (Array.isArray(latLngs[0]) && L.MultiPolygon) {
      layer = new L.MultiPolygon([]);
    } else {
      layer = new L.Polygon([]);
    }
    layer.setLatLngs(latLngs);
    return layer;
  }
});
