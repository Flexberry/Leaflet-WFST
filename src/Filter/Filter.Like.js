L.Filter.Like = L.Filter.Abstract.extend({
  tagName: 'ogc:PropertyIsLike',

  attributes: {
    wildCard: '*',
    singleChar: '#',
    escapeChar: '!',
    matchCase: true
  },

  initialize: function (name, val, attributes) {
    this.name = name;
    this.val = val;
    this.attributes = L.extend(this.attributes, attributes || {});
  },

  buildFilterContent: function (filterElement) {
    var nameElement = L.Filter.propertyName(this.name);
    var valueElement = L.Filter.literal(this.val);
    filterElement.appendChild(nameElement);
    filterElement.appendChild(valueElement);
    return filterElement;
  }
});
