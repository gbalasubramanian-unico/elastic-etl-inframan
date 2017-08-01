var mongoose = require('mongoose');
var azureConfig = require('../model/azureConfiguration');
var exec = require('child_process').exec;

var child;
var child1;
var child2;
var appOrClientId;
var objectId;

//Constants
var clientSecret = "Unico@123";
var subscriptionId = "13de109b-35af-4c37-9d7d-5e4224e0bd60";
var region = "South Central US";
var appName = "elastic-etl-app1";
var resourceURL = "https://management.azure.com/";
var tokenURL = "https://login.microsoftonline.com/ead303c1-eb88-42b3-83f3-9a1ce4313c5e/oauth2/token";

var myCallback = function(data) {
    console.log('App/Client Id is: '+data);
    if(null != data && 0 < data.length){
        createObject(data);
    }
};

//Function to Call app/client creation
var usingItNow = function(callBack){
    child = exec("az ad app create --display-name '"+appName+"' --homepage 'https://www."+appName+".com' --identifier-uris 'https://www."+appName+".com/example' --password "+clientSecret+" --query 'appId'", function (error, stdout, stderr){
        console.log('Calling command to Create an App');
        appOrClientId = stdout.replace(/\n$/, '').replace(/"/g, "");
        callBack(appOrClientId);
        if(error != null){
            console.log('Exec error: ' +error);
            process.exit(1);
        }
    });
};

//Function to call Object Creation
function createObject(appOrClientId){
    console.log("Inside Create Object ID function!");
    console.log("Application ID: "+appOrClientId);
    child1 = exec("az ad sp create --id "+appOrClientId+" --query 'objectId'", function (error, stdout, stderr){
        console.log('Calling command to Create an Object');
        objectId = stdout.replace(/\n$/, '').replace(/"/g, "");
        console.log("Object ID: "+objectId);
        if(null != objectId && 0 < objectId.length){
            assignRole(objectId, appOrClientId)
        }
        if(error != null){
            console.log('Exec error: ' +error);
        }
    });
}

//Function to call role assignment based on Subscription and Object ID's
function assignRole(objectId, appOrClientId){
    console.log("Inside Assign role function");
    console.log("Subscription ID: "+subscriptionId+" Object ID: "+objectId);
    if(null != objectId && 0<objectId.length && null != appOrClientId && 0<appOrClientId.length){
        //Insert Azure config in Mongo
        insertAzureConfig(objectId, appOrClientId);
        //Call Role assignment command
        child2 = exec("az role assignment create --assignee "+objectId+" --role Owner --scope /subscriptions/"+subscriptionId+"/", 		function (error, stdout, stderr){
            console.log('Calling command to Assign a role for an Object');
            console.log("Role Assignment Response: "+stdout.replace(/\n$/, '').replace(/"/g, ""));
            if(error != null){
                console.log('Exec error: ' +error);
            }
        });
    }

}

//Function to insert a Azure Configuration
function insertAzureConfig(objectId, appOrClientId){
    var azureConfig = new azureConfig({
        subscriptionID: subscriptionId,
        region: region,
        appOrClientID: appOrClientId,
        appName: appName,
        clientSecret: clientSecret,
        objectID: objectId,
        resourceURL: resourceURL,
        tokenURL: tokenURL
    });

    //save AzureConfig Model
    azureConfig.save(function (err){
        if(err){
            return err;
        } else {
            console.log("Azure Config Saved Successfully!");
            return "Azure Config Saved Successfully!";
        }
    });
}

usingItNow(myCallback);