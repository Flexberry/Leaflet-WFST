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

  describe('BBox', function () {
    var filter;
    var bounds;
    var geometryField;
    var crs;
    var gml;

    before(function () {
      filter = new L.Filter.BBox();
      bounds = L.latLngBounds([40.712, -74.227], [40.774, -74.125]);
      geometryField = 'geom';
      crs = L.CRS.EPSG4326;

      filter.append(bounds, geometryField, crs);
      gml = filter.toGml();
    });

    describe('#toGml', function () {
      it('PropertyName', function () {
        var children = gml.firstChild.firstChild;

        expect(children.tagName).to.be.equal('ogc:PropertyName');
      });

      it('Envelope', function () {
        var children = gml.firstChild.lastChild;

        expect(children.tagName).to.be.equal('gml:Envelope');
        expect(children.getAttribute('srsName')).to.be.equal('EPSG:4326');

        filter = new L.Filter.BBox().append(bounds, geometryField, L.CRS.EPSG3857);
        gml = filter.toGml();
        children = gml.firstChild.lastChild;

        expect(children.getAttribute('srsName')).to.be.equal('EPSG:3857');
      });

      it('lowerCorner', function () {
        var children = gml.firstChild.lastChild.firstChild;

        expect(children.tagName).to.be.equal('gml:lowerCorner');
      });

      it('upperCorner', function () {
        var children = gml.firstChild.lastChild.lastChild;

        expect(children.tagName).to.be.equal('gml:upperCorner');
      });
    });
  });
});
