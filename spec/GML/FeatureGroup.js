/**
 * Created by DLytkina on 21.02.2023.
 */

describe("L.FeatureGroup.toGml()", function () {
  var multi, multiGml, members, incorrectMulti, incorrectMultiGml;
  beforeEach(function () {
    multi = new L.FeatureGroup([new L.Marker([0, 0]), new L.Marker([0, 0]), new L.Marker([0, 0])]);
    incorrectMulti = new L.FeatureGroup([
      new L.Marker([0, 0]),
      new L.Polyline([[[0, 0], [1, 0], [1, 1], [0, 1]], [[3, 3], [3, 4], [4, 4], [4, 3]], [[-1, 0], [0, 0], [0, -1], [-1, -1]]])
    ]);

    multiGml = multi.toGml(L.CRS.Simple);
    members = multiGml.firstElementChild;
  });

  it('should return Element object with tagName gml:MultiPoint', function () {
    expect(multiGml).to.be.instanceOf(Element);
    expect(multiGml.tagName).to.be.equal('gml:MultiPoint');
  });

  it('should have first child element gml:pointMembers', function () {
    expect(members.tagName).to.be.equal('gml:pointMembers');
  });

  it('should have 3 child nodes of members', function () {
    expect(members.children.length).to.be.equal(3);
  });

  it('all child elements of members shoud be a gml:Point', function () {
    var childs = members.children;
    for (var i = 0; i < childs; i++) {
      expect(childs[i].tagName).to.be.equal('gml:Point');
    }
  });

  it('incorrect L.FeatureGroup (not MultiPoint) should throw an exception', function () {
    try {
      incorrectMultiGml = incorrectMulti.toGml(L.CRS.Simple);
    }
    catch(ex) {
      expect(ex).to.be.equal('Not implemented toGml function for featureGroup, only FeatureGroup that is MultiPoint');
    }
  });

});
