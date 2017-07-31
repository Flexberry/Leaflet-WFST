L.Filter.BinaryLogic = L.Class.extend({
  tagName: null,

  filters: null,

  initialize: function () {
    this.filters = [];
    for (var i = 0; i < arguments.length; i++) {
      this.filters.push(arguments[i]);
    }
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS(this.tagName);
    this.filters.forEach(function(filter) {
      filterElement.appendChild(filter.toGml());
    });

    return filterElement;
  }
});
