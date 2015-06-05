/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.PointParser = L.GML.GeometryParser.extend({
    initialize: function () {
        this.elementTag = 'gml:Point';
        this.appendParser(new L.GML.PosParser());
        this.appendParser(new L.GML.CoordinatesParser());
    },

    parse: function (element) {
        L.GML.GeometryParser.prototype.parse.call(this, element);
        var layer = new L.Marker();
        layer.setLatLng(this.parseElement(element.firstChild, {dimensions: this.dimensions}));
        return layer;
    }
});