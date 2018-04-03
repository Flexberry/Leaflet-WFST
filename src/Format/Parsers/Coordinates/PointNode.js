/**
 * Created by PRadostev on 08.06.2015.
 */

L.GML.PointNode = L.GML.Geometry.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.elementTag = 'gml:Point';
    this.initializeParserContainer();
    this.appendParser(new L.GML.Pos());
    this.appendParser(new L.GML.Coordinates());
  },

  parse: function (element, options) {
    options = this.elementOptions(element, options);
    return this.parseElement(element.firstChild, options);
  }
});
