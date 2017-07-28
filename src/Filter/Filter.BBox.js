L.Filter.BBox = L.Class.extend({
  bbox: null,

  geometryField: null,

  crs: null,

  initialize: function (geometryField, bbox, crs) {
    this.bbox = bbox;
    this.geometryField = geometryField;
    this.crs = crs;
  },

  toGml: function () {
    var bboxElement = L.XmlUtil.createElementNS('ogc:BBOX');
    if (this.geometryField) {
      bboxElement.appendChild(L.GmlUtil.propertyName(this.geometryField));
    }

    bboxElement.appendChild(this.bbox.toGml(this.crs));
    return bboxElement;
  }
});

L.Filter.bbox = function (geometryField, bbox, crs) {
  return new L.Filter.BBox(geometryField, bbox, crs);
};
