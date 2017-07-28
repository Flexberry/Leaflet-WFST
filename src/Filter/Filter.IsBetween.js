L.Filter.IsBetween = L.Class.extend({
  initialize: function (property, lowerBoundary, upperBoundary) {
    this.property = property;
    this.lowerBoundary = lowerBoundary;
    this.upperBoundary = upperBoundary;
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS('ogc:PropertyIsBetween');
    if (this.property instanceof Element) {
      filterElement.appendChild(this.property);
    } else {
      filterElement.appendChild(L.GmlUtil.propertyName(this.property));
    }

    var lowerBoundaryElement = L.XmlUtil.createElementNS('ogc:LowerBoundary');
    if (this.lowerBoundary instanceof Element) {
      lowerBoundaryElement.appendChild(this.lowerBoundary);
    } else {
      lowerBoundaryElement.appendChild(L.GmlUtil.literal(this.lowerBoundary));
    }

    filterElement.appendChild(lowerBoundaryElement);

    var upperBoundaryElement = L.XmlUtil.createElementNS('ogc:UpperBoundary');
    if (this.upperBoundary instanceof Element) {
      upperBoundaryElement.appendChild(this.upperBoundary);
    } else {
      upperBoundaryElement.appendChild(L.GmlUtil.literal(this.upperBoundary));
    }

    filterElement.appendChild(upperBoundaryElement);

    return filterElement;
  }
});

L.Filter.isbetween = function(property, lowerBoundary, upperBoundary) {
  return new L.Filter.IsBetween(property, lowerBoundary, upperBoundary);
};
