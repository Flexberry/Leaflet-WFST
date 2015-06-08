/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.LineStringParser = L.GML.GeometryParser.extend({
    initialize: function () {
        L.GML.GeometryParser.prototype.initialize.call(this);
        this.elementTag = 'gml:LineString';
        this.appendParser(new L.GML.PosParser());
        this.appendParser(new L.GML.PosListParser());
        this.appendParser(new L.GML.CoordinatesParser());
        this.appendParser(new L.GML.PointNodeParser());
    },

    parse: function (element, options) {
        var layer = new L.Polyline([]);
        var coordinates = this.getCoordinates(element);
        var latLngs = this.transform(coordinates, options);
        return layer.setLatLngs(latLngs);
    },

    transform: function (coordinates, options) {
        var latLngs = [];
        for (var i = 0; i < coordinates.length; i++) {
            latLngs.push(options.coordsToLatLng(coordinates[i]));
        }

        return latLngs;
    },

    // returns raw coordinates array exactly its in response
    getCoordinates: function (element) {
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