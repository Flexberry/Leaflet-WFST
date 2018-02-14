describe('XmlUtil', function () {
  describe('#createTextNode', function() {
    it('should return empty element for null or undefined', function() {
      var result = L.XmlUtil.createTextNode(null);
      expect(result).to.be.instanceOf(Node);
      expect(result.textContent).to.be.equal('');

      result = L.XmlUtil.createTextNode(undefined);
      expect(result).to.be.instanceOf(Node);
      expect(result.textContent).to.be.equal('');
    });

    it('should return valued element for 0', function() {
      var result = L.XmlUtil.createTextNode(0);
      expect(result).to.be.instanceOf(Node);
      expect(result.textContent).to.be.equal('0');
    });

    it('should return node with iso formatted date', function() {
      var date = new Date(Date.UTC(2010, 9, 1));
      var result = L.XmlUtil.createTextNode(date);
      expect(result).to.be.instanceOf(Node);
      expect(result.textContent).to.be.equal('2010-10-01T00:00:00.000Z');
    });
  });
});
