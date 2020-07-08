'use strict';

var kafka = require('kafka-node');
var topic = 'ERRORLOG';


// var topic = 'MIDDLEWAREQUEUE';
var client = new kafka.KafkaClient({ kafkaHost:"10.0.8.223:9092" });
var topics = [{ topic: topic, partition: 0}];
var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024};

var consumer = new kafka.Consumer(client, topics, options);

try{
    consumer.on('message', function (message) {
        console.log(message);
        /*
        consumer.close(true, function (err) {            
           // resolve(xyz);              
        });
        */
    });

}
catch(error){
    consumer.close(true, function (error) {
        if (error) {
            console.log("Consuming closed with error", error);
        } else {
            console.log("Consuming closed");
        }
    });
}


    // /* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset*/
    // consumer.on('offsetOutOfRange', function (topic) {
    //     topic.maxNum = 3;
    //     offset.fetch([topic], function (err, offsets) {
    //         if (err) {
    //             return console.error(err);
    //         }
    //         var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    //         consumer.setOffset(topic.topic, topic.partition, min);
    //     });
    // });