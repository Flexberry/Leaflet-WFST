/**
 * Created by PRadostev on 28.01.2015.
 */
L.WFS = L.FeatureGroup.extend({

    options: {
        crs: L.CRS.EPSG3857,
        showExisting: true,
        geometryField: 'Shape',
        url: '',
        version: '1.1.0',
        typeNS: '',
        typeName: '',
        style: {
            color: 'black',
            weight: 1
        },
        namespaceUri: ''
    },

    state: {exist: 'exist'},

    initialize: function (options, readFormat) {
        L.setOptions(this, options);
        var crs = this.options.crs;

        this.options.coordsToLatLng = function (coords) {
            var point = L.point(coords[0], coords[1]);
            return crs.projection.unproject(point);
        };

        this.options.latLngToCoords = function (latlng) {
            var coords = crs.projection.project(latlng);

            if (latlng.alt !== undefined) {
                coords.push(latlng.alt);
            }
            return coords;
        };

        this._layers = {};

        this.readFormat = readFormat || new L.Format.GeoJSON();

        this.requestParams = L.extend(
            {
                service: 'WFS',
                version: this.options.version,
                typeName: (this.options.typeNS ? this.options.typeNS + ':' : '') + this.options.typeName,
                srsName: this.options.crs.code
            },
            this.options.requestParams);

        if (this.options.showExisting) {
            this.loadFeatures();
        }
    },

    loadFeatures: function () {
        var requestParams = L.extend({}, this.requestParams, this.readFormat.requestParams, {request: 'GetFeature'});
        var that = this;
        L.Util.request({
            url: this.options.url,
            params: requestParams,
            success: function (data) {
                var layers = that.readFormat.responseToLayers(data, that.options.coordsToLatLng);
                layers.forEach(function (element) {
                    element.state = that.state.exist;
                    that.addLayer(element);
                });

                that.setStyle(that.options.style);
                that.fire('load');
                return that;
            }
        });
    }
});

L.wfs = function (options, readFormat) {
    return new L.WFS(options, readFormat);
};