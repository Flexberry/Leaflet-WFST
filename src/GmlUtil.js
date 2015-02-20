/**
 * Created by PRadostev on 20.02.2015.
 */

L.GMLUtil = {
    coordinateNode: function (value) {
        return L.XmlUtil.createElementNS('gml:coordinates', {cs: ',', decimal: '.', ts: ' '}, {value: value});
    }
};

L.coornidateNode = L.GMLUtil.coordinateNode;