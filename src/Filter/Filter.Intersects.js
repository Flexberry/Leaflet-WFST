L.Filter.Intersects = L.Filter.extend({
  initialize: function(geometryLayer, geometryField, crs) {
    this.geometryLayer = geometryLayer;
    this.geometryField = geometryField;
    this.crs = crs;
  },

  toGml: function() {
    var intersectsElement = L.XmlUtil.createElementNS('ogc:Intersects');
    intersectsElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: this.geometryField }));
    intersectsElement.appendChild(this.geometryLayer.toGml(this.crs));
    return intersectsElement;
  }
});
