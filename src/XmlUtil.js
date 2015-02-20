/**
 * Created by PRadostev on 06.02.2015.
 */

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
    }

};