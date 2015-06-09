/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.PolygonParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.PolygonParser();
    });

    it('should parse gml:Polygon element', function () {
        expect(parser.elementTag).to.equal('gml:Polygon');
    });

    it('should return L.Polygon object', function () {
        var element = parseXml('<gml:Polygon></gml:Polygon>');
        var getCoordinates = sinon.stub(parser, 'getCoordinates').returns([]);
        var transform = sinon.stub(parser, 'transform').returns([]);
        var result = parser.parse(element);
        expect(result).to.be.instanceOf(L.Polygon);
        getCoordinates.restore();
        transform.restore();
    });

    describe('#getCoordinates', function () {
        it('linearRingParser.parse should have been called for each exterior and interior element', function () {
            var polygonElement = parseXml('<gml:Polygon><gml:exterior><exterior /></gml:exterior>'
            + '<gml:interior><interior /></gml:interior>'
            + '<gml:interior><interior /></gml:interior>'
            + '</gml:Polygon>');
            var stub = sinon.stub(parser.linearRingParser, 'parse').returns([]);
            parser.getCoordinates(polygonElement);
            expect(stub).have.been.calledThrice;
        });
    });
});