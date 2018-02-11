/**
 * Created by PRadostev on 02.06.2015.
 */

describe("L.Polyline.toGml()", function () {
  var polyline;
  beforeEach(function () {
    polyline = new L.Polyline(
      [
        [-10, -10],
        [-10, 10],
        [10, 10],
        [10, -10]
      ]);
  });

  describe('simple', function () {
    var polylineGml;

    beforeEach(function () {
      polylineGml = polyline.toGml(L.CRS.Simple);
    });

    it('should return Element object with tagName gml:LineString', function () {
      expect(polylineGml).to.be.instanceOf(Element);
      expect(polylineGml.tagName).to.be.equal('gml:LineString');
    });

    it('should have first child element gml:posList', function () {
      var posList = polylineGml.firstChild;
      expect(posList.tagName).to.be.equal('gml:posList');
    });
  });

  describe('with forceMulti', function () {
    var multiGml, collectionGml, polylineGml;

    beforeEach(function () {
      multiGml = polyline.toGml(L.CRS.Simple, true);
      collectionGml = multiGml.firstChild;
      polylineGml = collectionGml.firstChild;
    });

    it('should return Element object with tagName gml:MultiLineString', function () {
      expect(multiGml).to.be.instanceOf(Element);
      expect(multiGml.tagName).to.be.equal('gml:MultiLineString');
    });

    it('should have child Element with tagName gml:lineStringMembers', function () {
      expect(collectionGml.tagName).to.be.equal('gml:lineStringMembers');
    });

    it('gml:lineStringMembers should have child Element with tagName gml:LineString', function () {
      expect(polylineGml.tagName).to.be.equal('gml:LineString');
    });

    it('gml:LineString element should have child element gml:posList', function () {
      var posList = polylineGml.firstChild;
      expect(posList.tagName).to.be.equal('gml:posList');
    });
  });
});
