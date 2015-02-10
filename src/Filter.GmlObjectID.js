/**
 * Created by PRadostev on 09.02.2015.
 */

L.Filter.GmlObjectID = L.Filter.extend({

    feature: {},

    initialize: function (feature) {
        this.feature = feature;
    },

    toGml: function () {
        var node = L.XmlUtil.createElementNS('GmlObjectID', {'gml:id': this.feature.id});
        var filter = L.Filter.prototype.toGml.call(this);
        filter.appendChild(node);
        return filter;
    }
});