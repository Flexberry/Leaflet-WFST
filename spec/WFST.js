/**
 * Created by PRadostev on 18.02.2015.
 */
describe('WFST', function () {
  var wfst, layer, xhr;

  before(function () {
    xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    xhr.onCreate = function (xhr) {
      requests.push(xhr);
    };
  });

  beforeEach(function () {
    wfst = new L.WFST({
      typeNS: 'typeNS',
      typeName: 'typeName',
      namespaceUri: 'testuri'
    });
    layer = new L.Marker([0, 0]);
    layer.feature = {
      id: 1,
      properties: {
        a: 'a',
        b: 'b'
      }
    };
  });

  describe('#addLayer', function () {
    it('should set layer.state to "insert" and add it to changes', function () {
      wfst.addLayer(layer);
      var id = wfst.getLayerId(layer);
      expect(layer.state).to.be.equal('insertElement');
      expect(wfst.changes[id]).to.be.equal(layer);
    });

    it('should not change feature if that already exists', function () {
      var feature = layer.feature;
      wfst.addLayer(layer);
      expect(layer.feature).to.be.equal(feature);
    });
  });

  describe('#editLayer', function () {
    it('should change layer.state to "update" and add it to changes', function () {
      layer.state = 'exist';
      wfst.editLayer(layer);
      var id = wfst.getLayerId(layer);
      expect(layer.state).to.be.equal('updateElement');
      expect(wfst.changes[id]).to.be.equal(layer);
    });

    it('should not change layer.state from "insert"', function () {
      layer.state = 'insertElement';
      wfst.editLayer(layer);
      expect(layer.state).to.be.equal('insertElement');
    });
  });

  describe('#removeLayer', function () {
    it('should change layer.state to "remove" and add it to changes', function () {
      layer.state = 'exist';
      wfst.removeLayer(layer);
      var id = wfst.getLayerId(layer);
      expect(layer.state).to.be.equal('removeElement');
      expect(wfst.changes[id]).to.be.equal(layer);
    });

    it('should remove layer from changes if that was with state="insertElement"', function () {
      var id = wfst.getLayerId(layer);
      layer.state = 'insertElement';
      wfst.changes[id] = layer;
      wfst.removeLayer(layer);
      expect(wfst.changes[id]).to.be.undefined;
    });
  });

  describe('#save', function () {
    it('should properly parse feature id', function () {
      wfst.addLayer(layer);
      wfst.save();

      var transactionRequest = this.requests.pop();
      expect(transactionRequest.requestBody.indexOf('<wfs:Transaction')).to.be.equal(0);
      transactionRequest.respond(200, { "Content-Type": "text/xml" },
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<wfs:TransactionResponse xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
        ' xmlns:wfs="http://www.opengis.net/wfs"' +
        ' xmlns:gml="http://www.opengis.net/gml"' +
        ' xmlns:ogc="http://www.opengis.net/ogc"' +
        ' xmlns:ows="http://www.opengis.net/ows"' +
        ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0"' +
        ' xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8080/geoserver/schemas/wfs/1.1.0/wfs.xsd">' +
        '<wfs:TransactionSummary>' +
        '<wfs:totalInserted>1</wfs:totalInserted>' +
        '<wfs:totalUpdated>0</wfs:totalUpdated>' +
        '<wfs:totalDeleted>0</wfs:totalDeleted>' +
        '</wfs:TransactionSummary>' +
        '<wfs:TransactionResults/>' +
        '<wfs:InsertResults>' +
        '<wfs:Feature>' +
        '<ogc:FeatureId fid="test_feature_number.123"/>' +
        '</wfs:Feature>' +
        '</wfs:InsertResults>' +
        '</wfs:TransactionResponse>');

      var featureRequest = this.requests.pop();
      expect(featureRequest.requestBody.indexOf('<wfs:GetFeature')).to.be.equal(0);
      expect(featureRequest.requestBody.indexOf('gml:id="test_feature_number.123"')).to.be.above(0);
    });
  });

  describe('#save xhr option withCredentials', function () {
    it('save xhr option withCredentials true', function () {
      wfst = new L.WFST({
        typeNS: 'typeNS',
        typeName: 'typeName',
        namespaceUri: 'testuri',
        withCredentials: true
      });

      wfst.addLayer(layer);
      wfst.save();

      var transactionRequest = this.requests.pop();
      transactionRequest.respond(200, { "Content-Type": "text/xml" },
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<wfs:TransactionResponse xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
        ' xmlns:wfs="http://www.opengis.net/wfs"' +
        ' xmlns:gml="http://www.opengis.net/gml"' +
        ' xmlns:ogc="http://www.opengis.net/ogc"' +
        ' xmlns:ows="http://www.opengis.net/ows"' +
        ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0"' +
        ' xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8080/geoserver/schemas/wfs/1.1.0/wfs.xsd">' +
        '<wfs:TransactionSummary>' +
        '<wfs:totalInserted>1</wfs:totalInserted>' +
        '<wfs:totalUpdated>0</wfs:totalUpdated>' +
        '<wfs:totalDeleted>0</wfs:totalDeleted>' +
        '</wfs:TransactionSummary>' +
        '<wfs:TransactionResults/>' +
        '<wfs:InsertResults>' +
        '<wfs:Feature>' +
        '<ogc:FeatureId fid="test_feature_number.123"/>' +
        '</wfs:Feature>' +
        '</wfs:InsertResults>' +
        '</wfs:TransactionResponse>');

      var featureRequest = this.requests.pop();
      expect(featureRequest.withCredentials).to.be.equal(true);
    });

    it('save xhr option withCredentials false', function () {
      wfst = new L.WFST({
        typeNS: 'typeNS',
        typeName: 'typeName',
        namespaceUri: 'testuri',
        withCredentials: false
      });

      wfst.addLayer(layer);
      wfst.save();

      var transactionRequest = this.requests.pop();
      transactionRequest.respond(200, { "Content-Type": "text/xml" },
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<wfs:TransactionResponse xmlns:xs="http://www.w3.org/2001/XMLSchema"' +
        ' xmlns:wfs="http://www.opengis.net/wfs"' +
        ' xmlns:gml="http://www.opengis.net/gml"' +
        ' xmlns:ogc="http://www.opengis.net/ogc"' +
        ' xmlns:ows="http://www.opengis.net/ows"' +
        ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1.0"' +
        ' xsi:schemaLocation="http://www.opengis.net/wfs http://localhost:8080/geoserver/schemas/wfs/1.1.0/wfs.xsd">' +
        '<wfs:TransactionSummary>' +
        '<wfs:totalInserted>1</wfs:totalInserted>' +
        '<wfs:totalUpdated>0</wfs:totalUpdated>' +
        '<wfs:totalDeleted>0</wfs:totalDeleted>' +
        '</wfs:TransactionSummary>' +
        '<wfs:TransactionResults/>' +
        '<wfs:InsertResults>' +
        '<wfs:Feature>' +
        '<ogc:FeatureId fid="test_feature_number.123"/>' +
        '</wfs:Feature>' +
        '</wfs:InsertResults>' +
        '</wfs:TransactionResponse>');

      var featureRequest = this.requests.pop();
      expect(featureRequest.withCredentials).to.be.equal(false);
    });
  });

  after(function () {
    xhr.restore();
  });
});

