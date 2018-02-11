/**
 * Created by PRadostev on 10.06.2015.
 */

L.GML.FeatureType = L.Class.extend({
  options: {
    geometryField: 'Shape',
  },

  primitives: [
    {
      types: ['byte', 'short', 'int', 'integer', 'long', 'float', 'double', 'decimal'],
      parse: function (input) {
        if (input === 0) {
          return 0;
        }
        input = String.prototype.trim.call(input || '');
        return input === '' ? null : Number(input);
      },
      validate: function (parsedValue) {
        // Invalid number can be detected by isNaN check.
        return !isNaN(parsedValue);
      },
      type: 'number'
    },
    {
      types: ['string'],
      parse: function (input) {
        return input;
      },
      validate: function (parsedValue) {
        // Any value is valid for 'string' type.
        return true;
      },
      type: 'string'
    },
    {
      types: ['boolean'],
      parse: function (input) {
        input = String.prototype.trim.call(input || '').toLowerCase();
        return input !== 'false';
      },
      validate: function (parsedValue) {
        // Any value is valid for 'boolean' type if parser parses it like so: input !== 'false'.
        return true;
      },
      type: 'boolean'
    },
    {
      types: ['date', 'time', 'datetime'],
      parse: function (input) {
        input = String.prototype.trim.call(input || '');
        return input === '' ? null : new Date(input);
      },
      validate: function (parsedValue) {
        // Invalid date also can be detected by isNaN check.
        return !isNaN(parsedValue);
      },
      type: 'date'
    }
  ],

  initialize: function (options) {
    L.setOptions(this, options);

    this.fields = {};
    this.fieldValidators = {};
    this.fieldTypes = {};
    this.geometryFields = {};
  },

  appendField: function (name, type) {
    var that = this;
    type = String.prototype.toLowerCase.call(type || '');

    this.primitives.forEach(function (primitive) {
      if (primitive.types.indexOf(type) !== -1) {
        that.fields[name] = primitive.parse;
        that.fieldValidators[name] = primitive.validate;
        that.fieldTypes[name] = primitive.type;
      }
    });
  },

  parse: function (feature) {
    var properties = {};
    for (var i = 0; i < feature.childNodes.length; i++) {
      var node = feature.childNodes[i];
      if (node.nodeType !== document.ELEMENT_NODE) {
        continue;
      }

      var propertyName = node.tagName.split(':').pop();
      if (propertyName === this.options.geometryField) {
        continue;
      }

      var parseField = this.fields[propertyName];
      if (!parseField) {
        this.appendField(propertyName, 'string');
        parseField = this.fields[propertyName];
      }

      properties[propertyName] = parseField(node.textContent);
    }

    return {
      type: 'Feature',
      properties: properties,
      id: feature.attributes['gml:id'].value
    };
  }
});
