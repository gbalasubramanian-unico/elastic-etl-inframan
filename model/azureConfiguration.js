var mongoose = require('mongoose');

//Connect to the database
var db = mongoose.connect('mongodb://localhost:27017/systemconfiguration');

var azureConfiguration = new mongoose.Schema({
    subscriptionID: String,
    region: String,
    appOrClientID: String,
    appName: String,
    clientSecret: String,
    objectID: String,
    resourceURL: String,
    tokenURL: String
});

//Compile schema to model
module.exports = db.model('azureConfigurations', azureConfiguration)