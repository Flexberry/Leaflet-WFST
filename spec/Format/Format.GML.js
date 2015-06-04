/**
 * Created by PRadostev on 03.06.2015.
 */

describe("Format.Gml", function () {
    var gmlFormat;

    beforeEach(function () {
        gmlFormat = new L.Format.GML();
    });
    //test for feature collection
    describe("FeatureCollection", function () {
        var testData;
        beforeEach(function (done) {
            L.Util.request({
                url: '/base/spec/Format/featurecollection.xml',
                success: function (data) {
                    testData = data;
                    done();
                },
                error: function () {
                    assert.fail('not found test data');
                }
            });
        });

        it('should return array with 10 elements', function () {
            var stub = sinon.stub(gmlFormat, 'processFeature', function () {
                return 0;
            });

            var layers = gmlFormat.responseToLayers(testData, {});
            expect(layers.length).to.be.equal(10);
            stub.restore();
        });
    });
    //test for point
    //test for polygon
    //test for multipolygon
    //test for polyline
    //test for multipolyline
});