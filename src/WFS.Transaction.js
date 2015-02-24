/**
 * Created by PRadostev on 06.02.2015.
 */

L.WFS.Transaction = L.WFS.extend({

    changes: {},

    initialize: function (options, readFormat) {
        L.WFS.prototype.initialize.call(this, options, readFormat);
        this.changes = {};
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

    addLayer: function (layer) {
        L.FeatureGroup.prototype.addLayer.call(this, layer);
        if (!layer.feature) {
            layer.feature = {properties: {}};
        }

        if (!layer.state) {
            layer.state = this.state.insert;
            var id = this.getLayerId(layer);
            this.changes[id] = layer;
        }
        return this;
    },

    removeLayer: function (layer) {
        L.FeatureGroup.prototype.removeLayer.call(this, layer);

        var id = this.getLayerId(layer);

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

        //return
    },

    editLayer: function (layer) {
        if (layer.state !== this.state.insert) {
            layer.state = this.state.update;
        }

        var id = this.getLayerId(layer);
        this.changes[id] = layer;
        return this;
    },

    save: function () {
        var transaction = this.transaction({version: this.options.version});

        for (var id in this.changes) {
            var layer = this.changes[id];
            var action = this[layer.state](layer);
            transaction.appendChild(action);
        }

        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.createXmlDocumentString(transaction)
        });
        this.changes = {};
        return this;
    }
});