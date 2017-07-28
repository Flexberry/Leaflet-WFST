L.Filter.BinarySpatial = L.Class.extend({
  tagName: null,

  initialize: function (propertyName, value, crs) {
    this.propertyName = propertyName;
    this.value = value;
    this.crs = crs;
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS(this.tagName);
    filterElement.appendChild(L.GmlUtil.propertyName(this.propertyName));

    if (typeof(this.value) === "string") {
      filterElement.appendChild(L.GmlUtil.propertyName(this.value));
    } else {
      filterElement.appendChild(this.value.toGml(this.crs));
    }

    return filterElement;
  }
});
