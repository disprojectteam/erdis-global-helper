var kafka = require('kafka-node');
const client = new kafka.KafkaClient({ kafkaHost: "10.0.8.223:9092" });
const topic = 'ERRORLOG';
const producer = new kafka.Producer(client, { requireAcks: 1 });
var p =  0;
var a =  0;

producer.on('ready', function () {
    
    
    // var message = '{"tableName":"axsAssortmentGroupBarcode","appId":"cl1","recId":"5637477007","processType":"I"}';
    //var message = '{"tableName":"InventItemBarcode","appId":"cl1","recId":"5644256785","processType":"I"}';
    var message = '{"tableName":"CustInvoiceJour","appId":"cl1","recId":"5648390707","processType":"I"}';
    //var keyedMessage = new KeyedMessage('ahmet', 'taygun');

    producer.send([
        { topic: topic, partition: p, messages: [message], attributes: a }
    ], function (err, result) {
        console.log(err);
        console.log(result);
    });

});

producer.on('error', function (err) {
    console.log('error', err);
});
