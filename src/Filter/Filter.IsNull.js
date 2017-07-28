L.Filter.IsNull = L.Class.extend({
  initialize: function (propertyName) {
    this.propertyName = propertyName;
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS('ogc:PropertyIsNull');
    filterElement.appendChild(L.GmlUtil.propertyName(this.propertyName));
    return filterElement;
  }
});


L.Filter.isnull = function(propertyName) {
  return new L.Filter.IsNull(propertyName);
};
