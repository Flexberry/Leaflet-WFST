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
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:Point', {srsName: crs.code});
        node.appendChild(L.coornidateNode(this.getLatLng().lng + ',' + this.getLatLng().lat));
        return L.XmlUtil.createXmlString(node);
    }
});
