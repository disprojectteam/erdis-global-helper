// var { DataShippingOrder } = require('./../schedulers/jobs/shippingOrder');
// DataShippingOrder.getShippingOrder(5637230577,"5cdd7e745e87e4001d1cdb2e");

// var { DataStoreReturn } = require('./../schedulers/jobs/storeReturn');
// DataStoreReturn.getStoreReturn(5637376463,"5cc062443fb1e600182cc19b");

// const registry  =  require('../schedulers/registry');

// registry.startAll();


//  const ConnectionManager = require('../db/connectionManager');
// const a  =  require('../schedulers/jobs/sendData/shippingReceiptBox-storeReturn');

// (async () => {
//     await ConnectionManager.initializeConnectionString();
//     await a.insert2AX("TE1_00402662");
// })();

// (async () => {
//     const ConnectionManager = require('../db/connectionManager');
//     await ConnectionManager.initializeConnectionString();
//     const DataListener = require("../schedulers/shippingOrder-eCommerce");
//     var a = new DataListener("eCommerce", '*/2 * * * *', 1000, 100)
//     a.start();
// })();

// (async () => {
//   const EventEmitter = require('events');

//   class WithLog extends EventEmitter {
//     execute(taskFunc) {
//       console.log('Before executing');
//       this.emit('begin');
//       taskFunc();
//       this.emit('end');
//       console.log('After executing');
//     }
//   }

//   const withLog = new WithLog();

//   withLog.on('begin', () => {
//     setTimeout(function () {
//       console.log('About to execute');
//     }, 5000);

//   });
//   withLog.on('end', () => console.log('Done with execute'));

//   withLog.execute(() => console.log('*** Executing task ***'));
// })();

(async () => {
    const ConnectionManager = require('../db/connectionManager');
    await ConnectionManager.initializeConnectionString();
    const ApiQueueManager = require('./../helpers/apiQueue');

    ApiQueueManager.getWmsNames().forEach(async function(element){
        var ApiQueueModel = ApiQueueManager.getModel(element);
        var result = await ApiQueueModel.find().limit(1);
        console.log(result);
        console.log(ApiQueueModel.wmsNames.M)
    })

})();



// (async () => {
//     const ConnectionManager = require('../db/connectionManager');
//     await ConnectionManager.initializeConnectionString();
//     const { ErrorLog } = require('../models/errorLog');
//     try {
//         if(c)
//         a.doc = 5;
//     } catch (error) {
//         ErrorLog.add(error, 'test', __filename)
//     }
// })();
5