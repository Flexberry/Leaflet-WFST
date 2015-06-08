/**
 * Created by PRadostev on 05.06.2015.
 */

describe("L.GML.PointParser", function () {
    it('should return L.Market object', function () {
        var pointXml = '<gml:Point srsDimension="2"></gml:Point>';
        var pointElement = parseXml(pointXml);
        var parser = new L.GML.PointParser();
        var stub = sinon.stub(parser, 'parseElement', function () {
            return [0, 0];
        });
        var layer = parser.parse(pointElement);
        expect(layer).to.be.instanceOf(L.Marker);
        stub.restore();
    });

    it('should know how to parse gml:pos', function () {
        var parser = new L.GML.PointParser();
        var posParser = parser.parsers['gml:pos'];
        expect(posParser).to.not.undefined;
        expect(posParser).to.be.instanceOf(L.GML.PosParser);
    });

    it('should know how to parse gml:coordinates', function () {
        var parser = new L.GML.PointParser();
        var posParser = parser.parsers['gml:coordinates'];
        expect(posParser).to.not.undefined;
        expect(posParser).to.be.instanceOf(L.GML.CoordinatesParser);
    });
});