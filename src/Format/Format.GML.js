/**
 * Created by PRadostev on 30.01.2015.
 */


L.Format.GML = L.Format.extend({

    initialize: function (options) {
        L.Format.prototype.initialize.call(this, options);
        this.outputFormat = 'text/xml; subtype=gml/3.1.1';
    },

    responseToLayers: function (rawData, options) {
        var layers = [];
        var xmlDoc = L.XmlUtil.parseXml(rawData);
        var featureCollection = xmlDoc.documentElement;
        var featureMemberNodes = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMember');
        for (var i = 0; i < featureMemberNodes.length; i++) {
            var feature = featureMemberNodes[i].firstChild;
            layers.push(this.processFeature(feature));
        }

        var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
        if (featureMembersNode.length > 0) {
            var features = featureMembersNode[0].childNodes;
            for (var j = 0; j < features.length; j++) {
                var node = features[j];
                if (node.nodeType === document.ELEMENT_NODE) {
                    layers.push(this.processFeature(node));
                }
            }
        }

        return layers;
    },

    processFeature: function (feature) {

    }
});