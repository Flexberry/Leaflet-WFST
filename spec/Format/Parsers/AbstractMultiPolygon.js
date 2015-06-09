/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.AbstractMultiPolygon", function () {
  var parser;

  before(function () {
    parser = new L.GML.AbstractMultiPolygon();
  });

  it('should return L.MultiPolygon object', function () {
    var stub = sinon.stub(L.GML.MultiGeometry.prototype, 'parse').returns([L.polygon([]), L.polygon([])]);
    var result = parser.parse({});
    expect(result).to.be.instanceOf(L.MultiPolygon);
    stub.restore();
  });
});
