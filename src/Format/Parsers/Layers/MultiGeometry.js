/**
 * Layer parser for gml:MultiGeometry element
 *
 * @class GML.MultiGeometry
 * @extends GML.AbstractMultiGeometry
 */

L.GML.MultiGeometry = L.GML.AbstractMultiGeometry.extend({
  elementTag: 'gml:MultiGeometry',

  initialize: function () {
    L.GML.AbstractMultiGeometry.prototype.initialize.call(this);
	  this.appendParser(new L.GML.Point());
    this.appendParser(new L.GML.LineString());
    this.appendParser(new L.GML.Polygon());
    this.appendParser(new L.GML.MultiLineString());
    this.appendParser(new L.GML.MultiPolygon());
    this.appendParser(new L.GML.MultiCurve());
    this.appendParser(new L.GML.MultiSurface());
    this.appendParser(new L.GML.MultiPoint());
  }
})
