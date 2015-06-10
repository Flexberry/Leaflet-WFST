/**
 * Created by PRadostev on 10.06.2015.
 */

L.Format.Scheme = L.Class.extend({
  initialize: function (geometryField) {
    this.geometryField = geometryField;
  },

  parse: function (element) {
    var featureType = new L.GML.FeatureType(this.geometryField);
    var complexTypeDefinition = element.getElementsByTagName('complexType')[0];
    var properties = complexTypeDefinition.getElementsByTagName('sequence')[0];
    for (var i = 0; i < properties.childNodes.length; i++) {
      var node = properties.childNodes[i];
      if (node.nodeType !== document.ELEMENT_NODE) {
        continue;
      }

      var typeAttr = node.attributes.type;
      if (!typeAttr) {
        var restriction = node.getElementsByTagName('restriction');
        typeAttr = restriction.attributes.base;
      }

      if (!typeAttr) {
        continue;
      }

      var typeName = typeAttr.value.split(':').pop();
      var propertyName = node.tagName.split(':').pop();
      featureType.appendField(propertyName, typeName);
    }

    return featureType;
  }
});
