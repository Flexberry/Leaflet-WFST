/**
 * Created by PRadostev on 30.01.2015.
 */


L.Format.GML = L.Format.extend({});

L.GMLUtil = {
    coordinateNode: function (value) {
        return L.XmlUtil.createElementNS('gml:coordinates', {cs: ',', decimal: '.', ts: ' '}, {value: value});
    }
};

L.coornidateNode = L.GMLUtil.coordinateNode;

L.Marker.include({
    toGml: function (latLongToCoords) {
        var node = L.XmlUtil.createElementNS('gml:Point');
        var coords = latLongToCoords(this.getLatLng());
        node.appendChild(L.coornidateNode(coords.x + ',' + coords.y));
        return node;
    }
});
