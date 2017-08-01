L.Filter.BinaryLogic = L.Class.extend({
  tagName: null,

  filters: null,

  initialize: function () {
    var filters = [];
    for (var i = 0; i < arguments.length; i++) {
      filters.push(arguments[i]);
    }

    this.filters = filters;
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS(this.tagName);
    this.filters.forEach(function(filter) {
      filterElement.appendChild(filter.toGml());
    });

    return filterElement;
  }
});
