L.Filter.DistanceBuffer = L.Class.extend({
  tagName: null,

  initialize: function (propertyName, geometry, crs, distance, units) {
    this.propertyName = propertyName;
    this.geomerty = geometry;
    this.crs = crs;
    this.distance = distance;
    this.units = units;
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS(this.tagName);
    filterElement.appendChild(L.GmlUtil.propertyName(this.propertyName));
    filterElement.appendChild(this.geomerty.toGml(this.crs));
    filterElement.appendChild(L.XmlUtil.createElementNS('ogc:Distance', { 'units': this.units }, { value: this.distance }));
    return filterElement;
  }
});
