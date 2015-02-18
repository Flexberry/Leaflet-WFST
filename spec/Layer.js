/**
 * Created by PRadostev on 17.02.2015.
 */

describe("L.Marker", function () {
    describe("#toGml", function () {
        it('should return Element object', function () {
            var latlng = function () {
                return new L.Point(1, 1)
            };
            var marker = new L.Marker();
            expect(marker.toGml(latlng)).to.be.instanceOf(Element);
        });
    });
});
