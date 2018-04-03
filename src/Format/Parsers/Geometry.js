/**
 * Basic parser for Layer elements
 *
 * @class GML.Geometry
 * @extends GML.Element
 */

L.GML.Geometry = L.GML.Element.extend({

  /**
   * Returns new object where options properties merged with element specific values
   *
   * @method elementOptions
   * @param {Element} element
   * @param {Object} options
   */
  elementOptions: function(element, options) {
    var result = L.extend({}, options);
    var dimension = element.getAttribute('srsDimension');
    if(dimension) {
      result.dimension = parseInt(dimension);
    }

    return result;
  }
});
