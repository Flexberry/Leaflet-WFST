L.Filter.Intersects = L.Filter.extend({
  append: function(geometryLayer, geometryField, crs) {
    var intersectsElement = L.XmlUtil.createElementNS('ogc:Intersects');
    intersectsElement.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: geometryField }));
    intersectsElement.appendChild(geometryLayer.toGml(crs));

    this.filter.appendChild(intersectsElement);

    return this; 
  }
});
