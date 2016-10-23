L.Filter.EQ = L.Filter.extend({
  append: function (name, val) {
    var eqElement = L.XmlUtil.createElementNS('ogc:PropertyIsEqualTo');
    var nameElement = L.XmlUtil.createElementNS('ogc:ValueReference', {}, {value: name});
    var valueElement = L.XmlUtil.createElementNS('ogc:Literal', {}, {value: val});
    eqElement.appendChild(nameElement);
    eqElement.appendChild(valueElement);
    this.filter.appendChild(eqElement);
    return this;
  }
});
