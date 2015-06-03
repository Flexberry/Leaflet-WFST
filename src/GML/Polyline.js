/**
 * Created by PRadostev on 06.03.2015.
 */

L.Polyline.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:LineString', {srsName: crs.code, srsDimension: 2});
        node.appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));
        return node;
    }
});
