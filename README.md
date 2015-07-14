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
|style|-|leaflet vector style|

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

Markers geometry writes as posNode, for all other layers geometry writes as posList

#Filter
OGC Filter realization:
##GmlObjectId filter
Example:
```javascript
var filter = new L.Filter.GmlObjectId();
filter.append(1);
filter.toGml()
```
code above will return:
```xml
<ogc:Filter>
    <ogc:GmlObjectId gml:id=1/>
</ogc:Filter>
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

#Demo
demos for GML read format
* [Markers](http://flexberry.github.io/Leaflet-WFST/examples/markers.html)
* [Polygons](http://flexberry.github.io/Leaflet-WFST/examples/polygon.html)
* [Polylines](http://flexberry.github.io/Leaflet-WFST/examples/polyline.html)

demo for GeoJSON read format
* [Polygons](http://flexberry.github.io/Leaflet-WFST/examples/polygonGeoJSON.html)

#License
MIT


