/**
 * Created by PRadostev on 06.03.2015.
 */

L.Polyline.include({
  _lineStringNode: function (crs, latlngs) {
    var node = L.XmlUtil.createElementNS('gml:LineString', {srsName: crs.code, srsDimension: 2});
    node.appendChild(L.GmlUtil.posListNode(L.Util.project(crs, latlngs), false));
    return node;
  },

  toGml: function (crs, forceMulti) {
    var latLngs = this.getLatLngs();
    var gmlElements = [];

    if (L.Util.isFlat(latLngs)) {
       gmlElements.push(this._lineStringNode(crs, latLngs));
    } else {
      for (var i = 0; i < latLngs.length; i++) {
        gmlElements.push(this._lineStringNode(crs, latLngs[i]));
      }
    }

    if(gmlElements.length === 1 && !forceMulti) {
      return gmlElements[0];
    }

    var multi = L.XmlUtil.createElementNS('gml:MultiCurve', {srsName: crs.code, srsDimension: 2});
    var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:curveMembers'));
    for (var lines = 0; lines < gmlElements.length; lines++) {
      collection.appendChild(gmlElements[lines]);
    }

    return multi;
  }
});
