#Leaflet-WFST
[![Build Status](https://travis-ci.org/Flexberry/Leaflet-WFST.svg?branch=master)](https://travis-ci.org/Flexberry/Leaflet-WFST)

OGC WFS-T client layer for leaflet.

#Initialization options
```javascript
   options: {
        crs: L.CRS.EPSG3857,
        showExisting: true,
        geometryField: 'Shape',
        url: '',
        typeNS: '',
        typeName: '',
        style: {
            color: 'black',
            weight: 1
        }
    }

```

|option name|default|comment|
|-----------|-------|-------|
|crs|L.CRS.EPSG3857|spatial reference system for layer, should implement [ICRS](http://leafletjs.com/reference.html#icrs), for example [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) |
|showExisting|true|load existing features on create layer|
|geometryField|'Shape'|field for storing geometries, for non transaction services may be ommited|
|url|-|WFS url, for example http://demo.opengeo.org/geoserver/osm/ows
|typeNS|-|type namespace|
|typeName|-|type name|
|typeNSName|-|type namespace name|
|namespaceUri|-|namespace URI|
|style|-|leaflet vector style|
|filter|-|any filter. see [filter](#filter)|
|maxFeatures|-|limit the amount of features returned|

#Basic WFS example - [view](http://flexberry.github.io/Leaflet-WFST/examples/tasmania.html)
```javascript
var map = L.map('map').setView([0, 0], 2);

var boundaries = new L.WFS({
    url: 'http://demo.opengeo.org/geoserver/ows',
    typeNS: 'topp',
    typeName: 'tasmania_state_boundaries',
    crs: L.CRS.EPSG4326,
    style: {
        color: 'blue',
        weight: 2
    }
}).addTo(map)
        .on('load', function () {
            map.fitBounds(boundaries);
        })
```

#Methods
Extends leaflet classes with toGml(crs) function:
* L.Marker
* L.Polygon
* L.Polyline
* L.MultiPolygon
* L.MultiPolyline
* L.LatLngBounds

#Events
Triggers two type of events:
* load - triggers when both 'DescribeFeatureType' & 'GetFeature' requests succeed, and features have been successfully parsed into leaflet layers
* error - triggers when any 'DescribeFeatureType' or 'GetFeature' request fails, and features haven't been parsed into leaflet layers

Markers geometry writes as posNode, for all other layers geometry writes as posList

# Filter

OGC Filter realization:

##GmlObjectID filter

Example:
```javascript
  var filter = new L.Filter.GmlObjectID().append(1);
  filter.toGml()
```
code above will return xml:
```xml
  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
    <ogc:GmlObjectId xmlns:gml="http://www.opengis.net/gml" gml:id="1" />
  </ogc:Filter>
```
to load feature by id pass filter to WFS-layer options:
```javascript
  var wfs = new L.WFS({
    filter: new L.Filter.GmlObjectID().append(1)
  });
```

##EQ filter

Example:
```javascript
  var filter = new L.Filter.EQ().append('city', 'Perm');
  filter.toGml()
```
code above will return xml:
```xml
  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
    <ogc:PropertyIsEqualTo>
      <ogc:PropertyName>city</ogc:PropertyName>
      <ogc:Literal>Perm</ogc:Literal>
    </ogc:PropertyIsEqualTo>
  </ogc:Filter>
```
to load features by some property equality to the specified value pass filter to WFS-layer options:
```javascript
  var wfs = new L.WFS({
    filter: new L.Filter.EQ().append('city', 'Perm')
  });
```

##BBox filter

Example:
```javascript
    var filter = new L.Filter.BBox().append(L.latLngBounds(L.latLng(40.712, -74.227), L.latLng(40.774, -74.125)), 'ogr_geometry', L.CRS.EPSG4326);
    filter.toGml()
```
code above will return xml:
```xml
  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
    <ogc:BBOX>
      <ogc:PropertyName>ogr_geometry</ogc:PropertyName>
      <gml:Envelope xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:4326">
        <gml:lowerCorner>-74.227 40.712</gml:lowerCorner>
        <gml:upperCorner>-74.125 40.774</gml:upperCorner>
      </gml:Envelope>
    </ogc:BBOX>
  </ogc:Filter>
```
to load features by bbox pass filter to WFS-layer options:
```javascript
  var wfs = new L.WFS({
    filter: new L.Filter.BBox().append(L.latLngBounds(L.latLng(40.712, -74.227), L.latLng(40.774, -74.125)), 'ogr_geometry', L.CRS.EPSG4326)
  });
```

##Intersects filter

Example:
```javascript
  var filter = new L.Filter.Intersects().append(L.polygon([L.latLng(40.712, -74.227), L.latLng(40.774, -74.125), L.latLng(40.734, -74.175)]), 'ogr_geometry', L.CRS.EPSG4326);
  filter.toGml();
```
code above will return xml:
```xml
  <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
    <ogc:Intersects>
      <ogc:PropertyName>ogr_geometry</ogc:PropertyName>
      <gml:Polygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:4326" srsDimension="2">
        <gml:exterior>
          <gml:LinearRing srsDimension="2">
            <gml:posList>-74.227 40.712 -74.125 40.774 -74.175 40.734 -74.227 40.712</gml:posList>
          </gml:LinearRing>
        </gml:exterior>
      </gml:Polygon>
    </ogc:Intersects>
  </ogc:Filter>
```
to load features by intersection with the specified geometry pass filter to WFS-layer options:
```javascript
  var wfs = new L.WFS({
    filter: new L.Filter.Intersects().append(L.polygon([L.latLng(40.712, -74.227), L.latLng(40.774, -74.125), L.latLng(40.734, -74.175)]), 'ogr_geometry', L.CRS.EPSG4326)
  });
```

#WFST Example
Editing plugin - [Leaflet.Editable](https://github.com/yohanboniface/Leaflet.Editable)
```javascript
L.WFST.include(MultiEditableMixin);

var wfst = new L.WFST({
    url: 'http://myserver/geoserver/ows',
    typeNS: 'myns',
    typeName: 'POIPOINT',
    style: {
        color: 'blue',
        weight: 2
    }
}).addTo(map).once('load', function () {
            map.fitBounds(wfst);
            wfst.enableEdit();
        });

map.on('editable:created', function (e) {
    wfst.addLayer(e.layer);
});

map.on('editable:editing', function (e) {
    wfst.editLayer(e.layer);
});
```

to make "wfs:Transaction" POST request call save() method, example with [Leaflet.EasyButton](https://github.com/CliffCloud/Leaflet.EasyButton)
```javascript
 L.easyButton('fa-save', function () {
     wfst.save();
 }, 'Save changes');
```

#Layer properties
```javascript
//simple layer
layer = new L.Marker([0, 0]);
layer.feature = {
  id: 1,
  properties: {
    a: 'a',
    b: 'b'
  }
};

//get value by key 'a'
var a = layer.getProperty('a');

//change values
layer.setProperties({
  a: 'b',
  b:'a'
});

//add new property
layer.setProperties({
  c:'c'
});

//delete properties
layer.deleteProperties(['a','b','c']);
```

#Demo
demos for GML read format
* [Markers](http://flexberry.github.io/Leaflet-WFST/examples/markers.html)
* [Polygons](http://flexberry.github.io/Leaflet-WFST/examples/polygon.html)
* [Polylines](http://flexberry.github.io/Leaflet-WFST/examples/polyline.html)

demo for GeoJSON read format
* [Polygons](http://flexberry.github.io/Leaflet-WFST/examples/polygonGeoJSON.html)

demo filter bbox
* [BBox](http://flexberry.github.io/Leaflet-WFST/examples/filterBBox.html)

#License
MIT
