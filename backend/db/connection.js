const mongoose = require('mongoose');
const { MongoDBURL } = require('../config')

mongoose.connect(MongoDBURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connected to the db");
    })
    .catch((error) => {
        console.log(error);
    });