/**
 * Created by PRadostev on 05.06.2015.
 */
L.GML = L.GML || {};

L.GML.ParserContainerMixin = {
    parsers: {},
    appendParser: function (parser) {
        this.parsers[parser.elementTag] = parser;
    },

    parseElement: function (element) {
        var parser = this.parsers[element.tagName];
        if (!parser) throw('unknown element' + element.tagName);

        return parser.parse(element);
    }
};