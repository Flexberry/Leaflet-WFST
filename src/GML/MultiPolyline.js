/**
 * Created by PRadostev on 03.06.2015.
 */

L.MultiPolyline.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:MultiLineString', {srsName: crs.code, srsDimension: 2});
        var collection = node.appendChild(L.XmlUtil.createElementNS('gml:lineStringMembers'));
        this.eachLayer(function (polyline) {
            collection.appendChild(polyline.toGml(crs));
        });

        return node;
    }
});