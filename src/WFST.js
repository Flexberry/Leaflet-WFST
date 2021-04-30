L.WFST = L.WFS.extend({
  options: {
    forceMulti: false
  },

  initialize: function (options, readFormat) {
    L.WFS.prototype.initialize.call(this, options, readFormat);
    this.state = L.extend(this.state, {
      insert: 'insertElement',
      update: 'updateElement',
      remove: 'removeElement'
    });

    this.changes = {};
  },

  addLayer: function (layer) {
    L.FeatureGroup.prototype.addLayer.call(this, layer);
    if (!layer.feature) {
      layer.feature = { properties: {} };
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
    var transaction = L.XmlUtil.createElementNS('wfs:Transaction', { service: 'WFS', version: this.options.version });

    if ((this.options.typeNS != null) && (this.options.namespaceUri != null)) {
      transaction.setAttribute("xmlns:" + this.options.typeNS, this.options.namespaceUri);
    }
    
    var inserted = [];

    for (var id in this.changes) {
      var layer = this.changes[id];
      var action = this[layer.state](layer);
      transaction.appendChild(action);

      if (layer.state === this.state.insert) {
        inserted.push(layer);
      }
    }

    var that = this;

    L.Util.request({
      url: this.options.url,
      data: L.XmlUtil.serializeXmlDocumentString(transaction),
      headers: this.options.headers || {},
      withCredentials: this.options.withCredentials,
      success: function (data) {
        var xmlDoc = L.XmlUtil.parseXml(data);
        var exception = L.XmlUtil.parseOwsExceptionReport(xmlDoc);
        if(exception !== null) {
          that.fire('save:failed', exception);
          return;
        }

        var insertResult = L.XmlUtil.evaluate('//wfs:InsertResults/wfs:Feature/ogc:FeatureId/@fid', xmlDoc);
        var insertedIds = [];
        var id = insertResult.iterateNext();
        while (id) {
          insertedIds.push(new L.Filter.GmlObjectID(id.value));
          id = insertResult.iterateNext();
        }

        inserted.forEach(function (layer) {
          L.FeatureGroup.prototype.removeLayer.call(that, layer);
        });

        that.once('load', function (e) {
          that.fire('save:success', { layers: e.layers });
          that.changes = {};
        });

        that.loadFeatures(insertedIds);
      },
      error: function (data) {
        that.fire('save:failed', data);
      }
    });

    return this;
  }
});

L.wfst = function (options, readFormat) {
  return new L.WFST(options, readFormat);
};
