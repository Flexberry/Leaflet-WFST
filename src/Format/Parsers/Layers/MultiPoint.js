/**
 * Created by PRadostev on 10.06.2015.
 */

L.GML.MultiPoint = L.GML.MultiGeometry.extend({
  initialize: function () {
    L.GML.MultiGeometry.prototype.initialize.call(this);
    this.elementTag = 'gml:MultiPoint';
    this.appendParser(new L.GML.Point());
  },

  parse: function (element, options) {
    var layers = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    return new L.FeatureGroup(layers);
  }
});
