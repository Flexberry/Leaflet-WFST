/**
  Created by DLytkina on 21.02.2023.
*/
L.FeatureGroup.include({
    /** ТОЛЬКО для мультиточек !!!
    *
    *  <gml:MultiPoint gml:id="ID">
    *    <gml:pointMembers>
    *      <gml:Point gml:id="ID">
    *        <gml:pos>1.0 1.0</gml:pos>
    *      </gml:Point>
    *      <gml:Point gml:id="ID">
    *        <gml:pos>1.0 1.0</gml:pos>
    *      </gml:Point>
    *    </gml:pointMembers>
    *  </gml:MultiPoint>
    */
    toGml: function (crs, forceMulti) {
        var gmlElements = [];
        this.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                gmlElements.push(layer.toGml(crs));
            } else {
                throw('Not implemented toGml function for featureGroup, only FeatureGroup that is MultiPoint');
            }
        });

        if (gmlElements.length === 1 && !forceMulti) {
            return gmlElements[0];
        }

        var multi = L.XmlUtil.createElementNS('gml:MultiPoint', { srsName: crs.code, srsDimension: 2 });
        var collection = multi.appendChild(L.XmlUtil.createElementNS('gml:pointMembers'));
        for (var point = 0; point < gmlElements.length; point++) {
            collection.appendChild(gmlElements[point]);
        }

        return multi;
    }
});
