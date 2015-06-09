/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.PointSequenceParser = L.GML.GeometryParser.extend({
  includes: L.GML.ParserContainerMixin,

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.PosParser());
    this.appendParser(new L.GML.PosListParser());
    this.appendParser(new L.GML.CoordinatesParser());
    this.appendParser(new L.GML.PointNodeParser());
  },

  parse: function (element) {
    var firstChild = element.firstChild;
    var coords = [];
    var tagName = firstChild.tagName;
    if (tagName === 'gml:pos' || tagName === 'gml:Point') {
      var childParser = this.parsers[tagName];
      var elements = element.getElementsByTagName(tagName.split(':')[1]);
      for (var i = 0; i < elements.length; i++) {
        coords.push(childParser.parse(elements[i]));
      }
    }
    else {
      coords = this.parseElement(firstChild, {dimensions: this.dimensions(element)});
    }

    return coords;
  }
});
