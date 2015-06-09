/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.MultiLineStringParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.MultiLineStringParser();
    });

    it('should parse gml:MultiLineString element', function () {
        expect(parser.elementTag).to.equal('gml:MultiLineString');
    });

    it('should parse line strings', function () {
        expect(parser.singleParser).to.be.instanceOf(L.GML.LineStringParser);
    });

    it('should return L.MultiPolyline object', function () {
        var stub = sinon.stub(L.GML.MultiGeometryParser.prototype, 'parse').returns([L.polyline([]), L.polyline([])]);
        var result = parser.parse({});
        expect(result).to.be.instanceOf(L.MultiPolyline);
        stub.restore();
    });

});
