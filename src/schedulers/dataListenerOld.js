const sql = require('mssql');
const kafka = require('kafka-node');
const ErrorLog = require('../server/helpers/errorLog');
const client = new kafka.KafkaClient({ kafkaHost: process.env.Erdis_Kafka_IP });
const topic = 'AXERDISQUEUE_UA';
const producer = new kafka.Producer(client, { requireAcks: 1 });
const dataArea = "ua1";
const Ischeduler = require('./prototypes/scheduler');
const _ = require('lodash');



var DataListener = function (name, timePattern, DATA_LIMIT, BATCH_SIZE) {
    Ischeduler.call(this, name, timePattern, DATA_LIMIT, BATCH_SIZE);
}

DataListener.prototype = Object.create(Ischeduler.prototype);
DataListener.prototype.constructor = DataListener;

DataListener.prototype.onTick = async function () {
    try {
        if (process.env.NODE_ENV === "production") {
            var pool = await new sql.ConnectionPool(global.conStr_CL_UA).connect();
            const result = await pool.request()
                .input('dataAreaId', sql.NVarChar, dataArea)
                .execute('ERDIS.GetQueue')

            var allData = _(result.recordset)
                .groupBy('TABLENAME')
                .map((v, TABLENAME) => ({
                    tableName: TABLENAME,
                    recIds: _.map(v, 'REFRECID')
                }))
                .value();

            for (var i = 0, len = allData.length; i < len; i++) {
                var q = `update TransferQ set ERDISSENT = 1 from [dbo].[CISTRANSFERQUEUE] TransferQ inner join [dbo].CISINTEGTABLES integ on integ.tablenum_ = TransferQ.tablenum_  where TransferQ.ERDISSENT = 0 and TransferQ.dataAreaId = '${dataArea}' and TransferQ.refrecid IN (${allData[i].recIds.join(',')}) and integ.tablename = '${allData[i].tableName}' `
                await pool.request().query(q);
            }
            for (var j = 0; j < result.recordset.length; j += this.BATCH_SIZE) {
                const requests = result.recordset.slice(j, j + this.BATCH_SIZE).map(async (document) => {
                    return  businessLogic(document, pool);
                })
                await Promise.all(requests);
            }
            await pool.close();
        }
    }
    catch (err) {
        ErrorLog.add(err, " ", __filename)
    }
}

async function businessLogic(_document, _pool) {
    try {
        var messageToQueue = '';
        var sResult = undefined;
        switch (_document.TABLENAME) {
            case 'InventTransferTable':
                sResult = await _pool.request()
                    .input('input_parameter', sql.BigInt, _document.REFRECID)
                    .input('input_parameter2', sql.NVarChar, dataArea)
                    .query('select it.TransferId , it.CLSJournalNameId  from [dbo].[InventTransferTable] it where it.dataAreaId = @input_parameter2 and it.recid = @input_parameter');
                if (sResult.recordset[0].CLSJournalNameId == 'TE-04') {
                    messageToQueue = '{ "appId": "' + dataArea + '", "recId":"' + _document.REFRECID + '", "tableName": "InventTransferTable_W2W" }';
                }
                else {
                    messageToQueue = '{ "appId": "' + dataArea + '", "recId":"' + _document.REFRECID + '", "tableName": "InventTransferTable" }';
                }
                break;
            case 'ETGMrchMainOrderHeaderTable':
                sResult = await _pool.request()
                    .input('input_parameter', sql.BigInt, _document.REFRECID)
                    .input('input_parameter2', sql.NVarChar, dataArea)
                    .query('select et.MainOrderSource from [dbo].[ETGMrchMainOrderHeaderTable] et where et.dataAreaId = @input_parameter2 and et.recid = @input_parameter');
                if (sResult.recordset[0].MainOrderSource === 1) {
                    messageToQueue = '{ "appId": "' + dataArea + '", "recId":"' + _document.REFRECID + '", "tableName": "ETGMrchMainOrderHeaderTable_ECommerce" }';
                }
                else {
                    messageToQueue = '{ "appId": "' + dataArea + '", "recId":"' + _document.REFRECID + '", "tableName": "ETGMrchMainOrderHeaderTable" }';
                }
                break;
            default:
                messageToQueue = '{ "appId": "' + dataArea + '", "recId":"' + _document.REFRECID + '", "tableName": "' + _document.TABLENAME + '" }';
                break;
        }
        producer.send([
            { topic: topic, partition: 0, messages: [messageToQueue], attributes: 0 }
        ], async function (err) {
            try {
                if (err) {
                    await _pool.request()
                        .input('input_parameter', sql.BigInt, _document.REFRECID)
                        .input('input_parameter2', sql.NVarChar, dataArea)
                        .input('input_parameter3', sql.NVarChar, _document.TABLENAME)
                        .query('update TransferQ set ERDISSENT = 0 from [dbo].[CISTRANSFERQUEUE] TransferQ inner join [dbo].CISINTEGTABLES integ on integ.tablenum_ = TransferQ.tablenum_  where TransferQ.dataAreaId = @input_parameter2 and TransferQ.refrecid = @input_parameter and integ.tablename = @input_parameter3 and ERDISSENT = 1')
                }
            }
            catch (err) {
                ErrorLog.add(err, _document.REFRECID, __filename)
            }
        });
        //await setTimeoutPromise(0);
        // await _pool.request()
        //     .input('input_parameter', sql.BigInt, _document.REFRECID)
        //     .input('input_parameter2', sql.NVarChar, dataArea)
        //     .input('input_parameter3', sql.NVarChar, _document.TABLENAME)
        //     .query('update TransferQ set ERDISSENT = 1 from [dbo].[CISTRANSFERQUEUE] TransferQ inner join [dbo].CISINTEGTABLES integ on integ.tablenum_ = TransferQ.tablenum_  where TransferQ.dataAreaId = @input_parameter2 and TransferQ.refrecid = @input_parameter and integ.tablename = @input_parameter3')
        // await _pool.close();
    } catch (err) {
        ErrorLog.add(err, _document.REFRECID, __filename)
    }
}


module.exports = DataListener;
