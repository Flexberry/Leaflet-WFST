/**
 * Created by PRadostev on 10.06.2015.
 */

L.Format.Scheme = L.Class.extend({
  options: {
    geometryField: 'Shape',
  },

  initialize: function (options) {
    L.setOptions(this, options);
  },

  parse: function (element) {
    var featureType = new L.GML.FeatureType({
      geometryField: this.options.geometryField
    });
    var complexTypeDefinition = element.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'complexType')[0];
    var properties = complexTypeDefinition.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'sequence')[0];
    for (var i = 0; i < properties.children.length; i++) {
      var node = properties.children[i];
      var propertyAttr = node.attributes.name;
      if (!propertyAttr) {
        continue;
      }

      var propertyName = node.attributes.name.value;
      var typeAttr = node.attributes.type;
      if (!typeAttr) {
        var restriction = node.getElementsByTagNameNS(L.XmlUtil.namespaces.xsd, 'restriction');
        typeAttr = restriction.attributes.base;
      }

      if (!typeAttr) {
        continue;
      }

      var typeName = typeAttr.value.split(':').pop();

      if (propertyName === this.options.geometryField) {
        featureType.geometryFields[propertyName] = typeName;
        continue;
      }

      var nillableAttr = node.attributes.nillable;
      var required = nillableAttr && nillableAttr.value === 'false';

      featureType.appendField(propertyName, typeName, required);
    }

    return featureType;
  }
});
