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

    describe('#addLayer', function () {
        it('should set layer.state to "insert"', function () {
            wfst.addLayer(layer);
            expect(layer.state).to.be.equal('insert');
        });
    });

    describe('#editLayer', function () {
        it('should change layer.state to "update"', function () {
            layer.state = 'exist';
            wfst.editLayer(layer);
            expect(layer.state).to.be.equal('update');
        });

        it('should not change layer.state from "insert"', function () {
            layer.state = 'insert';
            wfst.editLayer(layer);
            expect(layer.state).to.be.equal('insert');
        });
    });

    describe('#removeLayer', function () {
        it('should change layer.state to "remove"', function () {
            layer.state = 'exist';
            wfst.removeLayer(layer);
            expect(layer.state).to.be.equal('remove');
        });

        it('should remove layer from changes is that was with state="insert"', function () {
            assert.fail();
        });
    });

    after(function () {
        xhr.restore();
    });
});