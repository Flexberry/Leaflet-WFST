/**
 * Created by PRadostev on 20.02.2015.
 */

L.WFST.include({

  /**
    Returns wfs:Insert element for passed layer

    @method insertElement
    @param {Layer} layer
    @return {Element} wfs:Insert element with layer
   */
  insertElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Insert');
    node.appendChild(this.gmlFeature(layer));
    return node;
  },

  /**
    Returns wfs:Update element for specified layer

    @method updateElement
    @param {Layer} layer
    @return {Element} wfs:Update element for passed layer properties limited with filter by feature.id
   */
  updateElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Update', { typeName: this.options.typeNSName });
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      if (feature.properties.hasOwnProperty(propertyName)) {
        node.appendChild(this.wfsProperty(propertyName, feature.properties[propertyName]));
      }
    }

    node.appendChild(
      this.wfsProperty(
        this.namespaceName(this.options.geometryField),
        layer.toGml(this.options.crs, this.options.forceMulti)
      )
    );

    var idFilter = new L.Filter.GmlObjectID(layer.feature.id);
    node.appendChild(L.filter(idFilter));
    return node;
  },

  removeElement: function (layer) {
    var node = L.XmlUtil.createElementNS('wfs:Delete', { typeName: this.options.typeNSName });
    var idFilter = new L.Filter.GmlObjectID(layer.feature.id);
    node.appendChild(L.filter(idFilter));
    return node;
  }
});
