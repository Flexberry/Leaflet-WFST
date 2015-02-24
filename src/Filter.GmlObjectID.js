/**
 * Created by PRadostev on 09.02.2015.
 */

L.Filter.GmlObjectID = L.Filter.extend({

    feature: {},

    initialize: function (feature) {
        this.feature = feature;
    },

    innerGml: function () {
        return L.XmlUtil.createElementNS('ogc:GmlObjectId', {'gml:id': this.feature.id});
    }
});