const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-log');
const {Country}=require('../models/countries');

var EventLogSchema = new mongoose.Schema({
    remoteAddress:{
        type: String
    },
    remoteUser:{
        type:String
    },
    method:{
        type:String
    },
    url:{
        type:String
    },
    status:{
        type:String
    },
    responseSize:{
        type:String
    },
    responseTime:{
        type:String
    },
    token:{
        type:String
    },
    createdAt: {
        type: Date
    },
    eventAt:{
        type:Date
    },
    country:{
        type:String
    },
    appId:{
        type: String
    }
});
EventLogSchema.pre('save', function (next) {
    var eventLog = this;
    eventLog.createdAt = Date.now();
    next();
});


EventLogSchema.statics.insert =async function (_message) {
    var country=await Country.getCountry(_message['remote-addr'])
    try {
        await new EventLog({
            remoteAddress: _message['remote-addr'],
            remoteUser: _message['remote-user'],
            method: _message.method,
            url: _message.url,
            status: _message.status,
            responseSize:  _message.res,
            responseTime: _message['response-time'],
            token: _message.req,
            eventAt : _message.createdAt,
            country:country.countryName,
            appId:_message.url.split('/')[2].toLowerCase()
        }).save();
    }
    catch (err) {
        console.log(err)
    }
};


var EventLog = conn.model('EventLog', EventLogSchema);


module.exports = { EventLog }
