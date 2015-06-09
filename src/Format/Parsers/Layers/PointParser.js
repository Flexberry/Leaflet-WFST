/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.PointParser = L.GML.PointNodeParser.extend({
    includes: L.GML.CoordsToLatLngMixin,

    parse: function (element, options) {
        var coords = L.GML.PointNodeParser.prototype.parse.call(this, element);
        var layer = new L.Marker();
        layer.setLatLng(this.transform(coords, options));
        return layer;
    }
});