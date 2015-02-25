#Leaflet-WFST 

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

#Basic WFS example
```javascript
var map = L.map('map').setView([0, 0], 2);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

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

#Filter
OGC Filter realization:
##GmlFeatureId filter
Example:
```javascript
var feature = {id: 1};
var filter = new L.Filter.GmlFeatureID(feature);
filter.toGml()
```

#WFST Example
Editing plugin - [Leaflet.Editable](https://github.com/yohanboniface/Leaflet.Editable)
```javascript
L.WFS.Transaction.include(MultiEditableMixin);

var wfst = new L.WFS.Transaction({
    url: 'http://myserver/geoserver/ows',
    typeNS: 'myns',
    typeName: 'POIPOINT',
    style: {
        color: 'blue',
        weight: 2
    }
}).addTo(map).on('load', function () {
            map.fitBounds(wfst);
            wfst.enableEdit();
        });
        
map.on('editable:created', function (e) {
    boundaries.addLayer(e.layer);
});

map.on('editable:editing', function (e) {
    boundaries.editLayer(e.layer);
});
```
to make "wfs:Transaction" POST request call
```javascript
wfst.save()
```

#License
MIT


