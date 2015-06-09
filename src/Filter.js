/**
 * Created by PRadostev on 06.02.2015.
 * Class L.Filter
 * This class represents an OGC Filter
 */

L.Filter = L.Class.extend({
  initialize: function () {
    this.filter = L.XmlUtil.createElementNS('ogc:Filter');
  },

  /**
   * Represents this filter as GML node
   *
   * Returns:
   * {XmlElement} Gml representation of this filter
   */
  toGml: function () {
    return this.filter;
  },

  append: function () {
    return this;
  }
});
