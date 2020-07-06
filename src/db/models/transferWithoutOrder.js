const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
});

var transferLineSchema = new mongoose.Schema({
    
    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});

var transferWithoutOrderSchema = new mongoose.Schema({
    documentNum : {
        type: String
    },
    warehouseFrom: {
        type: Number
    },
    warehouseTo: {
        type: Number
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

    lines : [transferLineSchema]
});


Object.assign(transferWithoutOrderSchema.statics, {
    Status
});


const TransferWithoutOrder = mongoose.model('transferWithoutOrder', transferWithoutOrderSchema);

module.exports =  TransferWithoutOrder 

