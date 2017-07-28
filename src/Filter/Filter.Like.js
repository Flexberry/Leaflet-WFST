L.Filter.Like = L.Class.extend({

  initialize: function (name, val, attributes) {
    this.name = name;
    this.val = val;
    this.attributes = attributes;
  },

  toGml: function() {
    var attributes = L.extend({
      wildCard: '*',
      singleChar: '#',
      escapeChar: '!',
      matchCase: true
    }, this.attributes || {});
    var filterElement = L.XmlUtil.createElementNS('ogc:PropertyIsLike', attributes);
    var nameElement = L.XmlUtil.createElementNS('ogc:PropertyName', {}, {value: this.name});
    var valueElement = L.XmlUtil.createElementNS('ogc:Literal', {}, {value: this.val});
    filterElement.appendChild(nameElement);
    filterElement.appendChild(valueElement);
    return filterElement;
  }
});
