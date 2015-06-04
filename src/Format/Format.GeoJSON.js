/**
 * Created by PRadostev on 30.01.2015.
 * Translate GeoJSON to leaflet structures
 */

L.Format.GeoJSON = L.Format.extend({

    initialize: function (options) {
        L.Format.prototype.initialize.call(this, options);
        this.outputFormat = 'application/json';
    },

    responseToLayers: function (rawData, options) {
        options = options || {};
        var layers = [];
        var geoJson = JSON.parse(rawData);

        for (var i = 0; i < geoJson.features.length; i++) {
            layers.push(this.processFeature(geoJson.features[i], options));
        }

        return layers;
    },

    processFeature: function (feature, options) {
        var layer = this.generateLayer(feature, options);
        layer.feature = feature;
        return layer;
    },

    generateLayer: function (feature, options) {
        return L.GeoJSON.geometryToLayer(feature, options.pointToLayer || null, options.coordsToLatLng, null);
    }
});
