/**
 * Created by PRadostev on 03.03.2015.
 */

describe('WFS', function () {
  var wfs;

  beforeEach(function () {
    wfs = new L.WFS({
      typeNS: 'typeNS',
      typeName: 'typeName',
      namespaceUri: 'testuri'
    });
  });

  describe('#getFeature', function () {
    it('should return Element object with tagName=GetFeature and must have attiributes "service" and "version"', function () {
      var feature = wfs.getFeature();
      expect(feature).to.be.instanceOf(Element);
      expect(feature.tagName).to.be.equal('wfs:GetFeature');
      expect(feature.getAttribute('service')).to.be.not.undefined;
      expect(feature.getAttribute('version')).to.be.not.undefined;
    });

    it('should have child Element with tagName wfs:Query and attribute "typeName"', function () {
      var feature = wfs.getFeature();
      var query = feature.firstChild;
      expect(query.tagName).to.be.equal('wfs:Query');
      expect(query.getAttribute('typeName')).to.be.equal('typeNS:typeName');
    });

    it('should return value of maxFeatures', function () {
      wfs = new L.WFS({
        maxFeatures: 5000
      });
      var feature = wfs.getFeature();
      expect(feature.getAttribute('maxFeatures')).to.be.equal('5000');
    });
  });

});
