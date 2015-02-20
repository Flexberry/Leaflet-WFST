/**
 * Created by PRadostev on 20.02.2015.
 */

L.WFS.Transaction.include({

    insert: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Insert');
        node.appendChild(this.gmlFeature(layer));
        return node;
    },

    update: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Update', {typeName: this.requestParams.typeName});
        var feature = layer.feature;
        for (var propertyName in Object.keys(feature.properties)) {
            node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
        }

        node.appendChild(this.namespaceName(this.options.geometryField), this.layerGml(layer));

        var filter = new L.Filter.GmlObjectID(layer.feature);
        node.appendChild(filter.toGml());
        return node;
    },

    remove: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Delete', {typeName: this.requestParams.typeName});
        var filter = new L.Filter.GmlObjectID(layer.feature);
        node.appendChild(filter.toGml());
        return node;
    },

    transaction: function () {
        return L.XmlUtil.createElementNS('wfs:Transaction', {service: 'WFS', version: this.options.version});
    }
});