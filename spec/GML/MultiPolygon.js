/**
 * Created by PRadostev on 03.06.2015.
 */

describe("L.MultiPolygon.toGml()", function () {
  var multi, multiGml, members;
  beforeEach(function () {
    multi = new L.Polygon([
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1]
      ],
      [
        [3, 3],
        [3, 4],
        [4, 4],
        [4, 3]
      ],
      [
        [-1, 0],
        [0, 0],
        [0, -1],
        [-1, -1]
      ]
    ]);

    multiGml = multi.toGml(L.CRS.Simple);
    members = multiGml.firstElementChild;
  });

  it('should return Element object with tagName gml:MultiSurface', function () {
    expect(multiGml).to.be.instanceOf(Element);
    expect(multiGml.tagName).to.be.equal('gml:MultiSurface');
  });

  it('should have first child element gml:surfaceMembers', function () {
    expect(members.tagName).to.be.equal('gml:surfaceMembers');
  });

  it('should have 3 child nodes of members', function () {
    expect(members.children.length).to.be.equal(3);
  });

  it('all child elements of members shoud be a gml:Polygon', function () {
    var childs = members.children;
    for (var i = 0; i < childs; i++) {
      expect(childs[i].tagName).to.be.equal('gml:Polygon');
    }
  });
});
