var PropertiesMixin = {
  setProperties: function(obj) {
    for (var i in obj) {
      this.feature.properties[i] = obj[i];
    }
  },
  getProperty: function(field) {
    return this.feature.properties[field];
  }
};
L.Marker.include(PropertiesMixin);
L.Path.include(PropertiesMixin);
