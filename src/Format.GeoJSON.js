/**
 * Created by PRadostev on 30.01.2015.
 * Translate GeoJSON to leaflet structures
 */

L.Format.GeoJSON = L.Format.extend({

    initialize: function (options) {
        L.Format.prototype.initialize.call(this, options);
        this.requestParams = L.extend(this.requestParams, {outputFormat: 'application/json'});
    },

    responseToLayers: function (rawData) {
        var layers = [];
        var geoJson = JSON.parse(rawData);
        for (var i = 0; i < geoJson.features.length; i++) {
            var layer = L.GeoJSON.geometryToLayer(geoJson.features[i], null, this.options.coordsToLatLng, null);
            layers.push(layer);
        }

        return layers;
    }
});
