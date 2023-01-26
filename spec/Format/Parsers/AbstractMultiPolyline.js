/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.AbstractMultiPolyline", function () {
  var parser;
  var options;
  before(function () {
    parser = new L.GML.AbstractMultiPolyline();
    options = {
      coordsToLatLng : function(coordinates) {
        return coordinates;
      }
    };
  });

  it('should return L.Polyline object', function () {

    var element = parseXml('<gml:MultiCurve>' +
      '<gml:curveMember>' +
        '<gml:LineString gml:id="null.2.1">' +
          '<gml:posList>42 64 427 37</gml:posList>' +
        '</gml:LineString>' +
      '</gml:curveMember>' +
      '<gml:curveMember>' +
        '<gml:LineString gml:id="null.2.2">' +
          '<gml:posList>425796.95475063 6461401.96977777 425796.93814058 6461401.97144833</gml:posList>' +
        '</gml:LineString>' +
      '</gml:curveMember>' +
    '</gml:MultiCurve>');
    var result = parser.parse(element, options);
    expect(result).to.be.instanceOf(L.Polyline);
  });
});
