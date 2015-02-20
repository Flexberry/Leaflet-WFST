/**
 * Created by PRadostev on 20.02.2015.
 */

L.WFS.Transaction.include({
    namespaceName: function (name) {
        return this.options.typeNS + ':' + name;
    },

    gmlFeature: function (layer) {
        var featureNode = L.XmlUtil.createElementNS(this.requestParams.typeName);
        var feature = layer.feature;
        for (var propertyName in feature.properties) {
            featureNode.appendChild(this.gmlProperty(this.namespaceName(propertyName),
                feature.properties[propertyName]));
        }

        featureNode.appendChild(this.gmlProperty(this.namespaceName(this.options.geometryField),
            layer.toGml(this.options.crs)));
        return featureNode;
    },

    gmlProperty: function (name, value) {
        var propertyNode = L.XmlUtil.createElementNS(this.namespaceName(name));
        if (value instanceof Element) {
            propertyNode.appendChild(value);
        }
        else {
            propertyNode.appendChild(L.XmlUtil.createTextNode(value || ''));
        }

        return propertyNode;
    },

    wfsProperty: function (name, value) {
        var propertyNode = L.XmlUtil.createElementNS('wfs:Property');
        propertyNode.appendChild(L.XmlUtil.createElementNS('wfs:Name', {}, {value: name}));
        var valueNode = L.XmlUtil.createElementNS('wfs:Value');
        if (value instanceof Element) {
            valueNode.appendChild(value);
        }
        else {
            valueNode.appendChild(L.XmlUtil.createTextNode(value || ''));
        }

        propertyNode.appendChild(valueNode);

        return propertyNode;
    }
});
