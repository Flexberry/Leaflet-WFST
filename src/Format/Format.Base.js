/**
 *
 * Base format description for parsing wfs responses
 *
 * @class Format.Base
 * @extends L.Class
 */

L.Format.Base = L.Class.extend({

  /**
   * @property defaultOptions
   */
  defaultOptions: {
    crs: L.CRS.EPSG3857,
    coordsToLatLng: function (coords) {
      return new L.LatLng(coords[1], coords[0], coords[2]);
    },
    latLngToCoords: function (latlng) {
      var coords = [latlng.lng, latlng.lat];
      if (latlng.alt !== undefined) {
        coords.push(latlng.alt);
      }
      return coords;
    },
    geometryField: 'Shape'
  },

  initialize: function (options) {
    L.setOptions(this, L.extend({}, this.defaultOptions, options));
    if (options.crs) {
      var crs = options.crs;
      this.options.coordsToLatLng = function (coords) {
        var point = L.point(coords[0], coords[1]);
        var ll = crs.projection.unproject(point);
        if (coords[2]) {
          ll.alt = coords[2];
        }
        return ll;
      };
      this.options.latLngToCoords = function (ll) {
        var latLng = L.latLng(ll);
        return crs.projection.project(latLng);
      };
    }
  },

  /**
   * Generate feature description by response from DescribeFeatureType
   *
   * @method setFeatureDescription
   * @param {Element} featureInfo response from WFS DescribeFeatureType request
   */
  setFeatureDescription: function (featureInfo) {
    this.namespaceUri = featureInfo.attributes.targetNamespace.value;
    var schemeParser = new L.Format.Scheme({
      geometryField: this.options.geometryField
    });
    this.featureType = schemeParser.parse(featureInfo);
  },

  responseToLayers: function() {
    throw "responseToLayers is abstract and should be implemented";
  }
});
