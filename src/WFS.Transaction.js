/**
 * Created by PRadostev on 06.02.2015.
 */

L.WFS.Transaction = L.WFS.extend({

    changes: {},

    namespaceName: function (name) {
        return this.options.typeNS + ':' + name;
    },

    layerGml: function (layer) {
        return layer.toGml(this.options.coordsToLatLng, this.options.crs);
    },

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
    },

    initialize: function (options, readFormat) {
        L.WFS.prototype.initialize.call(this, options, readFormat);
        this.describeFeatureType();
        this.state = L.extend(this.state, {
            insert: 'insert',
            update: 'update',
            remove: 'remove'
        });
    },

    describeFeatureType: function () {
        var requestParams = L.extend({}, this.requestParams, {request: 'DescribeFeatureType'});
        var that = this;
        L.Util.request({
            url: this.options.url,
            params: requestParams,
            success: function (data) {
                var parser = new DOMParser();
                var featureInfo = parser.parseFromString(data, "text/xml");
                that.options.namespaceUri = featureInfo.documentElement.attributes.targetNamespace.value;
            }
        });
    },

    gmlFeature: function (layer) {
        var featureNode = L.XmlUtil.createElementNS(this.requestParams.typeName);
        var feature = layer.feature;
        for (var propertyName in Object.keys(feature.properties)) {
            featureNode.appendChild(this.gmlProperty(this.namespaceName(propertyName),
                feature.properties[propertyName]));
        }

        featureNode.appendChild(this.gmlProperty(this.namespaceName(this.options.geometryField),
            this.layerGml(layer)));
        return featureNode;
    },

    gmlProperty: function (name, value) {
        var propertyNode = L.XmlUtil.createElementNS(this.namespaceName(name));
        if (value instanceof Element) {
            propertyNode.appendChild(value);
        }
        else {
            value.appendChild(L.XmlUtil.createTextNode(value || ''));
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

        return propertyNode;
    },

    save: function () {
        var transaction = this.transaction({version: this.options.version});

        for (var id in this.changes) {
            var layer = this.changes[id];
            var action = this[layer.state](layer, this.options);
            transaction.appendChild(action);
        }

        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.createXmlDocumentString(transaction)
        });
        this.changes = {};
        return this;
    },

    addLayer: function (layer) {
        L.FeatureGroup.prototype.addLayer.call(this, layer);
        if (!layer.state) {
            layer.state = this.state.insert;
            var id = this.getLayerId(layer);
            this.changes[id] = layer;
        }
        return this;
    },

    removeLayer: function (layer) {
        L.FeatureGroup.prototype.removeLayer.call(this, layer);

        var id = layer in this._layers ? layer : this.getLayerId(layer);

        if (id in this.changes) {
            var change = this.changes[id];
            if (change.state === this.state.insert) {
                delete this.changes[id];
            }
            else {
                change.state = this.state.remove;
            }
        }
        else {
            layer.state = this.state.remove;
            this.changes[id] = layer;
        }

        return this;
    },

    editLayer: function (layer) {
        var id = layer in this._layers ? layer : this.getLayerId(layer);
        var lyr = this._layers[id];
        if (lyr.state !== this.state.insert) {
            lyr.state = this.state.update;
        }

        this.changes[id] = lyr;
        return this;
    }
});