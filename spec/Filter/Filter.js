describe('Filter', function () {
  var filter;

  before(function () {
    filter = new L.Filter();
  });

  describe('#toGml', function () {
    var gml;

    before(function() {
      gml = filter.toGml();
    });

    it('should return Element object with tagName ogc:Filter', function () {
      expect(gml).to.be.instanceOf(Element);
      expect(gml.tagName).to.be.equal('ogc:Filter');
    });
  });
});
