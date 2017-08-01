var azureConfig = require('../model/azureConfiguration');
var exec = require('child_process').exec;

var child;
var child1;
var child2;

//Constants
var clientSecret = "Unico@123";
var subscriptionId = "13de109b-35af-4c37-9d7d-5e4224e0bd60";
var region = "South Central US";
var appName = "elastic-etl-app1";
var resourceURL = "https://management.azure.com/";
var tokenURL = "https://login.microsoftonline.com/ead303c1-eb88-42b3-83f3-9a1ce4313c5e/oauth2/token";

//Function to insert a Azure Configuration
var azureConfig = new azureConfig({
    subscriptionID: subscriptionId,
    region: region,
    appOrClientID: "793a6e11-2f9b-47d8-bb68-baba7602fee8",
    appName: appName,
    clientSecret: clientSecret,
    objectID: "4d8369ff-28b8-4afe-9c91-681520d487d0",
    resourceURL: resourceURL,
    tokenURL: tokenURL
});

//save AzureConfig Model
azureConfig.save(function (err){
    if(err){
        return err;
    } else {
        console.log("Azure Config Saved Successfully!");
        process.exit(0);
    }
});