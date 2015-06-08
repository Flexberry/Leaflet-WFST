/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.PointParser = L.GML.GeometryParser.extend({
    initialize: function () {
        L.GML.GeometryParser.prototype.initialize.call(this);
        this.elementTag = 'gml:Point';
        this.appendParser(new L.GML.PosParser());
        this.appendParser(new L.GML.CoordinatesParser());
    },

    parse: function (element) {
        var layer = new L.Marker();
        layer.setLatLng(this.parseElement(element.firstChild, {dimensions: this.dimensions(element)}));
        return layer;
    }
});