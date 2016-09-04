/**
 * Created by PRadostev on 06.02.2015.
 * Class L.Filter
 * This class represents an OGC Filter
 */

L.Filter = L.Class.extend({
  initialize: function () {
    this.filter = L.XmlUtil.createElementNS('ogc:Filter');
  },

  /**
   * Represents this filter as GML node
   *
   * Returns:
   * {XmlElement} Gml representation of this filter
   */
  toGml: function () {
    return this.filter;
  },

  append: function () {
    return this;
  },
});

L.Filter.GmlObjectID = L.Filter.extend({
  append: function (id) {
    this.filter.appendChild(L.XmlUtil.createElementNS('ogc:GmlObjectId', {'gml:id': id}));
    return this;
  }
});

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
