/**
 * Created by PRadostev on 08.06.2015.
 */

describe("L.GML.LineStringParser", function () {
    var parser;
    var options;
    before(function () {
        parser = new L.GML.LineStringParser();
        options = {
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[1], coords[0], coords[2]);
            }
        };
    });

    it('should parse gml:LineString element', function () {
        expect(parser.elementTag).to.equal('gml:LineString');
    });

    it('should return L.Polyline object', function () {
        var element = parseXml('<gml:LineString></gml:LineString>');
        var parentParse = sinon.stub(L.GML.PointSequenceParser.prototype, 'parse').returns([[0, 0], [1, 1]]);
        var transform = sinon.stub(parser, 'transform').returns([[0, 0], [1, 1]]);
        var result = parser.parse(element);
        expect(result).to.be.instanceOf(L.Polyline);
        parentParse.restore();
        transform.restore();
    });
});


