L.WFST.include({
  gmlFeature: function (layer) {
    var featureNode = L.XmlUtil.createElementNS(this.options.typeNSName, {}, { uri: this.options.namespaceUri });
    var feature = layer.feature;
    for (var propertyName in feature.properties) {
      featureNode.appendChild(this.gmlProperty(propertyName,
        feature.properties[propertyName]));
    }

    featureNode.appendChild(
      this.gmlProperty(
        this.options.geometryField,
        layer.toGml(
          this.options.crs,
          this.options.forceMulti
        )
      )
    );

    return featureNode;
  },

  /**
     Returns element with name as tag and value as innerText or child element
     ```xml
     <name>value<name>
     ```

     or if value is element

     ```xml
     <name><value /><name>
     ```

     @method gmlProperty
     @param {string} name Name of property
     @param {Object} value Value of property
     @return {Element} simple property element <name>value<name>
   */
  gmlProperty: function (name, value) {
    var propertyNode = L.XmlUtil.createElementNS(this.namespaceName(name));
    if (value instanceof Element) {
      propertyNode.appendChild(value);
    }
    else if (value === null || value === undefined || value === '') {
      L.XmlUtil.setAttributes(propertyNode, { 'xsi:nil': true });
    } else {
      propertyNode.appendChild(L.XmlUtil.createTextNode(value));
    }

    return propertyNode;
  },

  /**
    Returns wfs:Property element with passed property name and value:
    ```xml
    <wfs:Property>
      <wfs:Name>%name%</wfs:Name>
      <wfs:Value>%value%</wfs:Value>
    </wfs:Property>
    ```

    @method wfsProperty
    @param {string} name Property name
    @param {Object} value Property value, if passed Element object it will be added as child element of value
    @return {Element}
   */
  wfsProperty: function (name, value) {
    var propertyNode = L.XmlUtil.createElementNS('wfs:Property');
    propertyNode.appendChild(L.XmlUtil.createElementNS('wfs:Name', {}, { value: name }));
    var valueNode = L.XmlUtil.createElementNS('wfs:Value');
    if (value instanceof Element) {
      valueNode.appendChild(value);
    }
    else {
      valueNode.appendChild(L.XmlUtil.createTextNode(value));
    }

    propertyNode.appendChild(valueNode);

    return propertyNode;
  }
});
