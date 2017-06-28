/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.AbstractMultiPolyline = L.GML.MultiGeometry.extend({

  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.LineStringNode());
  },

  parse: function (element, options) {
    var latLngs = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var layer;
    if (Array.isArray(latLngs[0]) && L.MultiPolyline) {
      layer = new L.MultiPolyline([]);
    } else {
      layer = new L.Polyline([]);
    }
    layer.setLatLngs(latLngs);
    return layer;
  }
});
