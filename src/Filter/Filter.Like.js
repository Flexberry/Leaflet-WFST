L.Filter.Like = L.Filter.extend({
  append: function (name, val, attributes) {
    attributes = L.extend({
      wildCard: '*',
      singleChar: '#',
      escapeChar: '!'
    }, attributes || {});
    var eqElement = L.XmlUtil.createElementNS('ogc:PropertyIsLike', attributes);
    var nameElement = L.XmlUtil.createElementNS('ogc:PropertyName', {}, {value: name});
    var valueElement = L.XmlUtil.createElementNS('ogc:Literal', {}, {value: val});
    eqElement.appendChild(nameElement);
    eqElement.appendChild(valueElement);
    this.filter.appendChild(eqElement);
    return this;
  }
});
