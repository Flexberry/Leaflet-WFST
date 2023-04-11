/**
 * Created by PRadostev on 10.06.2015.
 */

L.GML.FeatureType = L.Class.extend({
  options: {
    geometryField: 'Shape',
  },

  primitives: [
    {
      types: ['byte', 'short', 'int', 'integer', 'long', 'float', 'double', 'decimal', 'number'],
      parse: function (input) {
        if (input === 0) {
          return 0;
        }
        input = String.prototype.trim.call(input || '');
        return input === '' ? null : Number(input);
      },
      validate: function (parsedValue, required) {
        // Invalid number can be detected by isNaN check.
        return !isNaN(parsedValue) && (!required || parsedValue !== null);
      },
      type: 'number'
    },
    {
      types: ['string'],
      parse: function (input) {
        return input;
      },
      validate: function (parsedValue, required) {
        // Any value is valid for 'string' type.
        return !required || parsedValue;
      },
      type: 'string'
    },
    {
      types: ['boolean'],
      parse: function (input) {
        input = String.prototype.trim.call(input || '').toLowerCase();
        return input !== 'false';
      },
      validate: function (parsedValue, required) {
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
      validate: function (parsedValue, required) {
        // Invalid date also can be detected by isNaN check.
        return !isNaN(parsedValue) && (!required || parsedValue !== null);
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
    this.requiredFields = {};
  },

  appendField: function (name, type, required) {
    var that = this;
    type = String.prototype.toLowerCase.call(type || '');

    this.primitives.forEach(function (primitive) {
      if (primitive.types.indexOf(type) !== -1) {
        that.fields[name] = primitive.parse;
        that.fieldValidators[name] = function(parsedValue) { return primitive.validate(parsedValue, required); };
        that.fieldTypes[name] = primitive.type;
        that.requiredFields[name] = required || false;
      }
    });
  },

  parse: function (feature) {
    var properties = {};
    for (var i = 0; i < feature.children.length; i++) {
      var node = feature.children[i];
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
