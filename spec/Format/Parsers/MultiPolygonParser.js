/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.MultiPolygonParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.MultiPolygonParser();
    });

    it('should parse gml:MultiPolygon elements', function () {
        expect(parser.elementTag).to.equal('gml:MultiPolygon');
    });

    it('should parse polygons', function () {
        expect(parser.singleParser).to.be.instanceOf(L.GML.PolygonParser);
    });

    it('should return L.MultiPolygon object', function () {
        var stub = sinon.stub(L.GML.MultiGeometryParser.prototype, 'parse').returns([L.polygon([]), L.polygon([])]);
        var result = parser.parse({});
        expect(result).to.be.instanceOf(L.MultiPolygon);
        stub.restore();
    });

});