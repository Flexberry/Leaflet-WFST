/**
 * Layer parser for gml:MultiPoint element, creates FeatureGroup layer with Marker members
 *
 * @class GML.MultiPoint
 * @extends GML.MultiGeometry
 */

L.GML.MultiPoint = L.GML.MultiGeometry.extend({
  elementTag: 'gml:MultiPoint',

  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.appendParser(new L.GML.PointNode());
  },

  parse: function (element, options) {
    var coordinates = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var multiPoint = new L.FeatureGroup();
    for (var i = 0; i < coordinates.length; i++) {
      var point = new L.Marker();
      point.setLatLng(coordinates[i]);
      multiPoint.addLayer(point);
    }

    return multiPoint;
  }
});
