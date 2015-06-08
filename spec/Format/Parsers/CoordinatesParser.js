/**
 * Created by PRadostev on 08.06.2015.
 */

describe("L.GML.CoordinatesParser", function () {
    var parser;

    before(function () {
        parser = new L.GML.CoordinatesParser();
    });

    it('should parse gml:coordinates element', function () {
        expect(parser.elementTag).to.equal('gml:coordinates');
    });

    it('should return array', function () {
        var coordXml = '<gml:coordinates>0,0</gml:coordinates>';
        var coordElement = parseXml(coordXml);
        var coords = parser.parse(coordElement);
        expect(coords).to.be.instanceOf(Array);
    });

    it('can parse 2 dimensional point', function () {
        var coordXml = '<gml:coordinates>5,10</gml:coordinates>';
        var coordElement = parseXml(coordXml);
        var coords = parser.parse(coordElement, {dimension: 2});
        expect(coords.length).to.equal(2);
        expect(coords[0]).to.equal(5);
        expect(coords[1]).to.equal(10);
    });

    it('can parse 3 dimensional point', function () {
        var coordXml = '<gml:coordinates>5,10,15</gml:coordinates>';
        var coordElement = parseXml(coordXml);
        var coords = parser.parse(coordElement);
        expect(coords.length).to.equal(3);
        expect(coords[0]).to.equal(5);
        expect(coords[1]).to.equal(10);
        expect(coords[2]).to.equal(15);
    });

    it('can parse point with non default separators', function () {
        var coordXml = '<gml:coordinates decimal="," cs=" ">5,1 10,5 15,8</gml:coordinates>';
        var coordElement = parseXml(coordXml);
        var coords = parser.parse(coordElement);
        expect(coords.length).to.equal(3);
        expect(coords[0]).to.equal(5.1);
        expect(coords[1]).to.equal(10.5);
        expect(coords[2]).to.equal(15.8);
    });
});