var kafka = require('kafka-node');
var client = new kafka.KafkaClient({kafkaHost: "10.0.8.223:9092" });

var topicsToCreate = [{
    topic: 'MIDDLEWARE_ACCOUNT',
    partitions: 1,
    replicationFactor: 1,
}
// ,{
//     topic: 'WMS_RO_ABARCODE',
//     partitions: 1,
//     replicationFactor: 1,
// }
];

client.createTopics(topicsToCreate, (error, result) => {
    // result is an array of any errors if a given topic could not be created
    console.log(result || error);
});