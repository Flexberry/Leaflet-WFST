/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.GeometryParser = L.GML.ElementParser.extend({
    includes: L.GML.ParserContainerMixin,
    dimensions: 2,
    parse: function (element, options) {
        this.dimensions = parseInt(element.attributes.srsDimesion);
    }
});