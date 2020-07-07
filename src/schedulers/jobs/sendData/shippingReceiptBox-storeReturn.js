const sql = require('mssql');
const { ShippingReceiptBoxRespond } = require('../../../server/models/shippingReceiptBoxRespond');
const ErrorLog = require('../../../server/helpers/errorLog');
const _ = require('lodash');
const request = require('request-promise');



async function getBarcodes(_dataValues) {
    const options = {
        timeout: 600000,
        //url: `http://${process.env.Erdis_Middleware_URL}/api/barcode/byBarcodes`,
        url: `http://erdis.eroglu.com:3001/api/barcode/byBarcodes`,
        json: true,
        resolveWithFullResponse: true,
        method: 'Post',
        body: _dataValues,
        gzip: true,
    };
    try {
        const response = await request(options);
        return Promise.resolve(_.map(response.body.result, x=> _.pick(x, ["barcode", "assormentBarcodeLines"])));
    }
    catch (error) {
        Promise.reject(error);
    }
}

async function extractAssortment(_documentNum) {
    try {
        const sp = await ShippingReceiptBoxRespond.find({ "documentNum": _documentNum });
        var allBarcodes = [];
        for (var j = 0, len1 = sp.length; j < len1; j++) {
            for (var i = 0, len = sp[j].boxHeader.length; i < len; i++) {
                allBarcodes = _.concat(allBarcodes, _.map(sp[j].boxHeader[i].boxDetails, x=> _.pick(x, ['barcode', 'qty'])));
            }
        }
        var aBarcodes = _.filter(allBarcodes, function (d) { return d.barcode.startsWith('A'); })
        if (aBarcodes.length > 0) {
            aBarcodes = _.uniq(aBarcodes);
            var aBarcodesDetails = await getBarcodes(aBarcodes.map(function (data) { return data.barcode; }));
            for (var k = 0; k < aBarcodes.length; k++) {
                let a = _.filter(aBarcodesDetails, function (d) { return d.barcode == aBarcodes[k].barcode; })
                let b = _.map(a[0].assormentBarcodeLines, x=> _.pick(x, ['barcode', 'qty']));
                allBarcodes = _.concat(allBarcodes,
                    _.map(b, function (data) {
                        data.qty = data.qty * aBarcodes[k].qty
                        return data
                            ;
                    }));
            }
            allBarcodes = _.filter(allBarcodes, function (d) { return !d.barcode.startsWith('A'); })
        }
        allBarcodes = _(allBarcodes)
            .groupBy('barcode')
            .map((objs, key) => ({
                'barcode': key,
                'qty': _.sumBy(objs, 'qty')
            }))
            .value()
        return allBarcodes;

    } catch (err) {
        (async () => {
            await ShippingReceiptBoxRespond.updateMany({ "documentNum": _documentNum }, { status: ShippingReceiptBoxRespond.Status.I });
            ErrorLog.add(err, _documentNum, __filename)
        })();
    }


}
module.exports = {
    insert2AX: async function (_documentNum) {
        try {
            const sp = await ShippingReceiptBoxRespond.findOne({ "documentNum": _documentNum });
            var allBarcodes = await extractAssortment(_documentNum);
            const pool = await new sql.ConnectionPool(global.conStr_CL_UA).connect();
            var result = await pool.request()
                .input('tableName', sql.VarChar, 'ErdisWMSReceivingLine')
                .input('requiredCountOfRecId', sql.Int, allBarcodes.length)
                .execute('ERDIS.getRecId')
            if (result.recordset.length > 0) {
                const recId = result.recordset[0].recId;

                //-------------------------------->Lines
                var table = new sql.Table('dbo.ErdisWMSReceivingLine');
                table.columns.add('DocumentNum', sql.VarChar(50), { nullable: false });
                table.columns.add('Barcode', sql.VarChar(50), { nullable: false });
                table.columns.add('Qty', sql.Int, { nullable: false });
                table.columns.add('DataAreaId', sql.VarChar(8), { nullable: false });
                table.columns.add('recId', sql.BigInt, { nullable: false });
                table.columns.add('CREATEDBY', sql.VarChar(50), { nullable: false });
                for (var i = 0, len = allBarcodes.length; i < len; i++) {
                    table.rows.add(sp.documentNum, allBarcodes[i].barcode, allBarcodes[i].qty, 'ua1', (Number(recId) + i), 'erdis');
                }
                await pool.request().bulk(table);
                //<---------------------------------Lines
            }
            result = await pool.request()
                .input('tableName', sql.VarChar, 'ErdisWMSReceivingTable')
                .input('requiredCountOfRecId', sql.Int, 1)
                .execute('ERDIS.getRecId')
            if (result.recordset.length > 0) {
                const recId = result.recordset[0].recId;
                table = new sql.Table('dbo.ErdisWMSReceivingTable');
                table.columns.add('DOCUMENTNUM', sql.VarChar(50), { nullable: false });
                table.columns.add('DATE', sql.DateTime, { nullable: false });
                table.columns.add('WMSCOMPANY', sql.VarChar(50), { nullable: false });
                table.columns.add('DOCTYPE', sql.Int, { nullable: false });
                table.columns.add('PROCESSTYPE', sql.Int, { nullable: false });
                table.columns.add('DATAAREAID', sql.VarChar(8), { nullable: false });
                table.columns.add('RECID', sql.BigInt, { nullable: false });
                table.columns.add('CREATEDBY', sql.VarChar(50), { nullable: false });
                table.rows.add(sp.documentNum, sp.date, 'Zammler', 1, 0, 'ua1', (Number(recId) + i), 'erdis');
                await pool.request().bulk(table);
            }
            await ShippingReceiptBoxRespond.updateMany({ "documentNum": _documentNum }, { status: ShippingReceiptBoxRespond.Status.C, sentToAX: true });

        }
        catch (err) {
            (async () => {
                await ShippingReceiptBoxRespond.updateMany({ "documentNum": _documentNum }, { status: ShippingReceiptBoxRespond.Status.I });
                ErrorLog.add(err, _documentNum, __filename)
            })();
        }
    }
}


