const { TableParameter } = require('../server/models/tableParameter');
const { KafkaTopic } = require('../server/models/kafkaTopic');
//const { DbConfig } = require('../server/models/dbConfig');
const  sqlConfig = require('./../server/db/mssql/connections');
const sql = require('mssql');



createParameters();
//createTopics();
//createConfig();

async function createParameters(){

const conf = await sqlConfig.config_Colins_UA(250000);
const pool = await new sql.ConnectionPool(conf).connect();
            const result = await pool.request()
            .query('select * from dbo.clsIntegrationTable where isErdis = 1')
            pool.close();
            for (var i = 0, len = result.recordset.length; i < len; i++) {
                console.log(result.recordset[i].TABLENAME);
               /* var toAppId = 'RO';
                var data = result.recordset[i];
                await new TableParameter({
                    tableName: data.TABLENAME,
                    topicName: (data.TABLENAME=='CustInvoiceJour' ? 'SHIPPINGRECEIPT_'+toAppId : 'MIDDLEWAREQUEUE'),
                    appId: data.DATAAREAID,
                    destination: data.TABLENAME=='CustInvoiceJour' ? toAppId : 'Middleware',
                    isMasterData: (data.TABLENAME=='CustInvoiceJour' ? false : true),
                    filterTxt: ''
                }).save();*/

            }

    };

    async function createTopics(){
        await new KafkaTopic({
            appId: 'cl1',
            topicName: 'TRACELOG',
            description: 'Gateway Requestleri Runtime Hataları Kuyruğu',
            module: '',
            partition: 0
        }).save();


    }


    async function createConfig(){
        var x = '{ server: "SERVERTR146",user: "erdis", password: "erdis123", database: '+"'AX2012R3CU10PROD'"+', connectionString: "Driver={SQL Server Native Client 11.0};Server=#{server}\\sql;Database=#{database};Uid=#{user};Pwd=#{password}", PoolTimeout: 1999999, connectionTimeout: 18090000, requestTimeout: 29999999, options: { trustedConnection: true, encrypt: false }, pool: { max: 1, min: 0, idleTimeoutMillis: 30000 } }'
    
        c = await new DbConfig({
            configName: 'Colins_RO',
            description: 'Colins Romanya Ax2009 Prod Db',
            server: "192.168.0.13",
            user: "ax",
            password: "465666",
            database: 'CL_Other_Retail_Live'
           
        });
        c.save();
        console.log(c.description);
        console.log('             ');
      //  console.log(JSON.stringify(c.configDetails));
    }


