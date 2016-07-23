L.Marker.include({
  setProperties: function(obj) {
    for (var i in obj) {
      this.feature.properties[i] = obj[i];
    }
  },
  getPropertiesId: function() {
    return this.feature.id;
  },
  getProperties: function(field) {
    return this.feature.properties[field];
  }
});
L.Path.include({
  setProperties: function(obj) {
    for (var i in obj) {
      this.feature.properties[i] = obj[i];
    }
  },
  getPropertiesId: function() {
    return this.feature.id;
  },
  getProperties: function(field) {
    return this.feature.properties[field];
  }
});
