/**
 * Created by PRadostev on 20.02.2015.
 */

L.WFST.include({

  insert: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Insert');
    node.appendChild(this.gmlFeature(layer));
    return node;
  },

  update: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Update', {typeName: this.options.typeNSName});
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
    }

    node.appendChild(this.wfsProperty(this.namespaceName(this.options.geometryField),
      layer.toGml(this.options.crs)));

    var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
    node.appendChild(filter.toGml());
    return node;
  },

  remove: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Delete', {typeName: this.options.typeNSName});
    var filter = new L.Filter.GmlObjectID().append(layer.feature.id);
    node.appendChild(filter.toGml());
    return node;
  }
});
