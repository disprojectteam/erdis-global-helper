const { ShippingReceiptBoxRespond } = require('../server/models/shippingReceiptBoxRespond');
const { ShippingReceipt } = require('../server/models/shippingReceipt');
const StoreReturnRespond = require('./jobs/sendData/shippingReceiptBox-storeReturn');
const ShippingReceiptRespond = require('./jobs/sendData/shippingReceiptBox-tr');
const ErrorLog = require('../server/helpers/errorLog');
const Ischeduler = require('./prototypes/scheduler');


var SReceiptBoxRespond = function (name, timePattern, DATA_LIMIT, BATCH_SIZE) {
    Ischeduler.call(this, name, timePattern, DATA_LIMIT, BATCH_SIZE);
}

SReceiptBoxRespond.prototype = Object.create(Ischeduler.prototype);
SReceiptBoxRespond.prototype.constructor = SReceiptBoxRespond;


SReceiptBoxRespond.prototype.onTick = async function () {
    try {
        const result = (await ShippingReceiptBoxRespond.aggregate([
            { "$match": { "sentToAX": false, "status": ShippingReceiptBoxRespond.Status.N } },
            { "$group": { "_id": "$documentNum", "createdAt": { "$max": "$createdAt" } } },
            { "$sort": { "createdAt": -1 } },
            { "$limit": this.DATA_LIMIT }
        ])).map(({ _id }) => _id)

        if (result.length > 0) {
            await ShippingReceiptBoxRespond.updateMany({ documentNum: { $in: result } },
                { $set: { status: ShippingReceiptBoxRespond.Status.P } });

            for (var i = 0, len = result.length; i < len; i += this.BATCH_SIZE) {
                const requests = result.slice(i, i + this.BATCH_SIZE).map(async (documentNum) => {
                    return businessLogic(documentNum)
                })
                await Promise.all(requests);
            }
        }
    }
    catch (err) {
        ErrorLog.add(err, " ", __filename)
    }
}
async function businessLogic(_documentNum) {
    try {
        var sr = await ShippingReceipt.findOne({ documentNum: _documentNum });
        if (!sr) {
            await ShippingReceiptBoxRespond.updateMany({ documentNum: _documentNum },
                { $set: { status: ShippingReceiptBoxRespond.Status.I } });
        }
        else {
            var respond = await ShippingReceiptBoxRespond.find({ documentNum: _documentNum });
            if (sr.boxHeader.length != respond.length) {
                await ShippingReceiptBoxRespond.updateMany({ documentNum: _documentNum },
                    { $set: { status: ShippingReceiptBoxRespond.Status.I } });
            }
            else {
                // İADE SENARYOSU
                if (sr.transactionType == ShippingReceipt.TransactionTypes.MD) {
                    await StoreReturnRespond.insert2AX(_documentNum)
                }
                // TR WMS DEN DEPOYA SENARYOSU
                else if (sr.transactionType == ShippingReceipt.TransactionTypes.TD) {
                    await ShippingReceiptRespond.insert2AX(_documentNum)
                }
            }
        }
    } catch (err) {
        ErrorLog.add(err, _documentNum, __filename)

    }
}

module.exports = SReceiptBoxRespond;