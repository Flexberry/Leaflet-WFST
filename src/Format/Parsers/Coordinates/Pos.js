/**
 * Coordinate parser for gml:pos element
 *
 * @class GML.Pos
 * @extends GML.Element
 */

L.GML.Pos = L.GML.Element.extend({
  initialize: function () {
    this.elementTag = 'gml:pos';
  },

  parse: function (element) {
    return element.textContent.split(' ').map(function (coord) {
      return parseFloat(coord);
    });
  }
});
