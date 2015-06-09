/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.AbstractMultiPolyline", function () {
  var parser;

  before(function () {
    parser = new L.GML.AbstractMultiPolyline();
  });

  it('should return L.MultiPolyline object', function () {
    var stub = sinon.stub(L.GML.MultiGeometry.prototype, 'parse').returns([L.polyline([]), L.polyline([])]);
    var result = parser.parse({});
    expect(result).to.be.instanceOf(L.MultiPolyline);
    stub.restore();
  });
});
