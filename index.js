//"use strict";
//global __dirname */
/*golbal assert*/

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var DataStore = require('nedb');

var publicFolder = path.join(__dirname, 'public');

//Módulo con api José
var moduleSMI = require("./public/APIS/apiJose.js");

//Módulo con api Andrés
var moduleGDP = require("./public/APIS/apiAndres.js");


////////////////////////////////////////CONEXIÓN CON BASE DE DATOS////////////////////////////////////////////////////////////

//Conexión con base de datos mongoDB
var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://admin:admin@ds139360.mlab.com:39360/sos1617-02";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

//Base de datos mongoDB José
var dbJose;
//Base de datos mongoDB ANDRÉS
var dbAndres;
//Base de datos mongoDB ANTONY
var dbAntony;

MongoClient.connect(mdbURL, {native_parser:true}, function (err, database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB"+err);
        process.exit(1);
    }

        dbJose = database.collection("smi-stats");
       dbAndres = database.collection("gdp-population-stats");
       dbAntony = database.collection("rpc-stats");
       
       ///////////////////CONEXIÓN CON MÓDULO JOSÉ////////////////////////////
       moduleSMI.register(app, dbJose, BASE_API_PATH);
       ///////////////////CONEXIÓN CON MÓDULO ANDRES////////////////////////////
       moduleGDP.register(app, dbAndres, BASE_API_PATH);
   
   //Solo pongo el servidor a arrancar si la base de datos está arrancada
   app.listen(port, () =>{
    console.log("Magic is happening on port " + port);
    });
});


var app = express();


//BODYPARSER usa por defecto la codificación de JSON
app.use(bodyParser.json()); //use default json enconding/decoding

//HELMET aporta seguridad a nuestro servidor
app.use(helmet()); //improve security

//REDIRECCIONAMIENTO INICIAL A PÁGINA PRINCIPAL DE LA API
//app.use("/", express.static(path.join(__dirname, BASE_API_PATH + "/")));


////////////////////////////////////////////////CÓDIGO URL BASE////////////////////////////////////////////////////////////

app.get("/", function(request, response){
    response.sendfile(publicFolder + "/index.html");
});

/*

//MÉTODOS GET
app.get(BASE_API_PATH_JOSE + "/loadInitialData", apiJose.getInitialData);
app.get(BASE_API_PATH_JOSE, apiJose.getStats);
app.get(BASE_API_PATH_JOSE + "/:year", apiJose.getStatsCountry);
app.get(BASE_API_PATH_JOSE + "/:year", apiJose.getStatsCountryYear);

//MÉTODOS POST
app.post(BASE_API_PATH_JOSE, apiJose.postNewStats);
app.post(BASE_API_PATH_JOSE +"/:country", apiJose.postNewCountryBAD);

//MÉTODOS PUT
app.post(BASE_API_PATH_JOSE, apiJose.putStatsBAD);
app.post(BASE_API_PATH_JOSE +"/:country", apiJose.uploadCountryStats);

//MÉTODOS DELETE
app.delete(BASE_API_PATH_JOSE, apiJose.deleteStats);
app.delete(BASE_API_PATH_JOSE + "/:country", apiJose.deleteCountryStats);
*/




////////////////////////////////////////////////CODIGO API ANTONY////////////////////////////////////////////////////////////

//Initializing with some data
app.get(BASE_API_PATH + "/rpc-stats/loadInitialData", function (request, response){
    
    var alemania = new Object();
    alemania.country = "Alemania";
    alemania.year = 2017;
    alemania.rpcyear = "56.238";
    alemania.rpcvariation = "1.6%";
    
    var francia = new Object();
    francia.country = "Francia";
    francia.year = 2014;
    francia.rpcyear = "50.887.30";
    francia.rpcvariation = "1.2%";
    
    console.log("INFO: Initializing data.");
    
    dbAntony.find({}).toArray(function(err, countries){
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    if(countries.length > 0){
                        console.log("INFO: Already Data.");
                        response.sendStatus(409);
                    }else{
                     dbAntony.insert(alemania);
                     dbAntony.insert(francia);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
            
});

//GET every row of data
app.get(BASE_API_PATH + "/rpc-stats", function (request, response) {
    console.log("INFO: New GET/ received");
    dbAntony.find({}).toArray(function (err, data) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending out every row of data");
            response.send(data);
        }
    });
});


//GET a single row
app.get(BASE_API_PATH + "/rpc-stats/:country", function (request, response) {
    var country = request.params.country;
    
    if (!country) {
        console.log("WARNING: New GET request to /rpc-stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    }else {
            console.log("INFO: New GET request to /rpc-stats/" + country);
        
            dbAntony.findOne({ country: country }, function(err,data){
                    if(err){
                        response.sendStatus(404);
                    }else{
                        response.send(data);
                    }
                });
        }
        
    });

//POST over a collection
app.post(BASE_API_PATH + "/rpc-stats", function (request, response) {
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /gdp-population-stats/ without Country to create, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!newCountry.country || !newCountry.year || !newCountry["rpc-year"] || !newCountry["rpc-variation"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbAntony.find({country: newCountry.country}, function (err, countriesBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if (countriesBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newCountry, 2, null));
                        dbAntony.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//post to one country--> method not allowed!!
app.post(BASE_API_PATH + "/rpc-stats/:country", function (request, response){
    response.sendStatus(405);//method not allowed
});

//PUT to the entire api (update all the elements)
app.put(BASE_API_PATH + "/rpc-stats", function (request, response){
   response.sendStatus(405);//Method not allowed!! 
});

//update a single element
app.put(BASE_API_PATH + "/rpc-stats/:country", function (request, response){
    var updatedCountry = request.body;
    var country = request.params.country;
    
    if (!updatedCountry) {
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["gdp-year"] || !updatedCountry["population-year"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }else{
            dbAntony.find({country: country}, function (err, countries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if(countries.length === 0){
                        console.log("WARNING: There is not any country with name " + country);
                        response.sendStatus(404); // not found
                    }else{
                        dbAntony.update({country: country}, updatedCountry);
                        response.send(updatedCountry); // return the updated contact
                    }
                    
                }
            });
        }
    }
});

//DELETE over all the rows
app.delete(BASE_API_PATH + "/rpc-stats", function (request, response) {
    console.log("INFO: New FULL DELETE request");
    dbAntony.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the countries (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no countries to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});

app.delete(BASE_API_PATH + "/rpc-stats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /gdp-population-stats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-population-stats/" + country);
        dbAntony.remove({country: country}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Country successfully removed.");
                if (numRemoved === 1) {
                    console.log("INFO: The country with name " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
   
