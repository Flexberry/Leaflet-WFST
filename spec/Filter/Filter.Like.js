describe('Filter.Like', function () {
  var propertyName;
  var propertyValue;
  var filter;

  before(function () {
    propertyName = 'foobar';
    propertyValue = '*100500*';

    filter = new L.Filter.Like(propertyName, propertyValue);
  });

  describe('#toGml', function () {
    var likeElement;

    before(function () {
      likeElement = filter.toGml();
    });

    it('must have first child element with tagName = ogc:PropertyIsLike with default attributes', function() {
      expect(likeElement.tagName).to.be.equal('ogc:PropertyIsLike');
      expect(likeElement.getAttribute('wildCard')).to.be.equal('*');
      expect(likeElement.getAttribute('singleChar')).to.be.equal('#');
      expect(likeElement.getAttribute('escapeChar')).to.be.equal('!');
      expect(likeElement.getAttribute('matchCase')).to.be.equal('true');

    });

    it('must have child element with tagName = ogc:PropertyName & textContent = foobar', function() {
      var propertyNameElement = likeElement.firstElementChild;

      expect(propertyNameElement.tagName).to.be.equal('ogc:PropertyName');
      expect(propertyNameElement.textContent).to.be.equal(propertyName);
    });

    it('must have child element with tagName = ogc:Literal & textContent = *100500*', function() {
      var propertyValueElement = likeElement.lastElementChild;

      expect(propertyValueElement.tagName).to.be.equal('ogc:Literal');
      expect(propertyValueElement.textContent).to.be.equal(propertyValue);
    });
  });

  describe('#toGml with custom attributes', function() {
    var likeElement;

    before(function () {
      var customFilter = new L.Filter.Like(propertyName, propertyValue, { wildCard: '##', singleChar: '$$', escapeChar: '\\', matchCase: false });
      likeElement = customFilter.toGml();
    });

    it('must have first child element with tagName = ogc:PropertyIsLike with custom attributes', function() {
      expect(likeElement.tagName).to.be.equal('ogc:PropertyIsLike');
      expect(likeElement.getAttribute('wildCard')).to.be.equal('##');
      expect(likeElement.getAttribute('singleChar')).to.be.equal('$$');
      expect(likeElement.getAttribute('escapeChar')).to.be.equal('\\');
      expect(likeElement.getAttribute('matchCase')).to.be.equal('false');
    });
  });

  describe('#create filters with different attributes', function() {
    var firstFilter;
    var secondFilter;

    before(function () {
      firstFilter = new L.Filter.Like(propertyName, propertyValue, { wildCard: '##', singleChar: '$$', escapeChar: '\\', matchCase: false });
      secondFilter = new L.Filter.Like(propertyName, propertyValue, { wildCard: '#', singleChar: '$', escapeChar: '\\', matchCase: true });
    });

    it('must have different attributes', function() {
      expect(firstFilter.attributes.wildCard).to.be.equal('##');
      expect(firstFilter.attributes.singleChar).to.be.equal('$$');
      expect(firstFilter.attributes.escapeChar).to.be.equal('\\');
      expect(firstFilter.attributes.matchCase).to.be.equal(false);
      expect(secondFilter.attributes.wildCard).to.be.equal('#');
      expect(secondFilter.attributes.singleChar).to.be.equal('$');
      expect(secondFilter.attributes.escapeChar).to.be.equal('\\');
      expect(secondFilter.attributes.matchCase).to.be.equal(true);
    });
  });
});
