/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.MultiCurveParser = L.GML.AbstractMultiPolylineParser.extend({
    initialize: function () {
        L.GML.AbstractMultiPolylineParser.prototype.initialize.call(this);
        this.elementTag = 'gml:MultiCurve';
        this.appendParser(new L.GML.LineStringParser());
    }
});