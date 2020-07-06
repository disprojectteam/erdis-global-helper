const sql = require('mssql');
const ShippingReceipt = require('../models/shippingReceipt');
const ApiQueue = require('../models/apiQueue');
var moment = require('moment');



async function getStoreReturn(_recId) {
    try {
        const pool = await new sql.ConnectionPool(global.conStr_CL_MA).connect();
        const result = await pool.request()
            //.input('dataAreaId', sql.NVarChar, 'ma1')
            .input('recId', sql.BigInt, _recId)
            .execute('ERDIS.getStoreReturnNonReturn')
        pool.close();
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            const dispatchHeader = result.recordset[i];
            const existShipping = await ShippingReceipt.findOne({ documentNum: dispatchHeader.documentNum });
            if (existShipping) {
                var existId = existShipping.id;
                await ShippingReceipt.findByIdAndDelete(existShipping.id);
            }


            const sp = new ShippingReceipt({
                _id: existId,
                transactionType: ShippingReceipt.TransactionTypes.MD,
                //documentType: '',
                //documentStatus: dispatchHeader.documentStatus,
                documentNum: dispatchHeader.documentNum,
                documentDate: moment(dispatchHeader.documentDate).format('DD-MM-YYYY'),
                locationFromAccount: dispatchHeader.locationFromAccount,
                //locationToAccount: dispatchHeader.locationToAccount,
                documentPrinted: dispatchHeader.documentPrinted,
                totalQTY: dispatchHeader.totalQTY,
                numberOfBox: dispatchHeader.numberOfBox,
                numberOfBarcode: dispatchHeader.numberOfBarcode,
                warehouse: dispatchHeader.warehouse,
                recId: _recId
            });
            await sp.save();
            getBoxHeader(sp.documentNum);
        }
    }
    catch (err) {
        console.log(err);
    }
}


async function getBoxHeader(_documentNum) {
    try {
        const pool = await new sql.ConnectionPool(global.conStr_CL_MA).connect();
        const result = await pool.request()
            .input('dataAreaId', sql.NVarChar, 'ma1')
            .input('transferId', sql.NVarChar, _documentNum)
            .execute('ERDIS.getStoreReturn_BoxHeader');
        pool.close();
        const vShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
        for (var i = 0, len = result.recordset.length; i < len; i++) {
            var boxHeader = result.recordset[i];
            await vShippingReceipt.boxHeader.push({
                boxBarcode: boxHeader.boxBarcode,
                totalQty: boxHeader.totalQty,
                // volume: boxHeader.volume,
                // volumetricWeight: boxHeader.volumetricWeight,
                // weight: boxHeader.weight,
                numberOfBarcode: boxHeader.numberOfBarcode
            });
        }
        await vShippingReceipt.save();
        getBoxDetails(_documentNum);
    }
    catch (err) {
        console.log(err);
    }
}


async function getBoxDetails(_documentNum) {
    try {
        const pool = await new sql.ConnectionPool(global.conStr_CL_MA).connect();
        const result = await pool.request()
            .input('dataAreaId', sql.NVarChar, 'ma1')
            .input('transferId', sql.NVarChar, _documentNum)
            .execute('ERDIS.getStoreReturn_BoxDetail')
        pool.close();
        var _ShippingReceipt = await ShippingReceipt.findOne({ documentNum: _documentNum });
        for (var i = 0, len1 = result.recordset.length; i < len1; i++) {
            var boxDetail = result.recordset[i];
            await _ShippingReceipt.boxHeader[_ShippingReceipt.boxHeader.findIndex(a => a.boxBarcode === boxDetail.boxBarcode)].boxDetails.push({ barcode: boxDetail.barcode, qty: boxDetail.qty });
        }
        await _ShippingReceipt.save();
        const agg = await ShippingReceipt.CalcTotalBarcode(_documentNum)
        if ((_ShippingReceipt.numberOfBox + _ShippingReceipt.numberOfBarcode == _ShippingReceipt.boxHeader.length + agg)) {
            const sp = await ShippingReceipt.findOneAndUpdate({ documentNum: _documentNum }, { isReady: true }, { new: true });
            const apiQ = await ApiQueue.findOne({ documentName: "ShippingReceipt", refObjectId: sp._id, isSent: false });
            if (sp && !apiQ) {
                await new ApiQueue({
                    documentName: "ShippingReceipt",
                    keyValue: sp.documentNum,
                    isSent: false,
                    refObjectId: sp._id
                }).save()
            }
        }
    } catch (err) {
        console.log(err);
    }
}



getStoreReturn('5637389077');