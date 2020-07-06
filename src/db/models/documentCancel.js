const mongoose = require('mongoose');

const Status = Object.freeze({
    N: 'None',
    P: 'Processing',
    C: 'Completed',
    F: 'Failed',
    I: 'Invalid',
    E: 'Exist'
});

var documentCancelSchema = new mongoose.Schema({
    docNum: {
        type: String
    },
    docType: {
        type: String
    },
    docWay: {
        type: String
    },
    docDate: {
        type: Date
    },
    sentToAX: {
        type: Boolean,
        default: false
    },
    wmsName: {
        type: String
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.N
    },
    isReady: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    },
    sentBy:{
        type:String
    }
});


documentCancelSchema.pre('save', function (next) {
    this.createdAt = Date.now(); 
    next();
});

Object.assign(documentCancelSchema.statics, {
    Status
});

documentCancelSchema.statics.GenerateId = function(){
    return  new mongoose.Types.ObjectId();
}

const DocumentCancel = mongoose.model('DocumentCancel', documentCancelSchema);

module.exports =  DocumentCancel 
