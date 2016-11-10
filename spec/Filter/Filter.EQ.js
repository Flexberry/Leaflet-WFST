describe('Filter.EQ', function () {
  var propertyName;
  var propertyValue;
  var filter;

  before(function () {
    propertyName = 'foobar';
    propertyValue = '100500';

    filter = new L.Filter.EQ().append(propertyName, propertyValue);
  });

  describe('#toGml', function () {
    var gml;

    before(function () {
      gml = filter.toGml(); 
    });

    it('must have first child element with tagName = ogc:PropertyIsEqualTo', function() {
      var eqElement = gml.firstChild;
      expect(eqElement.tagName).to.be.equal('ogc:PropertyIsEqualTo');
    });

    it('must have child element with tagName = ogc:PropertyName & textContent = foobar', function() {
      var eqElement = gml.firstChild;
      var propertyNameElement = eqElement.firstChild;

      expect(propertyNameElement.tagName).to.be.equal('ogc:PropertyName');
      expect(propertyNameElement.textContent).to.be.equal(propertyName);
    });

    it('must have child element with tagName = ogc:Literal & textContent = 100500', function() {
      var eqElement = gml.firstChild;
      var propertyValueElement = eqElement.lastChild;

      expect(propertyValueElement.tagName).to.be.equal('ogc:Literal');
      expect(propertyValueElement.textContent).to.be.equal(propertyValue);
    });
  });
});
