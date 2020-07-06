const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
});

var wmsCountLinesSchema = new mongoose.Schema({
    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});


var wmsCountSchema = new mongoose.Schema({
    documentId: {
        type: String
    },
    docType: {
        type: String
    },
    countType: {
        type: String
    },
    documentDate: {
        type: Date
    },
    warehouse: {
        type: String
    },
    sentToAX: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.N
    },
    wmsCountLines: [wmsCountLinesSchema]
});


Object.assign(wmsCountSchema.statics, {
    Status
});


wmsCountSchema.index({ documentId: 1, countType: 1 }, { unique: true });

const WmsCount = mongoose.model('WmsCount', wmsCountSchema);

module.exports = WmsCount
