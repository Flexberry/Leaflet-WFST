/**
 * Created by PRadostev on 08.06.2015.
 */

describe("L.GML.PosParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.PosParser();
    });

    it('should parse gml:pos element', function () {
        expect(parser.elementTag).to.equal('gml:pos');
    });

    it('should return array', function () {
        var posXml = '<gml:pos>0 0</gml:pos>';
        var posElement = parseXml(posXml);
        var pos = parser.parse(posElement);
        expect(pos).to.be.instanceOf(Array);
    });

    it('can parse 2 dimensional point', function () {
        var posXml = '<gml:pos>5 10</gml:pos>';
        var posElement = parseXml(posXml);
        var pos = parser.parse(posElement);
        expect(pos.length).to.equal(2);
        expect(pos[0]).to.equal(5);
        expect(pos[1]).to.equal(10);
    });

    it('can parse 3 dimensional point', function () {
        var posXml = '<gml:pos>5 10 15</gml:pos>';
        var posElement = parseXml(posXml);
        var pos = parser.parse(posElement);
        expect(pos.length).to.equal(3);
        expect(pos[0]).to.equal(5);
        expect(pos[1]).to.equal(10);
        expect(pos[2]).to.equal(15);
    });
});