/**
 * Created by PRadostev on 20.02.2015.
 */

L.Marker.include({
    toGml: function (latLongToCoords) {
        var node = L.XmlUtil.createElementNS('gml:Point');
        var coords = latLongToCoords(this.getLatLng());
        node.appendChild(L.coornidateNode(coords.x + ',' + coords.y));
        return node;
    }
});