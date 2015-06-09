/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.LineStringParser = L.GML.PointSequenceParser.extend({

    includes: L.GML.CoordsToLatLngMixin,

    initialize: function () {
        this.elementTag = 'gml:LineString';
        L.GML.PointSequenceParser.prototype.initialize.call(this);
    },

    parse: function (element, options) {
        var layer = new L.Polyline([]);
        var coordinates = L.GML.PointSequenceParser.prototype.parse.call(this, element);
        var latLngs = this.transform(coordinates, options);
        return layer.setLatLngs(latLngs);
    }
});