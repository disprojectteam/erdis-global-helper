
const _ = require('lodash');


// .......USEAGE .....

// SUM
// DataGrouper.register("sum", function (item) {
//     return _.extend({}, item.key, {
//         Value: _.reduce(item.vals, function (memo, node) {
//             return memo + Number(node.qty);
//         }, 0)
//     });
// });
//DataGrouper.sum(allBarcodes, ["boxBarcode", "barcode", "orderNum"])


// MAX
// DataGrouper.register("max", function (item) {
//     return _.extend({}, item.key, {
//         Max: _.reduce(item.vals, function (memo, node) {
//             return Math.max(memo, Number(node.Value));
//         }, Number.NEGATIVE_INFINITY)
//     });
// });
//DataGrouper.max(allBarcodes, ["boxBarcode", "barcode", "orderNum"])


var DataGrouper = (function () {
    var has = function (obj, target) {
        return _.some(obj, function (value) {
            return _.isEqual(value, target);
        });
    };

    var keys = function (data, names) {
        return _.reduce(data, function (memo, item) {
            var key = _.pick(item, names);
            if (!has(memo, key)) {
                memo.push(key);
            }
            return memo;
        }, []);
    };

    var group = function (data, names) {
        var stems = keys(data, names);
        return _.map(stems, function (stem) {
            return {
                key: stem,
                vals: _.map(_.filter(data, stem), function (item) {
                    return _.omit(item, names);
                })
            };
        });
    };

    group.register = function (name, converter) {
        return group[name] = function (data, names) {
            return _.map(group(data, names), converter);
        };
    };

    return group;
}());

module.exports = DataGrouper;