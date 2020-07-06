const mongoose = require('mongoose');
const {conn} = require('../db/mongoose-erdis-log');

var ErrorLogSchema = new mongoose.Schema({

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
    },
    isSolved: {
        type: Boolean,
        default: false
    }





});
ErrorLogSchema.pre('save', function (next) {
    var errorLog = this;
    errorLog.createdAt = Date.now();
    next();
});


ErrorLogSchema.statics.insert =async function (_message) {
    try {
        await new ErrorLog({
            errorName: _message.errorName,
            errorCode: _message.errorCode,
            errorMessage: _message.errorMessage,
            keyValue: JSON.stringify(_message.keyValue),
            errorStack: _message.errorStack,
            className:  _message.className,
            methodName: _message.methodName,
            serviceName: _message.serviceName,
            errorAt : _message.createdAt
        }).save();
    }
    catch (err) {
        console.log(err)
    }
};


var ErrorLog = conn.model('ErrorLog', ErrorLogSchema);


module.exports = { ErrorLog }
