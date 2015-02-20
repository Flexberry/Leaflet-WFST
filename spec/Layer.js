/**
 * Created by PRadostev on 17.02.2015.
 */

describe("L.Marker", function () {
    describe("#toGml", function () {
        it('should return Element object', function () {
            var marker = new L.Marker([0, 0]);
            expect(marker.toGml(L.CRS.EPSG3395)).to.be.instanceOf(Element);
        });
    });
});
