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
            var layer = L.GeoJSON.geometryToLayer(geoJson.features[i], options.pointToLayer || null, options.coordsToLatLng, null);
            layer.feature = geoJson.features[i];
            layers.push(layer);
        }

        return layers;
    }
});
