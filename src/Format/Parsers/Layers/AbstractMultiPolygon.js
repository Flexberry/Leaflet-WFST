/**
 * Created by PRadostev on 09.06.2015.
 */

L.GML.AbstractMultiPolygon = L.GML.MultiGeometry.extend({

  parse: function (element, options) {
    var childLayers = L.GML.MultiGeometry.prototype.parse.call(this, element, options);
    var layer = new L.MultiPolygon([]);
    for (var i = 0; i < childLayers.length; i++) {
      layer.addLayer(childLayers[i]);
    }

    return layer;
  }
});
