/**
 * Abstract base class for parsing point sequences
 *
 * @class GML.PointSequence
 * @extends GML.Geometry
 */

L.GML.PointSequence = L.GML.Geometry.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.Pos());
    this.appendParser(new L.GML.PosList());
    this.appendParser(new L.GML.Coordinates());
    this.appendParser(new L.GML.PointNode());
  },

  parse: function (element, options) {
    options = this.elementOptions(element, options);
    var firstChild = element.firstElementChild;
    var coords = [];
    var tagName = firstChild.tagName;
    if (tagName === 'gml:pos' || tagName === 'gml:Point') {
      var childParser = this.parsers[tagName];
      var elements = element.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, tagName.split(':').pop());
      for (var i = 0; i < elements.length; i++) {
        coords.push(childParser.parse(elements[i], options));
      }
    }
    else {
      coords = this.parseElement(firstChild, options);
    }

    return coords;
  }
});
