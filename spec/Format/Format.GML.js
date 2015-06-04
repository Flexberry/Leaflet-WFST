/**
 * Created by PRadostev on 03.06.2015.
 */

describe("Format.Gml", function () {
    var gmlFormat;

    var loadData = function (url, done, callback) {
        L.Util.request({
            url: url,
            success: callback,
            error: function () {
                assert.fail('not found test data');
            },
            complete: function () {
                done();
            }
        });
    };

    beforeEach(function () {
        gmlFormat = new L.Format.GML();
    });
    //test for point
    //test for polygon
    //test for multipolygon
    //test for polyline
    //test for multipolyline
});