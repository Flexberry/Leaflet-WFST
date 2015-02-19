/**
 * Created by PRadostev on 18.02.2015.
 */
describe('WFS.Transaction', function () {
    var wfst, layer, xhr;

    before(function () {
        xhr = sinon.useFakeXMLHttpRequest();
    });

    beforeEach(function () {
        wfst = new L.WFS.Transaction({
            typeNS: 'test',
            typeName: 'test',
            namespaceUri: 'testuri',
            featureNS: 'test'
        });
        layer = {};
    });

    it('should be initialized', function () {
        var spy = sinon.spy(L.WFS.Transaction.initialize);
        new L.WFS.Transaction();
        expect(spy).called;
    });

    describe('#insert', function () {
        it('should return Element object with tagName wfs:Insert', function () {
            layer.toGml = sinon.stub().returns(document.createElement('layer'));
            var result = wfst.insert(layer);
            expect(result).to.be.instanceOf(Element);
            expect(result.tagName).to.be.equal('wfs:Insert');
        });
    });

    describe('#transaction', function () {

    });

    after(function () {
        xhr.restore();
    });
});