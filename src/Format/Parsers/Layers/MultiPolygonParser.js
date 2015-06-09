/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.MultiPolygonParser = L.GML.MultiGeometryParser.extend({
    initialize: function () {
        L.GML.MultiGeometryParser.prototype.initialize.call(this, new L.GML.PolygonParser());
        this.elementTag = 'gml:MultiPolygon';
    },

    parse: function (element, options) {
        var childLayers = L.GML.MultiGeometryParser.prototype.parse.call(element, options);
        var layer = new L.MultiPolygon([]);
        for (var i = 0; i < childLayers.length; i++) {
            layer.addLayer(childLayers[i]);
        }

        return layer;
    }
});