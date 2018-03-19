describe('L.GML.MultiGeometry', function () {
  describe('#parse', function () {
    var parser;
    var singleParser;
    var transformStub;
    var singleParserParseStub;

    before(function () {

      singleParser = {
        elementTag: 'gml:Single', parse: function () {
        }
      };

      parser = new L.GML.MultiGeometry();
      parser.appendParser(singleParser);
      transformStub = sinon.stub(parser, 'transform').callsFake(function (coordinates) {
        return coordinates;
      });
    });

    beforeEach(function () {
      singleParserParseStub = sinon.stub(singleParser, 'parse').returns({});
    });

    afterEach(function() {
      singleParserParseStub.restore();
    });

    it('should call singleParser.parse for each gml:singleMember children', function () {
      var multiElement = parseXml('<multi>' +
        '<gml:singleMember><gml:Single/></gml:singleMember>' +
        '<gml:singleMember><gml:Single/></gml:singleMember>' +
        '</multi>');
      parser.parse(multiElement);
      expect(singleParserParseStub).to.have.been.calledTwice;
    });

    it('should call singleParser.parse for all children gml:singleMembers', function () {
      var multiElement = parseXml('<multi>' +
        '<gml:singleMembers>' +
        '<gml:Single/>' +
        '<gml:Single/>' +
        '<gml:Single/>' +
        '</gml:singleMembers>' +
        '</multi>');

      parser.parse(multiElement);
      expect(singleParserParseStub).to.have.been.calledThrice;
    });

    it('should return array of objects', function () {
      var multiElement = parseXml('<multi />');
      var result = parser.parse(multiElement);
      expect(result).to.be.instanceOf(Array);
    });

    it('should call singleParser.parse with element srsDimension in options', function () {
      var multiElement = parseXml('<multi srsDimension="4">' +
        '<gml:singleMember><gml:Single/></gml:singleMember>' +
        '</multi>');
      parser.parse(multiElement);
      var calledArgs = singleParserParseStub.getCalls()[0].args;
      expect(calledArgs[1].dimension).to.be.equal(4);
    });
  });

});
