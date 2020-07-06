const mongoose = require('mongoose');


var priceSchema = new mongoose.Schema({
    itemId: {
        type: String
    },
    qualityVersionId: {
        type: String
    },
    colorId: {
        type: String
    },
    priceGroupId: {
        type: String
    },
    currency: {
        type: String
    },
    productPrice: {
        type: String
    },
    includingTax: {
        type: String
    },
    vatRate: {
        type: Number
    },
    isReady: {
        type: Boolean,
        default: false
    },
    createdTime: {
        type: Date,
        default:Date.now()
    }
});



priceSchema.statics.GenerateId = function(){
    return  new mongoose.Types.ObjectId();
}

const Price = mongoose.model('Price', priceSchema);

module.exports =  Price 