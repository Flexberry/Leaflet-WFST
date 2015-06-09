/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.AbstractMultiPolygonParser = L.GML.MultiGeometryParser.extend({

  parse: function (element, options) {
    var childLayers = L.GML.MultiGeometryParser.prototype.parse.call(this, element, options);
    var layer = new L.MultiPolygon([]);
    for (var i = 0; i < childLayers.length; i++) {
      layer.addLayer(childLayers[i]);
    }

    return layer;
  }
});
