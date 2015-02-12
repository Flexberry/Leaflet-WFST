/**
 * Created by PRadostev on 06.02.2015.
 */

L.WFS.Transaction = L.WFS.extend({

    changes: {},

    writers: {
        insert: function (layer, options) {
            var layerGml = layer.toGml(options.latLngToCoords);
            L.XmlUtil.setAttributes(layerGml, {srsName: options.crs.code});

            var fieldNode = document.createElementNS(options.namespaceUri, options.featureNS + ':' + options.geometryField);
            fieldNode.appendChild(layerGml);

            var feature = document.createElementNS(options.namespaceUri, options.typeName);
            feature.appendChild(fieldNode);

            var node = L.XmlUtil.createElementNS('wfs:Insert');
            node.appendChild(feature);

            return node;
        },

        update: function (layer) {
            var node = L.XmlUtil.createElementNS('wfs:Update');
            node.appendChild(layer.toGml());

            var filter = new L.Filter.GmlObjectID(layer.feature);
            node.appendChild(filter.toGml());
            return node;
        },

        remove: function (layer) {
            var node = L.XmlUtil.createElementNS('wfs:Delete');
            var filter = new L.Filter.GmlObjectID(layer.feature);
            node.appendChild(filter.toGml());
            return node;
        },

        transaction: function (options) {
            return L.XmlUtil.createElementNS('wfs:Transaction', {service: 'WFS', version: options.version});
        }
    },

    initialize: function (options, readFormat) {
        L.WFS.prototype.initialize.call(this, options, readFormat);
        var name = this.options.typeName;
        this.options.featureNS = name.substring(0, name.indexOf(":"));
        this.state = L.extend(this.state, {
            insert: 'insert',
            update: 'update',
            remove: 'remove'
        });
    },

    save: function () {
        var transaction = this.writers.transaction({version: this.options.version});

        for (var id in this.changes) {
            var layer = this.changes[id];
            var action = this.writers[layer.state](layer, this.options);
            transaction.appendChild(action);
        }

        L.Util.request({
            url: this.options.url,
            method: 'POST',
            data: L.XmlUtil.createXmlDocumentString(transaction)
        });
        this.changes = {};
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