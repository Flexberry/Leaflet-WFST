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
              '<gml:posList>7 8 8 7</gml:posList>' +
            '</gml:LinearRing>'+
          '</gml:exterior>' +
        '</gml:Polygon>'+
      '</gml:surfaceMember>'+
    '</gml:MultiSurface>');

    var result = parser.parse(element, options);
    expect(result).to.be.instanceOf(L.Polygon);
    expect(result.getLatLngs().flat(2)[0]).to.deep.equal(new L.latLng([7, 8]));
  });
});
