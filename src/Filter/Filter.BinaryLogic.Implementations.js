L.Filter.And = L.Filter.BinaryLogic.extend({
  tagName: 'And'
});

L.Filter.and = function() {
  return new L.Filter.And(arguments);
};

L.Filter.Or = L.Filter.BinaryLogic.extend({
  tagName: 'Or'
});

L.Filter.or = function() {
  return new L.Filter.Or(arguments);
};
