const mongoose = require('mongoose');


var dbConfigSchema = new mongoose.Schema({ 
    configName: {
        type: String
    },
    description: {
        type: String
    },
    server: {
        type: String
    },
    user: {
        type: String
    },
    password: {
        type: String
    },
    database: {
        type: String
    }
    
});


dbConfigSchema.index({ configName: 1}, { unique: true });

var DbConfig = mongoose.model('dbConfig', dbConfigSchema);

module.exports = DbConfig 