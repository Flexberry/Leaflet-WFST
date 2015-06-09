/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.MultiSurfaceParser = L.GML.AbstractMultiPolygonParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolygonParser.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiSurface';
        this.appendParser(new L.GML.PolygonParser());
    }
});