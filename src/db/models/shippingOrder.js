const mongoose = require('mongoose');

var ShippingOrderLineSchema = new mongoose.Schema({
    barcode: {
        type: String
    },
    qty: {
        type: Number
    },
    salesPrice: {
        type: Number
    }
});
const TransactionTypes = Object.freeze({
    DM: 'Depo->Magaza',
    DB: 'Depo->Bayi',
    DD: 'Depo->Depo',
    DE: 'Depo->E-Ticaret'
});

var ShippingOrderSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: Object.values(TransactionTypes),
    },
    orderNum: {
        type: String
    },
    custAccount: {
        type: String
    },
    custName: {
        type: String
    },
    warehouse: {
        type: String
    },
    wmsName: {
        type: String
    },
    deliveryDate: {
        type: Date
    },
    isCancelled: {
        type: Boolean
    },
    isECommerce: {
        type: Boolean
    },
    eCommerceDetails: {
        webOrderNum: {
            type: String
        },
        webOrderDate: {
            type: String
        },
        cargoCompanyCode: {
            type: String
        },
        cargoTrackingNum: {
            type: String
        },
        deliveryFirstName: {
            type: String
        },
        deliverySurname: {
            type: String
        },
        identificationNumber: {
            type: String
        },
        giftNote: {
            type: String
        },
        "deliveryDetails": {
            address: {
                type: String
            },
            stateCode: {
                type: String
            },
            stateName: {
                type: String
            },
            countryCode: {
                type: String
            },
            countryName: {
                type: String
            },
            phone: {
                type: String
            }
        },
        "invoiceDetails": {
            address: {
                type: String
            },
            stateCode: {
                type: String
            },
            stateName: {
                type: String
            },
            countryCode: {
                type: String
            },
            countryName: {
                type: String
            },
            phone: {
                type: String
            }
        }
    },

    isReady: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    numberOfBarcode: {
        type: Number
    },
    totalQTY: {
        type: Number
    },
    orderLines: [ShippingOrderLineSchema]
});

Object.assign(ShippingOrderSchema.statics, {
    TransactionTypes,
});



ShippingOrderSchema.statics.GenerateId = function () {
    return new mongoose.Types.ObjectId();
}

const ShippingOrder = mongoose.model('ShippingOrder', ShippingOrderSchema);

module.exports =  ShippingOrder 
