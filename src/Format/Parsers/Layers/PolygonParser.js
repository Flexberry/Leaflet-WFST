/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.PolygonParser = L.GML.GeometryParser.extend({
    includes: L.GML.CoordsToLatLngMixin,

    initialize: function () {
        this.elementTag = 'gml:Polygon';
        this.linearRingParser = new L.GML.LinearRingParser();
    },

    getCoordinates: function (element) {
        var coords = [];
        for (var i = 0; i < element.childNodes.length; i++) {
            //there can be exterior and interior, by GML standard and for leaflet its not significant
            var child = element.childNodes[i];
            if (child.nodeType === document.ELEMENT_NODE) {
                coords.push(this.linearRingParser.parse(child.firstChild));
            }
        }

        return coords;
    },

    parse: function (element, options) {
        var layer = new L.Polygon([]);
        var coords = this.getCoordinates(element);
        layer.setLatLngs(this.transform(coords, options));
        return layer;
    }
});
