const mongoose = require('mongoose');
const { conn } = require('../db/mongoose-erdis-local');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid'
});

var boxDetailSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});

var boxHeaderSchema = new mongoose.Schema({
    boxBarcode: {
        type: String
    },
    boxDetails: [boxDetailSchema]
});

var ShippingReceiptBoxRespondSchema = new mongoose.Schema({

    documentNum: {
        type: String,
        required: true
    },
    date: {
        type: Date
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    sentToAX: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.N
    },
    sentBy: {
        type: String
    },

    boxHeader: [boxHeaderSchema]
});


Object.assign(ShippingReceiptBoxRespondSchema.statics, {
    Status
});

var ShippingReceiptBoxRespond = conn.model('ShippingReceiptBoxRespond', ShippingReceiptBoxRespondSchema);

module.exports = { ShippingReceiptBoxRespond }

