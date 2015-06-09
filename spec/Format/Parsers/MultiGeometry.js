/**
 * Created by PRadostev on 09.06.2015.
 */

describe('L.GML.MultiGeometry', function () {
  var parser;
  var singleParser;
  var multiElement;

  before(function () {
    singleParser = {
      elementTag: 'gml:Single', parse: function () {
      }
    };
    parser = new L.GML.MultiGeometry();
    parser.appendParser(singleParser);
    multiElement = parseXml('<multi>' +
    '<gml:singleMember><gml:Single/></gml:singleMember>' +
    '<gml:singleMembers>' +
    '<gml:Single/>' +
    '<gml:Single/>' +
    '</gml:singleMembers>' +
    '</multi>');
  });

  it('should call singleParser.parse for each single member', function () {
    var spy = sinon.spy(singleParser, 'parse');
    parser.parse(multiElement);
    expect(spy).to.have.been.calledThrice;
    spy.restore();
  });

  describe('#parse', function () {
    it('should return array of objects', function () {
      var stub = sinon.stub(singleParser, 'parse').returns({});
      var result = parser.parse(multiElement);
      expect(result).to.be.instanceOf(Array);
      stub.restore();
    });
  });

});
