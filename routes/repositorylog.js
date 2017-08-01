var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    http = require('https'), //for http service call
    https = require('https'), //For https service calls
    querystring = require('querystring'), //For Content length
    methodOverride = require('method-override')
    sytemConfigAzure = require('../model/azuretoken');


var postDataForGetToken = querystring.stringify({
    client_id: "793a6e11-2f9b-47d8-bb68-baba7602fee8",
    grant_type: "client_credentials",
    client_secret: "Unico@123",
    resource:"https://management.azure.com/"
});

var cookies = "flight-uxoptin=true; stsservicecookie=ests;x-ms-gateway-slice=productionb; stsservicecookie=ests";

//Set Token's Request option
var optionsForGetToken = {
    host: 'login.microsoftonline.com',
    method: 'POST',
    path: '/ead303c1-eb88-42b3-83f3-9a1ce4313c5e/oauth2/token',
    headers: {
        'Cookie': cookies,
        'Content-Type':'application/x-www-form-urlencoded',
        'Content-Length': postDataForGetToken.length
    }//,
    //body: JSON.stringify(postDataForGetToken)
};
//JSON Object to pass the location
var locJSONObj = JSON.stringify({
    "location":"West Central US"
});


router.use(bodyParser.urlencoded({extended: true}))
router.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body ){
        var method = req.body._method
        delete  req.body._method
        return method
    }
}))

//build the REST operation at the base for repository logs
//this will be accessible from http://localhost:3000/v1/:orgID/repository/
router.route('/:orgId/repository/:id/status/')
//GET all repoitory for a Org
    .get(function (req, res, next) {
        //retrieve all repo statuses from Mongo
        var orgId = req.param('orgId');
        var id = req.param('id');

        console.log("Org ID: "+orgId+" Repi ID: "+id);
        if("all" == orgId && "all" == id){
            mongoose.model('repositorylogs').find({}, function (err, repositorylogs) {
                if(err){
                    return console.error(err);
                } else {
                    res.format({
                        html: function () {
                            res.render('repositorylog/index',{
                                title: 'All Repository',
                                'repositorylog': repositorylogs
                            });
                        },
                        //JSON response will show all the repositorylog in JSON format
                        json: function () {
                            res.json(repositorylogs);
                        }
                    })
                }

            });
        } else {
            mongoose.model('repositorylogs').find({orgId: orgId, repositoryId:id}, function (err, repositorylogs) {
                if(err){
                    return console.error(err);
                } else {
                    res.format({
                        html: function () {
                            res.render('repositorylog/index',{
                                title: 'All Repository',
                                'repositorylog': repositorylog
                            });
                        },
                        //JSON response will show all the repositorylog in JSON format
                        json: function () {
                            res.json(repositorylogs);
                        }
                    })
                }

            });
        }

    })
    .post(function (req, res) {
        //Get values from POST request
        var orgId = req.body.orgId;
        var repositoryId = req.body.repositoryId;
        var status = req.body.status;
        var lastUpdated = req.body.lastUpdated;
        //Call the create function for operations.repositorylog
        mongoose.model('repositorylogs').create({
            orgId: orgId,
            repositoryId:repositoryId,
            status: status,
            lastUpdated:lastUpdated
        }, function (err, repositorylogs) {
            if(err){
                res.send("There is a problem in connecting Mongo DB")
            } else {
                console.log("POST creating new repo: "+repositorylogs);
                res.format({
                    json: function () {
                        res.json(repositorylogs);
                    }
                });
            }
        });
    });

//POST Service to start the server
router.route('/:orgId/repository/:id/')
    .post(function (req, res) {
        var orgId = req.param('orgId');
        var repoId = req.param('id');
        mongoose.model('repositorylogs').find({orgId: orgId, repositoryId:repoId}, function (err, repositorylogs) {
            if(err){
                return console.error(err);
            } else {
                console.log("Org ID: "+orgId+" Repository ID: "+repoId+" Status: "+repositorylogs[0].status);
                if(null != repositorylogs){
                    if("stopped" == repositorylogs[0].status){
                        console.log("Yes, cluster is stopped");
                        //Check is there is a valid token in AzureToken Collection
                        sytemConfigAzure.find({}, function (err, azuretokens) {
                            if(err) throw err;
                            console.log(azuretokens);

                        })
                    }
                }

                res.format({
                    json: function () {
                        res.json("Testing");
                    }
                });
            }

        });
    });

function getToken() {
    console.log('Entered into POST call to get the token');
    var token = '';
    //Get the PARAM values
    var req1 = https.request(optionsForGetToken, function (res1) {
        var tokenResponse = '';
        res1.on('data', function (chunk) {
            var tokenResObj = JSON.parse(chunk);
            token = 'Bearer '+tokenResObj.access_token;
            console.log("Token: "+token);
            //return token;
        });
        res1.on('error', function (err) {
            console.log(err);
        })
    });
    //Req err
    req1.on('error', function (err) {
        console.log(err);
    });

    //send request with the postDataForGetToken form
    req1.write(postDataForGetToken);
    req1.end();
    return "Guru";
}

module.exports = router;