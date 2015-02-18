/**
 * Created by PRadostev on 06.02.2015.
 * Class L.Filter
 * This class represents an OGC Filter
 */

L.Filter = L.Class.extend({

    /**
     * Represents this filter as GML node
     *
     * Returns:
     * {XmlElement} Gml representation of this filter
     */
    toGml: function () {
        return L.XmlUtil.createElementNS('ogc:Filter');
    }
});