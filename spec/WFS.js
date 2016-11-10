describe('WFS', function () {
  var describeFeaturesReponseText = '<xsd:schema ' +
    'xmlns:gml="http://www.opengis.net/gml" ' +
    'xmlns:maps="http://boundlessgeo.com" ' +
    'xmlns:nasa="http://nasa.gov" ' +
    'xmlns:ne="http://naturalearthdata.com" ' +
    'xmlns:nurc="http://www.nurc.nato.int" ' +
    'xmlns:og="http://opengeo.org" ' +
    'xmlns:osm="http://openstreemap.org" ' +
    'xmlns:topp="http://www.openplans.org/topp" ' +
    'xmlns:usgs="http://www.usgs.gov/" ' +
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
    'elementFormDefault="qualified" ' +
    'targetNamespace="http://www.openplans.org/topp"> ' +
    '<xsd:import namespace="http://www.opengis.net/gml" schemaLocation="http://demo.opengeo.org:80/geoserver/schemas/gml/3.1.1/base/gml.xsd"/>' +
    '<xsd:complexType name="tasmania_citiesType">' +
      '<xsd:complexContent>' +
        '<xsd:extension base="gml:AbstractFeatureType">' +
          '<xsd:sequence>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="the_geom" nillable="true" type="gml:MultiPointPropertyType"/>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="CITY_NAME" nillable="true" type="xsd:string"/>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="ADMIN_NAME" nillable="true" type="xsd:string"/>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="CNTRY_NAME" nillable="true" type="xsd:string"/>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="STATUS" nillable="true" type="xsd:string"/>' +
            '<xsd:element maxOccurs="1" minOccurs="0" name="POP_CLASS" nillable="true" type="xsd:string"/>' +
          '</xsd:sequence>' +
        '</xsd:extension>' +
      '</xsd:complexContent>' +
    '</xsd:complexType>' +
    '<xsd:element name="tasmania_cities" substitutionGroup="gml:_Feature" type="topp:tasmania_citiesType"/>' +
  '</xsd:schema>';

var getFeatureResponseText = '<wfs:FeatureCollection ' +
    'xmlns:xs="http://www.w3.org/2001/XMLSchema" ' +
    'xmlns:nasa="http://nasa.gov" ' +
    'xmlns:ogc="http://www.opengis.net/ogc" ' +
    'xmlns:maps="http://boundlessgeo.com" ' +
    'xmlns:topp="http://www.openplans.org/topp" ' +
    'xmlns:wfs="http://www.opengis.net/wfs" ' +
    'xmlns:ne="http://naturalearthdata.com" ' + 
    'xmlns:ows="http://www.opengis.net/ows" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'xmlns:gml="http://www.opengis.net/gml" ' +
    'xmlns:osm="http://openstreemap.org" ' +
    'xmlns:nurc="http://www.nurc.nato.int" ' +
    'xmlns:og="http://opengeo.org" ' +
    'xmlns:usgs="http://www.usgs.gov/" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
    'numberOfFeatures="1">' +
      '<gml:boundedBy>' +
          '<gml:Envelope srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
              '<gml:lowerCorner>147.2910004483 -42.851001816890005</gml:lowerCorner>' +
              '<gml:upperCorner>147.2910004483 -42.851001816890005</gml:upperCorner>' +
          '</gml:Envelope>' +
      '</gml:boundedBy>' +
      '<gml:featureMembers>' +
          '<topp:tasmania_cities gml:id="tasmania_cities.1">' +
              '<gml:boundedBy>' +
                  '<gml:Envelope srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
                      '<gml:lowerCorner>147.2910004483 -42.851001816890005</gml:lowerCorner>' +
                      '<gml:upperCorner>147.2910004483 -42.851001816890005</gml:upperCorner>' +
                  '</gml:Envelope>' +
              '</gml:boundedBy>' +
              '<topp:the_geom>' +
                  '<gml:MultiPoint srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
                      '<gml:pointMember>' +
                          '<gml:Point srsDimension="2">' +
                              '<gml:pos>147.2910004483 -42.851001816890005</gml:pos>' +
                          '</gml:Point>' +
                      '</gml:pointMember>' +
                  '</gml:MultiPoint>' +
              '</topp:the_geom>' +
              '<topp:CITY_NAME>Hobart</topp:CITY_NAME>' +
              '<topp:ADMIN_NAME>Tasmania</topp:ADMIN_NAME>' +
              '<topp:CNTRY_NAME>Australia</topp:CNTRY_NAME>' +
              '<topp:STATUS>Provincial capital</topp:STATUS>' +
              '<topp:POP_CLASS>100,000 to 250,000</topp:POP_CLASS>' +
          '</topp:tasmania_cities>' +
      '</gml:featureMembers>' +
  '</wfs:FeatureCollection>';

var exceptionReportResponseText = '<ows:ExceptionReport ' +
    'xmlns:xs="http://www.w3.org/2001/XMLSchema" ' +
    'xmlns:ows="http://www.opengis.net/ows" ' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '<ows:Exception exceptionCode="404">'  +
      '<ows:ExceptionText>Not Found</ows:ExceptionText>' +
    '</ows:Exception>' +
  '</ows:ExceptionReport>';

  describe('#getFeature', function () {
    var server;
    var feature;

    beforeEach(function() {
      // Create fake XHR.
      server = sinon.fakeServer.create();

      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        geometryField: 'the_geom',
        namespaceUri: 'testUri',
        maxFeatures: 5000
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (
          xhr.method === 'POST' &&
          xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0 &&
          new RegExp(options.url + '.*', 'gi').test(xhr.url)) {
          
          // Respond with error to prevent DescribeFeatureType response parsing.
          xhr.respond(500, { 'Content-Type': 'text/html' }, 'Error');
          return;
        }

        throw new Error('Unexpected request');
      });

      var wfs = new L.WFS(options);

      // Force fake server to respond on sended requests.
      server.respond();

      feature = wfs.getFeature();
    });

    afterEach(function () {
      // Restore original XHR.
      server.restore();
    });

    it('should return Element object with tagName=GetFeature and must have attiributes "service" and "version"', function () {     
      expect(feature).to.be.instanceOf(Element);
      expect(feature.tagName).to.be.equal('wfs:GetFeature');
      expect(feature.getAttribute('service')).to.be.not.undefined;
      expect(feature.getAttribute('version')).to.be.not.undefined;
    });

    it('should return value of maxFeatures', function () {
      expect(feature.getAttribute('maxFeatures')).to.be.equal('5000');
    });

    it('should have child Element with tagName wfs:Query and attribute "typeName"', function () {
      var query = feature.firstChild;
      expect(query.tagName).to.be.equal('wfs:Query');
      expect(query.getAttribute('typeName')).to.be.equal('topp:tasmania_cities');
    });
  });

  describe('#error event', function () {
    var server;

    beforeEach(function() {
      // Create fake XHR.
      server = sinon.fakeServer.create();
    });

    afterEach(function () {
      // Restore original XHR.
      server.restore();
    });

    it('should trigger \'error\' event if \'DescribeFeatureType\' request failed', function () {
      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        crs: L.CRS.EPSG4326,
        geometryField: 'the_geom'
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (
          xhr.method === 'POST' &&
          xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0 &&
          new RegExp(options.url + '.*', 'gi').test(xhr.url)) {

          xhr.respond(404, { 'Content-Type': 'text/html' }, 'Not Found');
          return;
        }

        throw new Error('Unexpected request');
      });

      // Create layer & attach evens handlers.
      var onLoadEventHandler = sinon.spy();
      var onErrorEventHandler = sinon.spy();
      var wfs = new L.WFS(options)
        .on('load', onLoadEventHandler)
        .on('error', onErrorEventHandler);

      // Force fake server to respond on sended requests.
      server.respond();

      // Check events handlers.
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.calledWithMatch({ error: new Error('Not Found') })).to.be.equal(true);
    });

    it('should trigger \'error\' event if \'DescribeFeatureType\' request succeed but with ExceptionReport', function () {
      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        crs: L.CRS.EPSG4326,
        geometryField: 'the_geom'
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (
          xhr.method === 'POST' &&
          xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0 &&
          new RegExp(options.url + '.*', 'gi').test(xhr.url)) {

          xhr.respond(200, { 'Content-Type': 'text/xml' }, exceptionReportResponseText);
          return;
        }

        throw new Error('Unexpected request');
      });

      // Create layer & attach evens handlers.
      var onLoadEventHandler = sinon.spy();
      var onErrorEventHandler = sinon.spy();
      var wfs = new L.WFS(options)
        .on('load', onLoadEventHandler)
        .on('error', onErrorEventHandler);

      // Force fake server to respond on sended requests.
      server.respond();

      // Check events handlers.
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.calledWithMatch({ error: new Error('404 - Not Found') })).to.be.equal(true);
    });

    it('should trigger \'error\' event if \'DescribeFeatureType\' request succeed, but \'GetFeature\' request failed', function () {
      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        crs: L.CRS.EPSG4326,
        geometryField: 'the_geom',
        showExisting: true
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (xhr.method === 'POST' && new RegExp(options.url + '.*', 'gi').test(xhr.url)) {
          if (xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0) {
            xhr.respond(200, { 'Content-Type': 'text/xml' }, describeFeaturesReponseText);
            return;
          } else if (xhr.requestBody.indexOf('<wfs:GetFeature') === 0) {
            xhr.respond(404, { 'Content-Type': 'text/html' }, 'Not found');
            return;
          }
        }

        throw new Error('Unexpected request');
      });

      // Create layer & attach evens handlers.
      var onLoadEventHandler = sinon.spy();
      var onErrorEventHandler = sinon.spy();
      var wfs = new L.WFS(options)
        .on('load', onLoadEventHandler)
        .on('error', onErrorEventHandler);

      // Force fake server to respond on 'DescribeFeatures' request.
      server.respond();
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.notCalled).to.be.equal(true);

      // Force fake server to respond on 'GetFeature' request (which will be sended automatically when 'DescribeFeatures' request succeed).
      server.respond();

      // Check events handlers.
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.calledWithMatch({ error: new Error('Not Found') })).to.be.equal(true);
    });

    it('should trigger \'error\' event if \'DescribeFeatureType\' request succeed, but \'GetFeature\' request succeed with ExceptionReport', function () {
      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        crs: L.CRS.EPSG4326,
        geometryField: 'the_geom',
        showExisting: true
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (xhr.method === 'POST' && new RegExp(options.url + '.*', 'gi').test(xhr.url)) {
          if (xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0) {
            xhr.respond(200, { 'Content-Type': 'text/xml' }, describeFeaturesReponseText);
            return;
          } else if (xhr.requestBody.indexOf('<wfs:GetFeature') === 0) {
            xhr.respond(200, { 'Content-Type': 'text/xml' }, exceptionReportResponseText);
            return;
          }
        }

        throw new Error('Unexpected request');
      });

      // Create layer & attach evens handlers.
      var onLoadEventHandler = sinon.spy();
      var onErrorEventHandler = sinon.spy();
      var wfs = new L.WFS(options)
        .on('load', onLoadEventHandler)
        .on('error', onErrorEventHandler);

      // Force fake server to respond on 'DescribeFeatures' request.
      server.respond();
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.notCalled).to.be.equal(true);

      // Force fake server to respond on 'GetFeature' request (which will be sended automatically when 'DescribeFeatures' request succeed).
      server.respond();

      // Check events handlers.
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.calledWithMatch({ error: new Error('404 - Not Found') })).to.be.equal(true);
    });

    it('should trigger \'load\' event if \'DescribeFeatureType\' request succeed, and \'GetFeature\' request succeed', function () {
      var options = {
        url: 'http://demo.opengeo.org/geoserver/ows',
        typeNS: 'topp',
        typeName: 'tasmania_cities',
        crs: L.CRS.EPSG4326,
        geometryField: 'the_geom',
        showExisting: true
      };

      // Prepare a handler for fake server possible requests.
      server.respondWith(function(xhr, id) {
        if (xhr.method === 'POST' && new RegExp(options.url + '.*', 'gi').test(xhr.url)) {
          if (xhr.requestBody.indexOf('<wfs:DescribeFeatureType') === 0) {
            xhr.respond(200, { 'Content-Type': 'text/xml' }, describeFeaturesReponseText);
            return;
          } else if (xhr.requestBody.indexOf('<wfs:GetFeature') === 0) {
            xhr.respond(200, { 'Content-Type': 'text/xml' }, getFeatureResponseText);
            return;
          }
        }

        throw new Error('Unexpected request');
      });

      // Create layer & attach evens handlers.
      var onLoadEventHandler = sinon.spy();
      var onErrorEventHandler = sinon.spy();
      var wfs = new L.WFS(options)
        .on('load', onLoadEventHandler)
        .on('error', onErrorEventHandler);

      // Force fake server to respond on 'DescribeFeatures' request.
      server.respond();
      expect(onLoadEventHandler.notCalled).to.be.equal(true);
      expect(onErrorEventHandler.notCalled).to.be.equal(true);

      // Force fake server to respond on 'GetFeature' request (which will be sended automatically when 'DescribeFeatures' request succeed).
      server.respond();

      // Check events handlers.
      expect(onLoadEventHandler.calledWithMatch({ responseText: getFeatureResponseText })).to.be.equal(true);
      expect(onErrorEventHandler.notCalled).to.be.equal(true);
    });
  });
});
