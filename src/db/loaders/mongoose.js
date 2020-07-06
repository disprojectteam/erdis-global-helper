const mongoose = require('mongoose')

mongoose.connect(`mongodb://${process.env.Mongo_User}@${process.env.Mongo_Ip}/${process.env.Mongo_Db}?authSource=admin`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

