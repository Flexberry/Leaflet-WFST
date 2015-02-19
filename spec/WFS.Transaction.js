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
            typeNS: 'typeNS',
            typeName: 'typeName',
            namespaceUri: 'testuri'
        });
        layer = {
            feature: {
                id: 1,
                properties: {
                    a: 'a',
                    b: 'b'
                }
            },
            toGml: function () {
                return L.XmlUtil.createElementNS('gml:Point');
            }
        };
    });

    it('should be initialized', function () {
        var spy = sinon.spy(L.WFS.Transaction.initialize);
        new L.WFS.Transaction();
        expect(spy).called;
    });

    describe('#insert', function () {
        it('should return Element object with tagName wfs:Insert', function () {
            sinon.stub(wfst, 'gmlFeature', function () {
                return document.createElement('dummy');
            });
            var result = wfst.insert(layer);
            expect(result).to.be.instanceOf(Element);
            expect(result.tagName).to.be.equal('wfs:Insert');
        });
    });

    describe('#remove', function () {
        it('should return Element object with tagName "wfs:Delete" and attribute "typeName"', function () {
            var result = wfst.remove(layer);
            expect(result).to.be.instanceOf(Element);
            expect(result.tagName).to.be.equal('wfs:Delete');
            expect(result.attributes.typeName).to.not.be.undefined;
        });
    });

    describe('#transaction', function () {
        it('should return Element object with tagName "wfs:Transaction"', function () {
            var result = wfst.transaction();
            expect(result).to.be.instanceOf(Element);
            expect(result.tagName).to.be.equal('wfs:Transaction');
        });

        it('must have attribute "service" with value "WFS"', function () {
            var result = wfst.transaction();
            expect(result.attributes.service.value).to.be.equal('WFS');
        });

        it('must have attribute "version"', function () {
            var version = wfst.options.version = '100500';
            var result = wfst.transaction();
            expect(result.attributes.version.value).to.be.equal(version);
        });
    });

    describe('#gmlFeature', function () {
        var stub;
        beforeEach(function () {
            stub = sinon.stub(wfst, 'gmlProperty', function () {
                return document.createElement('property');
            });
        });

        it('should return Element object with tagName like "%namespace%:%typename%"', function () {
            var result = wfst.gmlFeature(layer);
            expect(result).to.be.instanceOf(Element);
            expect(result.tagName).to.be.equal('typeNS:typeName');
        });

        afterEach(function () {
            stub.restore();
        });
    });

    after(function () {
        xhr.restore();
    });
});