describe('Filter.Intersects', function () {
  var filter;
  var layer;
  var geometryField;
  var crs;

  before(function () {
    filter = new L.Filter.Intersects();
    layer = L.rectangle(L.latLngBounds([40.712, -74.227], [40.774, -74.125]));
    geometryField = 'geom';
    crs = L.CRS.EPSG4326;

    filter.append(layer, geometryField, crs);
  });

  describe('#toGml', function () {
    var gml;

    before(function () {
      gml = filter.toGml(); 
    });

    it('must have first child element with tagName = ogc:Intersects', function () {
      var intersectsElement = gml.firstChild;

      expect(intersectsElement.tagName).to.be.equal('ogc:Intersects');
    });

    it('must have first child element with tagName = ogc:PropertyName & content = geom', function () {
      var intersectsElement = gml.firstChild;
      var propertyNameElement = intersectsElement.firstChild;

      expect(propertyNameElement.tagName).to.be.equal('ogc:PropertyName');
      expect(propertyNameElement.textContent).to.be.equal(geometryField);
    });

    it('must have last child element describing layer geometry', function () {
      var bboxElement = gml.firstChild;
      var envelopeElement = bboxElement.lastChild;

      expect(envelopeElement.outerHTML).to.be.equal(layer.toGml(crs).outerHTML);
    });
  });
});
