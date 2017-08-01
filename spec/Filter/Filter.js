describe('Filter', function () {
  describe('initialize', function () {
    it('should pass all arguments to inner filter array', function () {
      var a = { a: 'a' }, b = { b: 'b' }, c = { c: 'c' };
      var filter = new L.Filter(a, b, c);
      expect(filter.filters[0]).to.be.equal(a);
      expect(filter.filters[1]).to.be.equal(b);
      expect(filter.filters[2]).to.be.equal(c);

    });
  });

  describe('#toGml', function () {
    var gml;

    before(function () {
      var filter = new L.Filter();
      gml = filter.toGml();
    });

    it('should return Element object with tagName ogc:Filter', function () {
      expect(gml).to.be.instanceOf(Element);
      expect(gml.tagName).to.be.equal('ogc:Filter');
    });
  });
});
