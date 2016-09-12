L.Filter.BBox = L.Filter.extend({
  append: function(bbox, geometryField, crs) {
    var filterBBox = L.XmlUtil.createElementNS('ogc:BBOX');
    filterBBox.appendChild(L.XmlUtil.createElementNS('ogc:PropertyName', {}, {value: geometryField}));

    var envelope = L.XmlUtil.createElementNS('gml:Envelope', {srsName: crs.code});
    envelope.appendChild(L.XmlUtil.createElementNS('gml:lowerCorner', {}, {value: bbox.getSouthWest().lng + ' ' + bbox.getSouthWest().lat}));
    envelope.appendChild(L.XmlUtil.createElementNS('gml:upperCorner', {}, {value: bbox.getNorthEast().lng + ' ' + bbox.getNorthEast().lat}));

    filterBBox.appendChild(envelope);

    this.filter.appendChild(filterBBox);
    return this;
  }
});
