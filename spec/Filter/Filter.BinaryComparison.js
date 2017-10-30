describe('Filter.BinaryComparison', function () {
  describe('#toGml', function () {
    it('must return element having matchCase attribute with value equal true', function () {
      var filter = new L.Filter.BinaryComparison('a', 'b', true);
      filter.tagName = 'testBC';
      var filterElement = filter.toGml();
      expect(filterElement.attributes.matchCase.value).to.be.equal('true');
    });
  });

  describe('#create filters with different attributes', function() {
    var firstFilter;
    var secondFilter;

    before(function () {
      firstFilter = new L.Filter.BinaryComparison('a', 'b', true);
      secondFilter = new L.Filter.BinaryComparison('a', 'b', false);
    });

    it('must have different attributes', function() {
      expect(firstFilter.attributes.matchCase).to.be.equal(true);
      expect(secondFilter.attributes.matchCase).to.be.equal(false);
    });
  });
});
