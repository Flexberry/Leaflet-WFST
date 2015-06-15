/**
 * Created by PRadostev on 10.06.2015.
 */

L.GML.FeatureType = L.Class.extend({

  primitives: [
    {
      types: ['byte', 'decimal', 'int', 'integer', 'long', 'short'],
      parse: function (input) {
        return Number(input);
      }
    },
    {
      types: ['string'],
      parse: function (input) {
        return input;
      }
    },
    {
      types: ['boolean'],
      parse: function (input) {
        return input !== 'false';
      }
    },
    {
      types: ['date', 'time', 'datetime'],
      parse: function (input) {
        return new Date(input);
      }
    }
  ],

  initialize: function () {
    this.fields = {};
  },

  appendField: function (name, type) {
    var that = this;
    this.primitives.forEach(function (primitive) {
      if (primitive.types.indexOf(type) !== -1) {
        that.fields[name] = primitive.parse;
      }
    });
  },

  parse: function (feature) {
    var properties = {};
    for (var i = 0; i < feature.childNodes.length; i++) {
      var node = feature.childNodes[i];
      if (node.nodeType !== document.ELEMENT_NODE) continue;

      var propertyName = node.tagName.split(':').pop();
      var fieldParser = this.fields[propertyName];

      if (!fieldParser) continue;

      properties[propertyName] = fieldParser(node.textContent);
    }

    return {
      properties: properties,
      id: feature.attributes['gml:id'].value
    };
  }
});
