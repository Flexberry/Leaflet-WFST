L.Filter.BBox = L.Filter.extend({
  append: function(bbox, geometryField, crs) {
    var projectedSW = crs.project(bbox.getSouthWest());
    var projectedNE = crs.project(bbox.getNorthEast());

    var envelope = L.XmlUtil.createElementNS('gml:Envelope', {srsName: crs.code});
    envelope.appendChild(L.XmlUtil.createElementNS('gml:lowerCorner', {}, {value: projectedSW.x + ' ' + projectedSW.y}));
    envelope.appendChild(L.XmlUtil.createElementNS('gml:upperCorner', {}, {value: projectedNE.x + ' ' + projectedNE.y}));

    var filterBBox = L.XmlUtil.createElementNS('ogc:BBOX');
    filterBBox.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, {value: geometryField}));
    filterBBox.appendChild(envelope);

    this.filter.appendChild(filterBBox);

    return this; 
  }
});
