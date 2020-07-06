const mongoose = require('mongoose');

const TransactionTypes = Object.freeze({
    DM: 'Depo->Magaza',
    MD: 'Magaza->Depo',
    DE: 'Depo->E-ticaret',
    ED: 'E-ticaret->Depo',
    DD: 'Depo->Depo',
    TD: 'TR-Depo->Depo',
    BD: 'Bayi->Depo'

});

var boxDetailSchema = new mongoose.Schema({

    barcode: {
        type: String
    },
    qty: {
        type: Number
    },
    isAssorment: {
        type: Boolean
    },
    assormentBarcode: {
        type: String
    }
});

var boxHeaderSchema = new mongoose.Schema({
    boxBarcode: {
        type: String
    },
    dispatchNum: {
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
    //Toplam Barkod Sayisi
    numberOfBarcode: {
        type: Number
    },
    boxDetails: [boxDetailSchema]
});


var ShippingReceiptSchema = new mongoose.Schema({
    transactionType: {
        type: String,
        enum: Object.values(TransactionTypes),
    },
    documentType: {
        type: String
    },
    documentStatus: {
        type: Boolean,
        default: true
    },
    documentNum: {
        type: String,
        unique: true,
        required: true
    },
    documentDate: {
        type: String
    },
    warehouse: {
        type: String
    },
    locationFromAccount: {
        type: String
    },
    documentPrinted : {
        type: String
    },
    refOrderNum : {
        type: String
    },
    wmsName: {
        type: String
    },
    //Toplam urun Adedi
    totalQTY: {
        type: Number
    },
    //Toplam Koli Sayisi
    numberOfBox: {
        type: Number
    },
    //Toplam Barkod Sayisi
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
    recId: {
        type: String
    },

    boxHeader: [boxHeaderSchema],
    //eCommerces: [eCommerceSchema]
});

Object.assign(ShippingReceiptSchema.statics, {
    TransactionTypes,
});

ShippingReceiptSchema.statics.GenerateId = function(){
    return  new mongoose.Types.ObjectId();
}


ShippingReceiptSchema.statics.CalcTotalBarcode = async function(_documentNum){
    const agg = await this.aggregate([
        { $match: { "documentNum": _documentNum } },
        {
            "$project": {
                "count": {
                    "$reduce": {
                        "input": "$boxHeader",
                        "initialValue": 0,
                        "in": { "$add": ["$$value", { "$size": "$$this.boxDetails" }] }
                    }
                }
            }
        }
    ]);
    return agg[0].count;
}

//ShippingReceiptSchema.plugin(mongoosePaginate);
const ShippingReceipt = mongoose.model('ShippingReceipt', ShippingReceiptSchema);

module.exports =  ShippingReceipt 

