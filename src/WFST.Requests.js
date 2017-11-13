/**
 * Created by PRadostev on 20.02.2015.
 */

L.WFST.include({

  insertElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Insert');
    node.appendChild(this.gmlFeature(layer));
    return node;
  },

  updateElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Update', {typeName: this.options.typeNSName});
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
    }

    node.appendChild(this.wfsProperty(this.namespaceName(this.options.geometryField),
      layer.toGml(this.options.crs)));

    var idFilter = new L.Filter.GmlObjectID(layer.feature.id);
    node.appendChild(L.filter(idFilter));
    return node;
  },

  removeElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Delete', {typeName: this.options.typeNSName});
    var idFilter = new L.Filter.GmlObjectID(layer.feature.id);
    node.appendChild(L.filter(idFilter));
    return node;
  }
});
