describe('Properties', function () {
  var layer;

  beforeEach(function () {
    layer = new L.Marker([0, 0]);
    layer.feature = {
      id: 1,
      properties: {
        a: 'a',
        b: 'b'
      }
    };
  });

  describe('#properties', function () {
    it('getProperty()', function () {
      var a = layer.getProperty('a');
      expect(a).to.be.equal('a');
    });

    it('setProperties() with one value', function () {
      layer.setProperties({
        a: 'b'
      });
      var a = layer.getProperty('a');
      expect(a).to.be.equal('b');
    });

    it('setProperties() with multiple values', function () {
      layer.setProperties({
        a: 'b',
        b:'a'
      });
      var a = layer.getProperty('a');
      var b = layer.getProperty('b');
      expect(a).to.be.equal('b');
      expect(b).to.be.equal('a');
    });

    it('setProperties() should be add new property', function () {
      var c = layer.getProperty('c');
      expect(c).to.be.undefined;
      layer.setProperties({
        c:'c'
      });
      c = layer.getProperty('c');
      expect(c).to.be.equal('c');
    });

    it('clearProperties() with one value', function () {
      layer.clearProperties(['a']);
      var a = layer.getProperty('a');
      expect(a).to.be.null;
    });

    it('clearProperties() with multiple values', function () {
      layer.clearProperties(['a','b']);
      var a = layer.getProperty('a');
      var b = layer.getProperty('b');
      expect(a).to.be.null;
      expect(b).to.be.null;
    });

    it('clearProperties() with nonexistent value', function () {
      layer.clearProperties(['c']);
      var c = layer.getProperty('c');
      expect(c).to.be.null;
    });
  });

});
