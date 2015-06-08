/**
 * Created by PRadostev on 08.06.2015.
 */

describe("L.GML.LineStringParser", function () {
    var parser,
        options;
    before(function () {
        parser = new L.GML.LineStringParser();
        options = {
            coordsToLatLng: function (coords) {
                return new L.LatLng(coords[1], coords[0], coords[2]);
            }
        }
    });

    it('should parse gml:LineString element', function () {
        expect(parser.elementTag).to.equal('gml:LineString');
    });

    it('should return L.Polyline object', function () {
        var element = parseXml('<gml:LineString></gml:LineString>');
        var getCoordinates = sinon.stub(parser, 'getCoordinates').returns([[0, 0], [1, 1]]);
        var transform = sinon.stub(parser, 'transform').returns([[0, 0], [1, 1]]);
        var result = parser.parse(element);
        expect(result).to.be.instanceOf(L.Polyline);
        getCoordinates.restore();
        transform.restore();
    });

    it('should know how to parse gml:pos', function () {
        var child = parser.parsers['gml:pos'];
        expect(child).to.be.instanceOf(L.GML.PosParser);
    });

    it('should know how to parse gml:coordinates', function () {
        var child = parser.parsers['gml:coordinates'];
        expect(child).to.be.instanceOf(L.GML.CoordinatesParser);
    });

    it('should know how to parse gml:posList', function () {
        var child = parser.parsers['gml:posList'];
        expect(child).to.be.instanceOf(L.GML.PosListParser);
    });

    it('should know how to parse gml:Point', function () {
        var child = parser.parsers['gml:Point'];
        expect(child).to.be.instanceOf(L.GML.PointNodeParser);
    });

    describe('#getCoordinates', function () {
        var metas = [
            {
                name: 'gml:pos',
                xml: '<gml:LineString><gml:pos>0 0</gml:pos><gml:pos>1 1</gml:pos></gml:LineString>'
            },
            {
                name: 'gml:Point',
                xml: '<gml:LineString><gml:Point><gml:pos>0 0</gml:pos></gml:Point><gml:Point><gml:pos>1 1</gml:pos></gml:Point></gml:LineString>'
            },
            {
                name: 'gml:posList',
                xml: '<gml:LineString srsDimension="2"><gml:posList>0 0 1 1</gml:posList></gml:LineString>'
            },
            {
                name: 'gml:coordinates',
                xml: '<gml:LineString><gml:coordinates>0,0 1,1</gml:coordinates></gml:LineString>'
            }];

        metas.forEach(function (meta) {
            it('should parse gml:LineString consists of ' + meta.name, function () {
                var element = parseXml(meta.xml);
                var result = parser.getCoordinates(element);
                expect(result).deep.equal([[0, 0], [1, 1]]);
            });
        });
    });
});


