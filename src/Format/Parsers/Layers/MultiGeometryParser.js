/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.MultiGeometryParser = L.GML.GeometryParser.extend({
    //initialize: function () {
    //    this.singleTag = singleGeometryParser.elementTag.split(':').pop();
    //    this.singleParser = singleGeometryParser;
    //},
    includes: L.GML.ParserContainerMixin,

    initialize: function () {
        this.initializeParserContainer();
    },

    parse: function (element, options) {
        var childObjects = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            var geometryMember = element.childNodes[i];
            if (geometryMember.nodeType !== document.ELEMENT_NODE) continue;

            for (var j = 0; j < geometryMember.childNodes.length; j++) {
                var singleGeometry = geometryMember.childNodes[j];
                if (singleGeometry.nodeType !== document.ELEMENT_NODE) continue;

                childObjects.push(this.parseElement(singleGeometry, options));
            }
        }

        return childObjects;
    }
});