/**
 * Created by PRadostev on 30.01.2015.
 * Translate GeoJSON to leaflet structures
 */

L.Format.GeoJSON = L.Format.Base.extend({

  initialize: function (options) {
    L.Format.Base.prototype.initialize.call(this, options);
    this.outputFormat = 'application/json';
  },

  responseToLayers: function (rawData) {
    var layers = [];
    var geoJson = JSON.parse(rawData);

    for (var i = 0; i < geoJson.features.length; i++) {
      var layer = this.processFeature(geoJson.features[i]);
      if (layer) {
        layers.push(layer);
      }
    }

    return layers;
  },

  processFeature: function (feature) {
    var layer = this.generateLayer(feature);
    if (!layer) {
      return null;
    }

    layer.feature = feature;
    return layer;
  },

  generateLayer: function (feature) {
    return L.GeoJSON.geometryToLayer(feature, this.options || null);
  }
});
