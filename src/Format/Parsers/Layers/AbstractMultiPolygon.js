/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.AbstractMultiPolygon = L.GML.AbstractMultiGeometry.extend({

  initialize: function () {
    L.GML.AbstractMultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.PolygonNode());
  },

  parse: function (element, options) {
    var coordinates = L.GML.AbstractMultiGeometry.prototype.parse.call(this, element, options);
    var latLngs = this.transform(coordinates, options);
    var layer = new L.Polygon([]);
    layer.setLatLngs(latLngs);
    return layer;
  }
});
