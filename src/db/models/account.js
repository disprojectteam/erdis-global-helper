const mongoose = require('mongoose');

const AccountTypes = Object.freeze({
    Cust: 'Customer',
    Vend: 'Vendor',
});

var AccountSchema = new mongoose.Schema({
    transType: {
        type: String,
        enum: Object.values(AccountTypes),
    },
    accountNum: {
        type: String
    },
    name: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    invoiceAccount: {
        type: String
    },
    countryRegionId: {
        type: String
    },
    inventLocation: {
        type: String
    },
    state: {
        type: String
    },
    stateName: {
        type: String
    },
    email: {
        type: String
    },
    nameAlias: {
        type: String
    },
    street: {
        type: String
    },
    customerAreaCode: {
        type: String
    },
    companyCode: {
        type: String
    },
    vatNum: {
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

AccountSchema.statics.GenerateId = function () {
    return new mongoose.Types.ObjectId();
}
Object.assign(AccountSchema.statics, {
    AccountTypes,
});


const Account = mongoose.model('Account', AccountSchema);

module.exports = Account 
