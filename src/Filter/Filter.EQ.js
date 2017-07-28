L.Filter.EQ = L.Class.extend({
  initialize: function (name, val) {
    this.name = name;
    this.val = val;
  },

  toGml: function () {
    var eqElement = L.XmlUtil.createElementNS('ogc:PropertyIsEqualTo');
    var nameElement = L.XmlUtil.createElementNS('ogc:PropertyName', {}, { value: this.name });
    var valueElement = L.XmlUtil.createElementNS('ogc:Literal', {}, { value: this.val });
    eqElement.appendChild(nameElement);
    eqElement.appendChild(valueElement);
    return eqElement;
  }
});
