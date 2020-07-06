const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
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

var ShippingReceiptRespondSchema = new mongoose.Schema({
    documentNum: {
        type: String,
        unique: true,
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
    boxHeader: [boxHeaderSchema]
});



Object.assign(ShippingReceiptRespondSchema.statics, {
    Status
});

const ShippingReceiptRespond = mongoose.model('ShippingReceiptRespond', ShippingReceiptRespondSchema);

module.exports =  ShippingReceiptRespond 

