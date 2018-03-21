/**
 * Coordinate parser for gml:Polygon element
 *
 * @class GML.PolygonNode
 * @extends GML.Geometry
 */

L.GML.PolygonNode = L.GML.Geometry.extend({

  elementTag: 'gml:Polygon',

  initialize: function () {
    this.linearRingParser = new L.GML.LinearRing();
  },

  parse: function (element, options) {
    options = this.elementOptions(element, options);
    var coords = [];
    for (var i = 0; i < element.children.length; i++) {

      // there can be exterior and interior, by GML standard but for leaflet its not significant
      var child = element.children[i];
      coords.push(this.linearRingParser.parse(child.firstElementChild, options));
    }

    return coords;
  }
});
