const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
});

var stagingSchema = new mongoose.Schema({
    tableName: {
        type: String
    },
    recId: {
        type: String
    },
    appId: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(Status),
    },
    createdTime: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    errorCount: {
        type: Number,
        default: 0
    },
    processType: {
        type: String
    }
});


stagingSchema.pre('save', function (next) {
    this.createdTime = Date.now();
    next();
});

Object.assign(stagingSchema.statics, {
    Status
});


const Staging = mongoose.model('Staging', stagingSchema);

module.exports =  Staging 