L.Filter.GmlObjectID = L.Class.extend({
  initialize: function (id) {
    this.id = id;
  },

  toGml: function () {
    return L.XmlUtil.createElementNS('ogc:GmlObjectId', { 'gml:id': this.id });
  }
});
