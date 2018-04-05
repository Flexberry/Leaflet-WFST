/**
 * Coordinate parser for gml:Point element
 *
 * @class GML.PointNode
 * @extends GML.Geometry
 */

L.GML.PointNode = L.GML.Geometry.extend({
  includes: L.GML.ParserContainerMixin,

  elementTag: 'gml:Point',

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.Pos());
    this.appendParser(new L.GML.Coordinates());
  },

  parse: function (element, options) {
    options = this.elementOptions(element, options);
    return this.parseElement(element.firstElementChild, options);
  }
});
