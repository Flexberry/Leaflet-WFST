L.Filter.BBox = L.Class.extend({
  bbox: null,

  geometryField: null,

  crs: null,

  initialize: function(bbox, geometryField, crs) {
    this.bbox = bbox;
    this.geometryField = geometryField;
    this.crs = crs;
  },

  toGml: function() {
    var bboxElement = L.XmlUtil.createElementNS('ogc:BBOX');
    bboxElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: this.geometryField }));
    bboxElement.appendChild(this.bbox.toGml(this.crs));
    return bboxElement;
  }
});

L.Filter.bbox = function(bbox, geometryField, crs) {
  return new L.Filter.BBox(bbox, geometryField, crs);
};
