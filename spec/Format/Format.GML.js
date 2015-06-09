/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.Format.GML", function () {
    var format;

    before(function () {
        format = new L.Format.GML({crs: L.CRS.Simple});
    });

    var metas = [
        {
            tag: 'gml:Point',
            parser: L.GML.PointParser
        },
        {
            tag: 'gml:LineString',
            parser: L.GML.LineStringParser
        },
        {
            tag: 'gml:Polygon',
            parser: L.GML.PolygonParser
        },
        {
            tag: 'gml:MultiLineString',
            parser: L.GML.MultiLineStringParser
        },
        {
            tag: 'gml:MultiPolygon',
            parser: L.GML.MultiPolygonParser
        },
        {
            tag: 'gml:MultiCurve',
            parser: L.GML.MultiCurveParser
        },
        {
            tag: 'gml:MultiSurface',
            parser: L.GML.MultiSurfaceParser
        }
    ];

    metas.forEach(function (meta) {
        it('should know how to parse ' + meta.tag, function () {
            var parser = format.parsers[meta.tag];
            expect(parser).to.be.instanceOf(meta.parser);
        });
    })

});