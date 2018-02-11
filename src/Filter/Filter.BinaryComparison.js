L.Filter.BinaryComparison = L.Filter.BinaryOperator.extend({
  matchCase: false,

  initialize: function(firstValue, secondValue, matchCase) {
    L.Filter.BinaryOperator.prototype.initialize.call(this, firstValue, secondValue);
    this.attributes = { matchCase: !!matchCase };
  }
});
