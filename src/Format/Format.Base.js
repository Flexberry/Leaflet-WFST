/**
 * Created by PRadostev on 10.06.2015.
 */

L.Format.Base = L.Class.extend({
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

  setFeatureDescription: function (featureInfo) {
    this.namespaceUri = featureInfo.attributes.targetNamespace.value;
    var schemeParser = new L.Format.Scheme(this.options.geometryField);
    this.featureType = schemeParser.parse(featureInfo);
  }
  
  layerEvents: function (layer) {
    var _propagateEvent = function (e) {
      e = L.extend({
       layer: layer,
	   target: e.target
      }, e);
      layer.fire(e.type, e);
	}
	if (layer instanceof L.MultiPolygon || layer instanceof L.Multipolyline) {
	  layer.eachLayer(function (layer) {
	    layer.off(L.FeatureGroup.EVENTS);
		layer.on(L.FeatureGroup.EVENTS, _propagateEvent, this);
	  });  
	}
  }
});
