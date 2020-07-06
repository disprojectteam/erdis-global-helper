const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var ApiQueueSchema = new mongoose.Schema({

    documentName: {
        type: String
    },
    keyValue: {
        type: String
    },
    isSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    },
    sentAt: {
        type: Date
    },
    sentBy: {
        type: String
    },
    refObjectId: {
        type: ObjectId
    }

});
ApiQueueSchema.pre('save', function (next) {
    var apiQueue = this;
    apiQueue.createdAt = Date.now(); // moment(Date.now()).format('DD-MM-YYYY');
    next();
});


ApiQueueSchema.index({ documentName: 1, refObjectId: 1 }, { unique: true });

const ApiQueue = mongoose.model('ApiQueue', ApiQueueSchema);

module.exports = ApiQueue