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

    defaultNS: 'wfs',

    setAttributes: function (node, attributes) {
        for (var name in attributes) {
            if (attributes[name] != null && attributes[name].toString) {
                var value = attributes[name].toString();
                var uri = this.namespaces[name.substring(0, name.indexOf(":"))] || null;
                node.setAttributeNS(uri, name, value);
            }
        }
    },

    createElementNS: function (name, options) {
        var uri = this.namespaces[name.substring(0, name.indexOf(":"))];
        if (!uri) uri = this.namespaces[this.defaultNS];

        var node = document.createElementNS(uri, name);
        if (options.attributes) {
            this.setAttributes(node, options.attributes);
        }

        if (options.value != null) {
            node.appendChild(this.createTextNode(options.value));
        }

        return node;

    },

    createXmlString: function (node) {
        var doc = document.implementation.createDocument("", "", null);
        doc.appendChild(node);
        var serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    }
};