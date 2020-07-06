const mongoose = require('mongoose');

var ContractSchema = new mongoose.Schema({
    accountNum: {
        type: String
    },
    vendorCommercialTitle: {
        type: String
    },
    vendorDetails: {
        type: String
    },
    contractNumber: {
        type: String
    },
    contractDate: {
        type: String
    },
    isReady: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    }
});



ContractSchema.statics.GenerateId = function(){
    return  new mongoose.Types.ObjectId();
}

const Contract = mongoose.model('Contract', ContractSchema);

module.exports = Contract 
