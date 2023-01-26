/**
 * Created by PRadostev on 09.06.2015.
 */

describe("L.GML.AbstractMultiPolygon", function () {
  var parser;
  var options;
before(function () {
    parser = new L.GML.AbstractMultiPolygon();
    options = {
      coordsToLatLng : function(coordinates) {
        return coordinates;
      }
    };
  });

  it('should return L.Polygon object', function () {
    var element = parseXml('<gml:MultiSurface>' +
      '<gml:surfaceMember>' +
        '<gml:Polygon>' +
          '<gml:exterior>' +
            '<gml:LinearRing>' +
              '<gml:posList>7 69 3 5 6 5 6 7</gml:posList>' +
            '</gml:LinearRing>'+
          '</gml:exterior>' +
        '</gml:Polygon>'+
      '</gml:surfaceMember>'+
    '</gml:MultiSurface>');

    var result = parser.parse(element, options);
    expect(result).to.be.instanceOf(L.Polygon);
    expect(result.getLatLngs().flat(2)[0].lat).to.be.equal(7);
    expect(result.getLatLngs().flat(2)[2].lng).to.be.equal(5);
  });
});
