/**
 * Created by PRadostev on 17.02.2015.
 */

describe('Filter', function () {

  describe('#toGml', function () {
    var filter;

    beforeEach(function () {
      filter = new L.Filter();
    });

    it('should return Element object with tagName ogc:Filter', function () {
      expect(filter.toGml()).to.be.instanceOf(Element);
      expect(filter.toGml().tagName).to.be.equal('ogc:Filter');
    });
  });

  describe('GMLObjectID', function () {
    var filter;

    beforeEach(function () {
      filter = new L.Filter.GmlObjectID().append(1);
    });

    describe('#toGml', function () {
      it('must have child element with Name="ogc:GmlObjectId" and attribute "gml:id" = 1', function () {
        var gml = filter.toGml().firstChild;
        expect(gml.tagName).to.be.equal('ogc:GmlObjectId');
        expect(gml.attributes['gml:id'].value).to.be.equal('1');
      });
    });
  });
});
