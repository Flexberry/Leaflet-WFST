L.Filter.BinaryComparison = L.Class.extend({
  tagName: null,

  options: {
    matchCase: true
  },

  initialize: function (firstValue, secondValue, options) {
    this.firstValue = firstValue;
    this.secondValue = secondValue;
    L.Util.setOptions(this, options);
  },

  toGml: function () {
    var filterElement = L.XmlUtil.createElementNS(this.tagName, { matchCase: this.options.matchCase });
    if (this.firstValue instanceof Element) {
      filterElement.appendChild(this.firstValue);
    } else if (this.firstValue && typeof (this.firstValue.toGml) === "function") {
      filterElement.appendChild(this.firstValue.toGml());
    } else {
      filterElement.appendChild(L.GmlUtil.propertyName(this.firstValue));
    }

    if (this.secondValue instanceof Element) {
      filterElement.appendChild(this.secondValue);
    } else if (this.secondValue && typeof (this.secondValue.toGml) === "function") {
      filterElement.appendChild(this.secondValue.toGml());
    } else {
      filterElement.appendChild(L.GmlUtil.literal(this.secondValue));
    }

    return filterElement;
  }
});
