/**
 * Created by PRadostev on 28.01.2015.
 */
L.WFS = L.FeatureGroup.extend({

    defaultWFSParams: {
        crs: L.CRS.EPSG3857,
        showExisting: true,
        geometryField: 'shape',
        url: '',
        version: '1.1.0',
        typeName: '',
        style: {
            color: 'black',
            weight: 1
        }
    },

    defaultRequestParams: {
        service: 'WFS',
        request: 'GetCapabilities'
    },

    state: {exist: 'exist'},

    initialize: function (options, readFormat) {
        L.setOptions(this, L.extend(this.defaultWFSParams, options));

        this._layers = {};
        this.readFormat = readFormat || new L.Format.GeoJSON({crs: this.options.crs});

        this.requestParams = L.extend(
            this.defaultRequestParams,
            this.options.requestParams,
            this.readFormat.requestParams,
            {
                version: this.options.version,
                typeName: this.options.typeName,
                srsName: this.options.crs.code
            });

        if (this.options.showExisting) {
            this.loadFeatures();
        }
    },

    loadFeatures: function () {
        var requestParams = L.extend(this.requestParams, {request: 'GetFeature'});
        var self = this;
        L.Util.request({
            url: this.options.url,
            params: requestParams,
            success: function (data) {
                var layers = self.readFormat.responseToLayers(data);
                layers.forEach(function (element) {
                    element.state = self.state.exist;
                    L.setOptions(element, L.extend({}, element.options));
                    self.addLayer(element);
                });

                self.setStyle(self.options.style);
                return self.fire('load');
            }
        });
    },

    describeFeatureType: function () {
        var requestParams = L.extend(this.requestParams, {request: 'DescribeFeatureType'});
        L.Util.request({
            url: this.options.url,
            params: requestParams
        });
    }
});

L.wfs = function (options, readFormat) {
    return new L.WFS(options, readFormat);
};