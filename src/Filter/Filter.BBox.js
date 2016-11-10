L.Filter.BBox = L.Filter.extend({
  append: function(bbox, geometryField, crs) {
    var bboxElement = L.XmlUtil.createElementNS('ogc:BBOX');
    bboxElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: geometryField }));
    bboxElement.appendChild(bbox.toGml(crs));

    this.filter.appendChild(bboxElement);

    return this; 
  }
});
