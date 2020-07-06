const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
});

var stockLineSchema = new mongoose.Schema({
    
    oldBarcode: {
        type: String
    },
    newBarcode: {
        type: String
    },
    qty: {
        type: Number
    }
});

var stockAdjustmentSchema = new mongoose.Schema({
    documentId : {
        type: String
    },
    warehouse: {
        type: String
    },
    wmsName: {
        type: String
    },
    numberOfBarcode: {
        type: Number
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    isReady: {
        type: Boolean,
        default: false
    },

    lines : [stockLineSchema]
});


Object.assign(stockAdjustmentSchema.statics, {
    Status
});


const StockAdjustment = mongoose.model('StockAdjustment', stockAdjustmentSchema);

module.exports = StockAdjustment 

