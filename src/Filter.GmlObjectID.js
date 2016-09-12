L.Filter.GmlObjectID = L.Filter.extend({
  append: function (id) {
    this.filter.appendChild(L.XmlUtil.createElementNS('ogc:GmlObjectId', {'gml:id': id}));
    return this;
  }
});
