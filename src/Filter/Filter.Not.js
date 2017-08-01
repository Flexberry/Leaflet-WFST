L.Filter.Not = L.Class.extend({
  initialize: function(filter) {
    this.filter = filter;
  },

  toGml: function() {
    var filterElement = L.XmlUtil.createElementNS('Not');
    filterElement.appendChild(this.filter.toGml());
    return filterElement;
  }
})
