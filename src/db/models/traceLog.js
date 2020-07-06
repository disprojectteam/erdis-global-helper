const mongoose = require('mongoose');
const { conn } = require('../db/mongoose-erdis-log');

var TraceLogSchema = new mongoose.Schema({
    isSolved: {
        type: Boolean,
        default: false
    },
    errorName: {
        type: String
    },
    errorCode: {
        type: String
    },
    errorMessage: {
        type: String
    },
    keyValue: {
        type: String
    },
    createdAt: {
        type: Date
    },
    errorAt: {
        type: Date
    },
    errorStack: {
        type: String
    },
    className: {
        type: String
    },
    methodName: {
        type: String
    },
    serviceName: {
        type: String
    }
});
TraceLogSchema.pre('save', function (next) {
    var traceLog = this;
    traceLog.createdAt = Date.now();
    next();
});


TraceLogSchema.statics.insert = async function (_message) {
    try {
        await new TraceLog({
            errorName: _message.errorName,
            errorCode: _message.errorCode,
            errorMessage: _message.errorMessage,
            keyValue: _message.keyValue,
            errorStack: _message.errorStack,
            className: _message.className,
            methodName: _message.methodName,
            serviceName: _message.serviceName,
            errorAt: _message.createdAt
        }).save();
    }
    catch (err) {
        console.log(err)
    }
};


var TraceLog = conn.model('TraceLog', TraceLogSchema);


module.exports = { TraceLog }
