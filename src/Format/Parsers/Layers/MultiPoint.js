/**
 * Layer parser for gml:MultiPoint element, creates FeatureGroup layer with Marker members
 *
 * @class GML.MultiPoint
 * @extends GML.AbstractMultiGeometry
 */

L.GML.MultiPoint = L.GML.AbstractMultiGeometry.extend({
  elementTag: 'gml:MultiPoint',

  initialize: function () {
    L.GML.AbstractMultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.PointNode());
  },

  parse: function (element, options) {
    var coordinates = L.GML.AbstractMultiGeometry.prototype.parse.call(this, element, options);
    var latLngs = this.transform(coordinates, options);
    var multiPoint = new L.FeatureGroup();
    for (var i = 0; i < latLngs.length; i++) {
      var point = new L.Marker();
      point.setLatLng(latLngs[i]);
      multiPoint.addLayer(point);
    }

    return multiPoint;
  }
});
