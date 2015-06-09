/**
 * Created by PRadostev on 20.02.2015.
 */

L.Polygon.include({
  toGml: function (crs) {
    var node = L.XmlUtil.createElementNS('gml:Polygon', {srsName: crs.code, srsDimension: 2});
    node.appendChild(L.XmlUtil.createElementNS('gml:exterior'))
      .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
      .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this.getLatLngs()), true));

    if (this._holes && this._holes.length) {
      for (var hole in this._holes) {
        node.appendChild(L.XmlUtil.createElementNS('gml:interior'))
          .appendChild(L.XmlUtil.createElementNS('gml:LinearRing', {srsDimension: 2}))
          .appendChild(L.GMLUtil.posListNode(L.Util.project(crs, this._holes[hole]), true));
      }
    }

    return node;
  }
});
