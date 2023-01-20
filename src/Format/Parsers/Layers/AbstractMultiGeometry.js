/**
 * Abstract class for multigeometry parsers
 *
 * It is base class for parsing such xml's as
 *
 * ```xml
 * <gml:Multi%Something%>
 *   <gml:%somesting%Member>
 *     <gml:%Something1% />
 *   </gml:%somesting%Member>
 *   <gml:%somesting%Member>
 *     <gml:%Something2% />
 *   </gml:%somesting%Member>
 *   ...
 * <gml:Multi%Something%>
 * ```
 *
 * or
 *
 * ```xml
 * <gml:Multi%Something%>
 *   <gml:%somesting%Members>
 *     <gml:%Something1% />
 *     <gml:%Something2% />
 *     ...
 *   </gml:%somesting%Members>
 * <gml:Multi%Something%>
 * ```
 *
 * @class GML.MultiGeometry
 * @extends L.GML.Geometry
 */

L.GML.AbstractMultiGeometry = L.GML.Geometry.extend({
  includes: [L.GML.ParserContainerMixin, L.GML.CoordsToLatLngMixin],
  initialize: function () {
    this.initializeParserContainer();
  },

  /**
   * Convert element to array of geometry objects
   *
   * @method parse
   * @param {Element} element
   * @param {options}
   * @return {Array} array of geometry objects
   */
  parse: function (element, options) {
    options = this.elementOptions(element, options);
    var childObjects = [];
    for (var i = 0; i < element.children.length; i++) {
      var geometryMember = element.children[i];

      for (var j = 0; j < geometryMember.children.length; j++) {
        var singleGeometry = geometryMember.children[j];
        childObjects.push(this.parseElement(singleGeometry, options));
      }
    }
	  return childObjects;
  }
});

