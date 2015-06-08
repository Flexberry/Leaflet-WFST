/**
 * Created by PRadostev on 05.06.2015.
 */

L.GML.CoordinatesParser = L.GML.ElementParser.extend({

    defaultSeparator: {
        ds: '.', //decimal separator
        cs: ',', // component separator
        ts: '.' // tuple separator
    },

    initialize: function () {
        this.elementTag = 'gml:coordinates';
    },

    parse: function (element) {

        var ds = this.defaultSeparator.ds;
        if (element.attributes.decimal) {
            ds = element.attributes.decimal.value;
        }

        var cs = this.defaultSeparator.cs;
        if (element.attributes.cs) {
            cs = element.attributes.cs.value;
        }

        var strCoords = element.textContent.split(cs);
        return strCoords.map(function (coord) {
            if (ds !== '.') {
                coord = coord.replace(ds, '.');
            }
            return parseFloat(coord);
        });
    }
});