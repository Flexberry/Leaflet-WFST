L.Filter.BinaryComparison = L.Filter.BinaryOperator.extend({
  options: {
    matchCase: false
  },

  initialize: function(firstValue, secondValue, options) {
    L.Filter.BinaryOperator.prototype.initialize.call(this, firstValue, secondValue);
    L.Util.setOptions(this, options);
  },

  toGml: function() {
    var filterElement =  L.Filter.BinaryOperator.prototype.toGml.call(this);
    filterElement.setAttribute('matchCase', this.options.matchCase);
    return filterElement;
  }
});
