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
    orderNum: {
        type: String
    },
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
    totalQty: {
        type: Number
    },
    volume: {
        type: Number
    },
    volumetricWeight: {
        type: Number
    },
    weight: {
        type: Number
    },
    boxDimension: {
        type: String
    },
    boxDetails: [boxDetailSchema]
});

var ShippingOrderRespondSchema = new mongoose.Schema({
    
    dispatchNum: {
        type: String,
        unique: true,
        required: true
    },
    custAccount: {
        type: String
    },
    orderNum:{
        type:String
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

Object.assign(ShippingOrderRespondSchema.statics, {
    Status
});



const ShippingOrderRespond = mongoose.model('ShippingOrderRespond', ShippingOrderRespondSchema);

module.exports =  ShippingOrderRespond 

