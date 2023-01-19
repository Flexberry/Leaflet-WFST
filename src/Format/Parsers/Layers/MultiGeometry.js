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

L.GML.MultiGeometry = L.GML.Geometry.extend({
  includes: [L.GML.ParserContainerMixin, L.GML.CoordsToLatLngMixin],
  elementTag: 'gml:MultiGeometry',

  initialize: function () {
    this.initializeParserContainer();
    this.appendParser(new L.GML.Point());
    this.appendParser(new L.GML.LineString());
    this.appendParser(new L.GML.Polygon());
    this.appendParser(new L.GML.MultiLineString());
    this.appendParser(new L.GML.MultiPolygon());
    this.appendParser(new L.GML.MultiCurve());
    this.appendParser(new L.GML.MultiSurface());
    this.appendParser(new L.GML.MultiPoint());
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

    return this.transform(childObjects, options);
  }
});
