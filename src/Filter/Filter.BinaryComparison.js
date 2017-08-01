L.Filter.BinaryComparison = L.Filter.BinaryOperator.extend({
  attributes: {
    matchCase: false
  },

  initialize: function(firstValue, secondValue, matchCase) {
    L.Filter.BinaryOperator.prototype.initialize.call(this, firstValue, secondValue);
    if(matchCase !== undefined) {
      this.attributes.matchCase = matchCase;
    }
  }
});
