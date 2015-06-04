/*! Leaflet-WFST 0.0.1 2015-06-04 */
(function(window, document, undefined) {

"use strict";

L.XmlUtil = {
    // comes from OL
    namespaces: {
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs",
        gml: "http://www.opengis.net/gml",
        ogc: "http://www.opengis.net/ogc",
        ows: "http://www.opengis.net/ows",
        xmlns: "http://www.w3.org/2000/xmlns/"
    },

    //TODO: есть ли нормальная реализация для создания нового документа с doctype text/xml?
    xmldoc: (new DOMParser()).parseFromString('<root />', 'text/xml'),

    setAttributes: function (node, attributes) {
        for (var name in attributes) {
            if (attributes[name] != null && attributes[name].toString) {
                var value = attributes[name].toString();
                var uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                node.setAttributeNS(uri, name, value);
            }
        }
    },

    evaluate: function (xpath, rawxml) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(rawxml, 'text/xml');
        var xpe = new XPathEvaluator();
        var nsResolver = xpe.createNSResolver(xmlDoc.documentElement);

        return xpe.evaluate(xpath, xmlDoc, nsResolver, XPathResult.ANY_TYPE, null);
    },

    createElementNS: function (name, attributes, options) {
        options = options || {};

        var uri = options.uri;

        if (!uri) {
            uri = this.namespaces[name.substring(0, name.indexOf(":"))];
        }

        if (!uri) {
            uri = this.namespaces[options.prefix];
        }

        var node = uri ? this.xmldoc.createElementNS(uri, name) : this.xmldoc.createElement(name);

        if (attributes) {
            this.setAttributes(node, attributes);
        }

        if (options.value != null) {
            node.appendChild(this.xmldoc.createTextNode(options.value));
        }

        return node;
    },

    createTextNode: function (value) {
        return this.xmldoc.createTextNode(value);
    },

    createXmlDocumentString: function (node) {
        var doc = document.implementation.createDocument("", "", null);
        doc.appendChild(node);
        var serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    },

    createXmlString: function (node) {
        var serializer = new XMLSerializer();
        return serializer.serializeToString(node);
    },

    parseXml: function (rawXml) {
        if (typeof window.DOMParser !== "undefined") {
            return ( new window.DOMParser() ).parseFromString(rawXml, "text/xml");
        } else if (typeof window.ActiveXObject !== "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
            var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(rawXml);
            return xmlDoc;
        } else {
            throw new Error("No XML parser found");
        }
    }
};
L.Util.request = function (options) {
    options = L.extend({
        async: true,
        method: 'POST',
        data: '',
        params: {},
        headers: {},
        url: window.location.href,
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log('Ajax fail');
            console.log(data);
        },
        complete: function () {
        }
    }, options);

    // good bye IE 6,7
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                options.success(xhr.responseText);
            } else {
                options.error(xhr.responseText);
            }
            options.complete();
        }
    };

    var url = options.url + L.Util.getParamString(options.params, options.url);

    xhr.open(options.method, url, options.async);
    for (var header in options.headers) {
        xhr.setRequestHeader(header, options.headers[header]);
    }

    xhr.send(options.data);
};
L.Filter = L.Class.extend({
    initialize: function () {
        this.filter = L.XmlUtil.createElementNS('ogc:Filter');
    },

    /**
     * Represents this filter as GML node
     *
     * Returns:
     * {XmlElement} Gml representation of this filter
     */
    toGml: function () {
        return this.filter;
    },

    append: function () {
        return this;
    }
});
L.Filter.GmlObjectID = L.Filter.extend({
    append: function (id) {
        this.filter.appendChild(L.XmlUtil.createElementNS('ogc:GmlObjectId', {'gml:id': id}));
        return this;
    }
});
L.Format = L.Class.extend({
    defaultOptions: {
        crs: L.CRS.EPSG3857,
        coordsToLatLng: function (coords) {
            return new L.LatLng(coords[1], coords[0], coords[2]);
        },
        latLngToCoords: function (latlng) {
            var coords = [latlng.lng, latlng.lat];
            if (latlng.alt !== undefined) {
                coords.push(latlng.alt);
            }
            return coords;
        }
    },

    setCRS: function (crs) {
        this.options.crs = crs;
        if (crs !== undefined) {
            this.options.coordsToLatLng = function (coords) {
                var point = L.point(coords[0], coords[1]);
                return crs.projection.unproject(point);
            };
            this.options.latLngToCoords = function (ll) {
                var point = new L.latLng(ll[0], ll[1]);
                return crs.projection.project(point);
            };
        }
    },

    initialize: function (options) {
        L.setOptions(this, L.extend(this.defaultOptions, options));
    }
});
L.Format.GeoJSON = L.Format.extend({

    initialize: function (options) {
        L.Format.prototype.initialize.call(this, options);
        this.outputFormat = 'application/json';
    },

    responseToLayers: function (rawData, options) {
        options = options || {};
        var layers = [];
        var geoJson = JSON.parse(rawData);

        for (var i = 0; i < geoJson.features.length; i++) {
            layers.push(this.processFeature(geoJson.features[i], options));
        }

        return layers;
    },

    processFeature: function (feature, options) {
        var layer = this.generateLayer(feature, options);
        layer.feature = feature;
        return layer;
    },

    generateLayer: function (feature, options) {
        return L.GeoJSON.geometryToLayer(feature, options.pointToLayer || null, options.coordsToLatLng, null);
    }
});

L.Format.GML = L.Format.extend({
    initialize: function (options) {
        L.Format.prototype.initialize.call(this, options);
        this.outputFormat = 'text/xml; subtype=gml/3.1.1';
    },

    responseToLayers: function (rawData, options) {
        var layers = [];
        var xmlDoc = L.XmlUtil.parseXml(rawData);
        var featureCollection = xmlDoc.documentElement;
        var featureMemberNodes = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMember');
        for (var i = 0; i < featureMemberNodes.length; i++) {
            var feature = featureMemberNodes[i].firstChild;
            layers.push(this.processFeature(feature, options));
        }

        var featureMembersNode = featureCollection.getElementsByTagNameNS(L.XmlUtil.namespaces.gml, 'featureMembers');
        if (featureMembersNode.length > 0) {
            var features = featureMembersNode[0].childNodes;
            for (var j = 0; j < features.length; j++) {
                var node = features[j];
                if (node.nodeType === document.ELEMENT_NODE) {
                    layers.push(this.processFeature(node, options));
                }
            }
        }

        return layers;
    },

    processFeature: function (feature, options) {
        var geometry = feature.getElementsByTagName(options.geometryField)[0];
        var layer = this.generateLayer(geometry, options);
        var properties = {};
        for (var i = 0; i < feature.childNodes.length; i++) {
            var node = feature.childNodes[i];
            if (node.nodeType === document.ELEMENT_NODE && node !== geometry) {
                var propertyName = node.tagName.split(':').pop();
                properties[propertyName] = node.innerHTML;
            }
        }
        layer.feature = {properties: properties};
        return layer;
    },

    generateLayer: function (geometry, options) {

    }


});
L.Util.project = function (crs, latlngs) {
    if (L.Util.isArray(latlngs)) {
        var result = [];
        latlngs.forEach(function (latlng) {
            result.push(crs.projection.project(latlng));
        });

        return result;
    }
    else {
        return crs.projection.project(latlngs);
    }
};

L.GMLUtil = {
    posNode: function (coord) {
        return L.XmlUtil.createElementNS('gml:pos', {srsDimension: 2}, {value: coord.x + ' ' + coord.y});
    },

    posListNode: function (coords, close) {
        var localcoords = [];
        coords.forEach(function (coord) {
            localcoords.push(coord.x + ' ' + coord.y);
        });
        if (close && coords.length > 0) {
            var coord = coords[0];
            localcoords.push(coord.x + ' ' + coord.y);
        }

        var posList = localcoords.join(' ');
        return L.XmlUtil.createElementNS('gml:posList', {}, {value: posList});
    }
};
L.Marker.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:Point', {srsName: crs.code});
        node.appendChild(L.GMLUtil.posNode(L.Util.project(crs, this.getLatLng())));
        return node;
    }
});
L.MultiPolygon.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:MultiPolygon', {srsName: crs.code, srsDimension: 2});
        var collection = node.appendChild(L.XmlUtil.createElementNS('gml:polygonMembers'));
        this.eachLayer(function (polygon) {
            collection.appendChild(polygon.toGml(crs));
        });

        return node;
    }
});
L.MultiPolyline.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:MultiLineString', {srsName: crs.code, srsDimension: 2});
        var collection = node.appendChild(L.XmlUtil.createElementNS('gml:lineStringMembers'));
        this.eachLayer(function (polyline) {
            collection.appendChild(polyline.toGml(crs));
        });

        return node;
    }
});
L.Polygon.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:Polygon', {srsName: crs.code, srsDimension: 2});
        node.appendChild(L.XmlUtil.createElementNS('gml:exterior'))
            .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
            .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));

        if (this._holes && this._holes.length) {
            for (var hole in this._holes) {
                node.appendChild(L.XmlUtil.createElementNS('gml:interior'))
                    .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
                    .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this._holes[hole]), true));
            }
        }

        return node;
    }
});

L.Polyline.include({
    toGml: function (crs) {
        var node = L.XmlUtil.createElementNS('gml:LineString', {srsName: crs.code, srsDimension: 2});
        node.appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));
        return node;
    }
});

L.WFS = L.FeatureGroup.extend({

    options: {
        crs: L.CRS.EPSG3857,
        showExisting: true,
        geometryField: 'Shape',
        url: '',
        version: '1.1.0',
        typeNS: '',
        typeName: '',
        typeNSName: '',
        style: {
            color: 'black',
            weight: 1
        },
        namespaceUri: ''
    },

    state: {},

    initialize: function (options, readFormat) {
        L.setOptions(this, options);
        var crs = this.options.crs;

        this.state =  {exist: 'exist'};

        this.options.coordsToLatLng = function (coords) {
            var point = L.point(coords[0], coords[1]);
            return crs.projection.unproject(point);
        };

        this.options.latLngToCoords = function (latlng) {
            var coords = crs.projection.project(latlng);

            if (latlng.alt !== undefined) {
                coords.push(latlng.alt);
            }
            return coords;
        };

        this._layers = {};

        this.readFormat = readFormat || new L.Format.GeoJSON();

        this.options.typeNSName = this.namespaceName(this.options.typeName);
        this.options.srsName = this.options.crs.code;

        if (this.options.showExisting) {
            this.loadFeatures();
        }
    },

    namespaceName: function (name) {
        return this.options.typeNS + ':' + name;
    },

    getFeature: function (filter) {
        var request = L.XmlUtil.createElementNS('wfs:GetFeature',
            {
                service: 'WFS',
                version: this.options.version,
                outputFormat: this.readFormat.outputFormat
            });

        var query = request.appendChild(L.XmlUtil.createElementNS('wfs:Query',
            {
                typeName: this.options.typeNSName,
                srsName: this.options.srsName
            }));

        if (filter && filter.toGml) {
            query.appendChild(filter.toGml());
        }

        return request;
    },

    loadFeatures: function (filter) {
        var that = this;
        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.createXmlDocumentString(that.getFeature(filter)),
            success: function (data) {
                var layers = that.readFormat.responseToLayers(data,
                    {
                        coordsToLatLng: that.options.coordsToLatLng,
                        pointToLayer: that.options.pointToLayer
                    });
                layers.forEach(function (element) {
                    element.state = that.state.exist;
                    that.addLayer(element);
                });

                that.setStyle(that.options.style);
                that.fire('load');

                return that;
            }
        });
    }
});

L.wfs = function (options, readFormat) {
    return new L.WFS(options, readFormat);
};
L.WFS.Transaction = L.WFS.extend({
    initialize: function (options, readFormat) {
        L.WFS.prototype.initialize.call(this, options, readFormat);
        this.describeFeatureType();
        this.state = L.extend(this.state, {
            insert: 'insert',
            update: 'update',
            remove: 'remove'
        });

        this.changes = {};
    },

    describeFeatureType: function () {
        var requestData = L.XmlUtil.createElementNS('wfs:DescribeFeatureType', {service: 'WFS', version: this.options.version});
        requestData.appendChild(L.XmlUtil.createElementNS('TypeName', {}, {value: this.options.typeNSName}));

        var that = this;
        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.createXmlDocumentString(requestData),
            success: function (data) {
                var parser = new DOMParser();
                var featureInfo = parser.parseFromString(data, "text/xml").documentElement;
                that.options.namespaceUri = featureInfo.attributes.targetNamespace.value;
            }
        });
    },

    addLayer: function (layer) {
        L.FeatureGroup.prototype.addLayer.call(this, layer);
        if (!layer.feature) {
            layer.feature = {properties: {}};
        }

        if (!layer.state) {
            layer.state = this.state.insert;
            var id = this.getLayerId(layer);
            this.changes[id] = layer;
        }
        return this;
    },

    removeLayer: function (layer) {
        L.FeatureGroup.prototype.removeLayer.call(this, layer);

        var id = this.getLayerId(layer);

        if (id in this.changes) {
            var change = this.changes[id];
            if (change.state === this.state.insert) {
                delete this.changes[id];
            }
            else {
                change.state = this.state.remove;
            }
        }
        else {
            layer.state = this.state.remove;
            this.changes[id] = layer;
        }
    },

    editLayer: function (layer) {
        if (layer.state !== this.state.insert) {
            layer.state = this.state.update;
        }

        var id = this.getLayerId(layer);
        this.changes[id] = layer;
        return this;
    },

    save: function () {
        var transaction = L.XmlUtil.createElementNS('wfs:Transaction', {service: 'WFS', version: this.options.version});

        var inserted = [];

        for (var id in this.changes) {
            var layer = this.changes[id];
            var action = this[layer.state](layer);
            transaction.appendChild(action);

            if (layer.state === this.state.insert) {
                inserted.push(layer);
            }
        }

        var that = this;

        L.Util.request({
            url: this.options.url,
            data: L.XmlUtil.createXmlDocumentString(transaction),
            success: function (data) {
                var insertResult = L.XmlUtil.evaluate('//wfs:InsertResults/wfs:Feature/ogc:FeatureId/@fid', data);
                var filter = new L.Filter.GmlObjectID();
                var id = insertResult.iterateNext();
                while (id) {
                    filter.append(id.value);
                    id = insertResult.iterateNext();
                }

                inserted.forEach(function (layer) {
                    L.FeatureGroup.prototype.removeLayer.call(that, layer);
                });

                that.once('load', function () {
                    that.fire('save:success');
                    that.changes = {};
                });

                that.loadFeatures(filter);
            }
        });

        return this;
    }
});
L.WFS.Transaction.include({
    gmlFeature: function (layer) {
        var featureNode = L.XmlUtil.createElementNS(this.options.typeNSName, {}, {uri: this.options.namespaceUri});
        var feature = layer.feature;
        for (var propertyName in feature.properties) {
            featureNode.appendChild(this.gmlProperty(propertyName,
                feature.properties[propertyName]));
        }

        featureNode.appendChild(this.gmlProperty(this.options.geometryField,
            layer.toGml(this.options.crs)));
        return featureNode;
    },

    gmlProperty: function (name, value) {
        var propertyNode = L.XmlUtil.createElementNS(this.namespaceName(name));
        if (value instanceof Element) {
            propertyNode.appendChild(value);
        }
        else {
            propertyNode.appendChild(L.XmlUtil.createTextNode(value || ''));
        }

        return propertyNode;
    },

    wfsProperty: function (name, value) {
        var propertyNode = L.XmlUtil.createElementNS('wfs:Property');
        propertyNode.appendChild(L.XmlUtil.createElementNS('wfs:Name', {}, {value: name}));
        var valueNode = L.XmlUtil.createElementNS('wfs:Value');
        if (value instanceof Element) {
            valueNode.appendChild(value);
        }
        else {
            valueNode.appendChild(L.XmlUtil.createTextNode(value || ''));
        }

        propertyNode.appendChild(valueNode);

        return propertyNode;
    }
});

L.WFS.Transaction.include({

    insert: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Insert');
        node.appendChild(this.gmlFeature(layer));
        return node;
    },

    update: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Update', {typeName: this.options.typeNSName});
        var feature = layer.feature;
        for (var propertyName in feature.properties) {
            node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
        }

        node.appendChild(this.wfsProperty(this.namespaceName(this.options.geometryField),
            layer.toGml(this.options.crs)));

        var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
        node.appendChild(filter.toGml());
        return node;
    },

    remove: function (layer) {
        var node = L.XmlUtil.createElementNS('wfs:Delete', {typeName: this.options.typeNSName});
        var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
        node.appendChild(filter.toGml());
        return node;
    }
});

})(window, document);