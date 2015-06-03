/**
 * Created by PRadostev on 03.06.2015.
 */

L.MultiPolygon.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:MultiPolygon', {srsName: crs.code, srsDimension: 2});
        var collection = node.appendChild(L.XmlUtil.createElementNS('gml:polygonMembers'));
        this.eachLayer(function (polygon) {
            collection.appendChild(polygon.toGml(crs));
        });

        return node;
    }
});