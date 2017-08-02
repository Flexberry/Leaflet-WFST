/**
 * Created by PRadostev on 06.02.2015.
 * Class L.Filter
 * This class represents an OGC Filter
 */

L.Filter = L.Class.extend({
  filters: null,

  initialize: function (filter) {
    if (Array.isArray(filter)) {
      this.filters = filter;
    } else {
      this.filters = [];
      if (filter) {
        this.filters.push(filter);
      }
    }
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

L.filter = function (filter) {
  return new L.Filter(filter);
};
