/**
 * Translate GeoJSON to leaflet structures
 *
 * @class Format.GeoJSON
 * @extends Format.Base
 */

L.Format.GeoJSON = L.Format.Base.extend({

  outputFormat: 'application/json',

  /**
   * Convert raw data to leaflet layers array
   *
   * @method responseToLayers
   * @param {string} rawData
   * @return {Array} Array of leaflet layers
   */
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

  /**
   * Create layer and set its properties from geoJson feature
   *
   * @method processFeature
   * @param {json} feature
   * @return {Layer} leaflet layer with "feature" property with feature fields values
   * @private
   */
  processFeature: function (feature) {
    var layer = this.generateLayer(feature);
    if (!layer) {
      return null;
    }

    layer.feature = feature;
    return layer;
  },

  /**
   * Create leaflet layer from geoJson feature
   *
   * @method generateLayer
   * @param {json} feature
   * @return {Layer} leaflet layer
   * @private
   */
  generateLayer: function (feature) {
    var layer = L.GeoJSON.geometryToLayer(feature, this.options || null);
    if (!layer) {
      console.log(
        'Geometry field doesn\' exist inside received feature: \'' + feature + '\', ' +
        'so feature will be skipped and won\'t be converted into leaflet layer');

        return null;
    }

    return layer;
  }
});
