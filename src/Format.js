/**
 * Created by PRadostev on 30.01.2015.
 */

L.Format = L.Class.extend({
    requestParams: {},

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
        }
    },

    initialize: function (options) {
        L.setOptions(this, L.extend(this.defaultOptions, options));
        var crs = this.options.crs;
        if (crs !== undefined) {
            this.options.coordsToLatLng = function (coords) {
                var point = L.point(coords[0], coords[1]);
                return crs.projection.unproject(point);
            };
            this.options.latLngToCoords = function (ll) {
                var point = new L.latLng(ll[0], ll[1]);
                return crs.projection.project(point);
            };
        }
    }
});