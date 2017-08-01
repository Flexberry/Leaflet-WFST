L.Filter.GmlObjectID = L.Filter.Abstract.extend({
  tagName: 'ogc:GmlObjectId',

  initialize: function (id) {
    this.attributes =  { 'gml:id': id };
  },

  buildFilterContent: function() {

  }
});
