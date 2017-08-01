var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/systemconfiguration')
var azuretoken = new mongoose.Schema({
    azureConfigurationID: String,
    accessToken: String,
    expiryDateTime: Date
});

var AzureToken = mongoose.model('AzureToken', azuretoken);
module.exports = AzureToken;