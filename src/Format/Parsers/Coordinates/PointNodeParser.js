/**
 * Created by PRadostev on 08.06.2015.
 */

L.GML.PointNodeParser = L.GML.ElementParser.extend({
    includes: L.GML.ParserContainerMixin,
    initialize: function () {
        this.elementTag = 'gml:Point';
        this.parsers = {};
        this.appendParser(new L.GML.PosParser());
        this.appendParser(new L.GML.CoordinatesParser());
    },

    parse: function (element) {
        return this.parseElement(element.firstChild);
    }
});