/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.AbstractMultiPolylineParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.AbstractMultiPolylineParser();
    });

    it('should return L.MultiPolyline object', function () {
        var stub = sinon.stub(L.GML.MultiGeometryParser.prototype, 'parse').returns([L.polyline([]), L.polyline([])]);
        var result = parser.parse({});
        expect(result).to.be.instanceOf(L.MultiPolyline);
        stub.restore();
    });
});