/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.Geometry = L.GML.Element.extend({
  statics: {
    DIM: 2
  },

  /**
   * Extract dimension option from element attributes
   *
   * @method dimensions
   * @param {Element} element
   * @return {int} dimension property for that element if it exists
   */
  dimensions: function (element) {
    if (element.attributes.srsDimension) {
      return parseInt(element.attributes.srsDimension.value);
    }

    return L.GML.Geometry.DIM;
  }
});
