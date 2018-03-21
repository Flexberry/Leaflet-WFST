/**
 * Created by PRadostev on 02.06.2015.
 */

describe("L.Polygon.toGml()", function () {
  var polygon;
  beforeEach(function () {
    polygon = new L.Polygon(
      [
        [
          [
            [-10, -10],
            [-10, 10],
            [10, 10],
            [10, -10]
          ],
          [
            [-1, -1],
            [-1, 1],
            [1, 1],
            [1, -1]
          ]
        ]
      ]);
  });

  describe('Simple polygon', function () {
    var polygonGml;

    beforeEach(function () {
      polygonGml = polygon.toGml(L.CRS.Simple);
    });

    it('should return Element object with tagName gml:Polygon', function () {
      expect(polygonGml).to.be.instanceOf(Element);
      expect(polygonGml.tagName).to.be.equal('gml:Polygon');
    });

    it('should have first child element gml:exterior with child element gml:LinearRing', function () {
      var exterior = polygonGml.firstElementChild;
      expect(exterior.tagName).to.be.equal('gml:exterior');

      var linearRing = exterior.firstElementChild;
      expect(linearRing.tagName).to.be.equal('gml:LinearRing');
    });

    it('may have child elements gml:interior with child element gml:LinearRing', function () {
      var interiors = polygonGml.getElementsByTagName('gml:interior');
      for (var i = 0; i < interiors.length; i++) {
        var interior = interiors[i];
        var linearRing = interior.firstElementChild;
        expect(linearRing.tagName).to.be.equal('gml:LinearRing');
      }
    });
  });

  describe('Polygon with forceMulti', function () {
    var polygonGml;

    beforeEach(function () {
      polygonGml = polygon.toGml(L.CRS.Simple, true);
    });

    it('should return Element object with tagName gml:MultiSurface', function () {
      expect(polygonGml).to.be.instanceOf(Element);
      expect(polygonGml.tagName).to.be.equal('gml:MultiSurface');
    });
  });
});
