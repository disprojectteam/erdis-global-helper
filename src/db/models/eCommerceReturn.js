const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid'
});

var orderLines = new mongoose.Schema({
    barcode: {
        type: String
    },
    qty: {
        type: Number
    }
});

var ECommerceReturnSchema = new mongoose.Schema({
    
    webOrderNum : {
        type: String,
        unique: true,
        required: true
    },
    warehouse : {
        type: String
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
    sentBy:{
        type:String
    },
    orderLines: [orderLines]
});

Object.assign(ECommerceReturnSchema.statics, {
    Status
});



const ECommerceReturn = mongoose.model('ECommerceReturn', ECommerceReturnSchema);

module.exports = ECommerceReturn 

