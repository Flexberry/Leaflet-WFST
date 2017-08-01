/**
 * Created by PRadostev on 06.02.2015.
 * Class L.Filter
 * This class represents an OGC Filter
 */

L.Filter = L.Class.extend({
  filters: null,

  initialize: function () {
    var filters = [];
    for (var i = 0; i < arguments.length; i++) {
      filters.push(arguments[i]);
    }

    this.filters = filters;
  },

  /**
   * Represents this filter as GML node
   *
   * Returns:
   * {XmlElement} Gml representation of this filter
   */
  toGml: function () {
    var result = L.XmlUtil.createElementNS('ogc:Filter');
    this.filters.forEach(function (element) {
      result.appendChild(element.toGml());
    }, this);
    return result;
  },

  append: function (filter) {
    this.filters.push(filter);
  }
});

L.filter = function () {
  return new (Function.prototype.bind.apply(L.Filter, arguments))();
};
