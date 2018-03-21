/**
 * Created by PRadostev on 11.08.2015.
 */

L.GML.PolygonNode = L.GML.Geometry.extend({

  initialize: function () {
    this.elementTag = 'gml:Polygon';
    this.linearRingParser = new L.GML.LinearRing();
  },

  parse: function (element, options) {
    options = this.elementOptions(element, options);
    var coords = [];
    for (var i = 0; i < element.children.length; i++) {

      // there can be exterior and interior, by GML standard and for leaflet its not significant
      var child = element.children[i];
      coords.push(this.linearRingParser.parse(child.firstElementChild, options));
    }

    return coords;
  }
});
