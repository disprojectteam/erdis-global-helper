var kafka = require('kafka-node');


const client = new kafka.KafkaClient({ kafkaHost: '10.0.8.223:9092' });
const admin = new kafka.Admin(client); // client must be KafkaClient


var topics = [
    {
        topic: 'test',
        partitions: 1,
        replicationFactor: 1
    } 
    // {
    //     topic: 'SHIPPINGRECEIPT_UA',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'SHIPPINGRECEIPT_MA',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_EMPLOYEE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_PRICE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'CARGO_TR_CEVA',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'MIDDLEWAREQUEUE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'WMS_RO_BARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'WMS_UA_ABARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_LOOKUPCHANGE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERRORLOG',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'WMS_MA_BARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'WMS_RO_ABARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_EMP',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'CROSSDOCK',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_BARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'ERPOS_PRODUCT',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'SHIPPINGRECEIPT_RO',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'EVENTLOG',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'AXERDISQUEUE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'AXERDISQUEUE_MA',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'AXERDISQUEUE_POS',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'WMS_UA_BARCODE',
    //     partitions: 1,
    //     replicationFactor: 1
    // }, 
    // {
    //     topic: 'TRACELOG',
    //     partitions: 1,
    //     replicationFactor: 1}
     ];

admin.createTopics(topics, (err, res) => {
    // result is an array of any errors if a given topic could not be created
    console.log(res || err)
})

// admin.listTopics((err, res) => {
//     console.log('topics', res);
// });