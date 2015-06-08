/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.GeometryParser = L.GML.ElementParser.extend({
    includes: L.GML.ParserContainerMixin,

    statics: {
        DIM: 2
    },

    initialize: function () {
        this.parsers = {};
    },

    dimensions: function (element) {
        if (element.attributes.srsDimension) {
            return parseInt(element.attributes.srsDimension.value);
        }

        return L.GML.GeometryParser.DIM;
    }
});