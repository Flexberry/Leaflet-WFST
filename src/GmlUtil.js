/**
 * Utility functions for gml creation
 * @namespace GmlUtil
 */

L.GmlUtil = {

  /**
   * Create gml:pos Element with passed coordinates
   *
   * @method posNode
   * @param {L.Point} coord
   * @return {Element} gml:pos
   */
  posNode: function (coord) {
    return L.XmlUtil.createElementNS('gml:pos', { srsDimension: 2 }, { value: coord.x + ' ' + coord.y });
  },

  /**
   * Create gml:posList Element from passed coordinates
   *
   * @method posListNode
   * @param {Array} coords Array of L.Point that should be represent as GML
   * @param {boolean} close Should posList be closed, uses when need do polygon
   * @return {Element} gml:posList Element
   */
  posListNode: function (coords, close) {
    var localcoords = [];
    coords.forEach(function (coord) {
      localcoords.push(coord.x + ' ' + coord.y);
    });
    if (close && coords.length > 0) {
      var coord = coords[0];
      localcoords.push(coord.x + ' ' + coord.y);
    }

    var posList = localcoords.join(' ');
    return L.XmlUtil.createElementNS('gml:posList', {}, { value: posList });
  }
};
