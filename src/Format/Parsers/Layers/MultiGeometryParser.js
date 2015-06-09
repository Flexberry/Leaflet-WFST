/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.MultiGeometryParser = L.GML.GeometryParser.extend({
    initialize: function (singleGeometryParser) {
        this.singleTag = singleGeometryParser.elementTag.split(':').pop();
        this.singleParser = singleGeometryParser;
    },

    parse: function (element, options) {
        var childObjects = [];
        var singles = element.getElementsByTagName(this.singleTag);
        for (var i = 0; i < singles.length; i++) {
            childObjects.push(this.singleParser.parse(singles[i], options));
        }

        return childObjects;
    }
});