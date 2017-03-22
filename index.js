//"use strict";
//global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var DataStore = require('nedb');


//Conexión con base de datos mongoDB
var MongoClient = require("mongodb").MongoClient;

var mdbURL = "mongodb://test:test@ds137370.mlab.com:37370/smi-stats";


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var db;

MongoClient.connect(mdbURL, {native_parser:true}, function (err, database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB"+err);
        process.exit(1);
    }
    
   db = database.collection("smi_stats");
   
   //Solo pongo el servidor a arrancar si la base de datos está arrancada
   app.listen(port, () =>{
    console.log("Magic is happening on port " + port);
    });
});


var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


////////////////////////////////////////////////CODIGO API JOSÉ////////////////////////////////////////////////////////////

//Initializing with some data
app.get(BASE_API_PATH + "/smi_stats/loadInitialData", function (request, response){
    
            var spain = new Object();
            spain.country = "Spain";
            spain.year = 2017;
            spain.smi_year = "825.70";
            spain.smi_year_variation = "8.01";
    
            var france = new Object;
            france.country = "France";
            france.year = 2017;
            france.smi_year = "1480.3";
            france.smi_year_variation = "0.93";
    
            console.log("INFO: Initializing data.");
    
            db.find({}, function(err, countries){
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    if(countries.length > 0){
                        console.log("INFO: Already Data.");
                        response.sendStatus(501);//Not implemented
                    }else{
                    db.insert(spain);
                     db.insert(france);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
});


// GET a collection

//En mongoDB nos devuelve un objeto que tenemos que transformar a un Array
//con la función .toArray()
app.get(BASE_API_PATH + "/smi_stats", function (request, response) {
    console.log("INFO: New GET request to /smi_stats");
    db.find({}).toArray( function (err, smi_stats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending smi_stats: " + JSON.stringify(smi_stats, 2, null));
            response.send(smi_stats);
        }
    });
});



// GET a single resource
app.get(BASE_API_PATH + "/smi_stats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /smi_stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /smi_stats/" + country);
        db.find({"country":country}).toArray(function (err, filteredSMI_STATS){
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredSMI_STATS.length > 0) {
                    var smi_stat = filteredSMI_STATS[0]; //since we expect to have exactly ONE contact with this country name
                    console.log("INFO: Sending contact: " + JSON.stringify(smi_stat, 2, null));
                    response.send(smi_stat);
                } else {
                    console.log("WARNING: There are not any smi_stats with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});



//POST over a collection
app.post(BASE_API_PATH + "/smi_stats", function (request, response) {
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /smi_stats/ without smi_stats, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /smi_stats with body: " + JSON.stringify(newCountry, 2, null));
        if (!newCountry.country || !newCountry.year /*|| !newCountry.smi-year|| !newCountry.smi-year-variation*/) {
            console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, smi_stats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var countryBeforeInsertion = smi_stats.filter((country) => {
                        return (country.name.localeCompare(newCountry.country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (countryBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newCountry, 2, null));
                        db.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/smi_stats/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /smi_stats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/smi_stats", function (request, response) {
    console.log("WARNING: New PUT request to /smi_stats/, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/smi_stats/:country", function (request, response) {
    var updatedCountry = request.body;
    var country = request.params.country;
    
    if (!updatedCountry) {
        console.log("WARNING: New PUT request to /smi_stats/ without contact, sending 400...");
        response.sendStatus(400); // bad request
        
    } else {
        console.log("INFO: New PUT request to /smi_stats/" + country + " with data " + JSON.stringify(updatedCountry, 2, null));
        if (!updatedCountry.country || !updatedCountry.year /*|| !updatedCountry.smi-year|| !updatedCountry.smi-year-variation*/) {
            console.log("WARNING: The country " + JSON.stringify(updatedCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({country:country}, function (err, smi_stats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    /*var countryBeforeInsertion = smi_stats.filter((country) => {
                        return (country.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (countryBeforeInsertion.length > 0) {
                        db.update({"country": country}, updatedCountry);
                        console.log("INFO: Modifying country with name " + country + " with data " + JSON.stringify(updatedCountry, 2, null));
                        response.send(updatedCountry); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any country with name " + country);
                        response.sendStatus(404); // not found
                    }*/
                     if(smi_stats.length == 0){
                        console.log("WARNING: There is not any country with name " + country);
                        response.sendStatus(404); // not found
                    }else{
                        db.update({country: country}, updatedCountry);
                        response.send(updatedCountry); // return the updated contact
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/smi_stats", function (request, response) {
    console.log("INFO: New DELETE request to /smi_stats");
    db.remove({}, {multi: true}, function (err, numRemoved) {
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


//DELETE over a single resource
app.delete(BASE_API_PATH + "/smi_stats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /smi_stats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /smi_stats/" + country);
        db.remove({country: country}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Countries removed: " + numRemoved);
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


////////////////////////////////////////////////CODIGO API ANDRÉS////////////////////////////////////////////////////////////

//GET every row of data
app.get(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    console.log("INFO: New GET/ received");
    db.find({}).toArray(function (err, data) {
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
app.get(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response) {
    var country = request.params.country;
    
    if (!country) {
        console.log("WARNING: New GET request to /gsp-population-stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        if(country == "loadInitialData"){
            var alemania = new Object();
            alemania.country = "Alemania";
            alemania.year = 2017;
            alemania.gdpyear = "3.533.860 M€";
            alemania.populationyear = 81416745;
    
            var francia = new Object;
            francia.country = "Francia";
            francia.year = 2014;
            francia.gdpyear = "2.633.576 M\u20ac";
            francia.populationyear = 814545;
    
            console.log("INFO: Initializing data.");
    
            db.find({}, function(err, countries){
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    if(countries.length > 0){
                        response.sendStatus(501);//Not implemented
                    }else{
                        db.insert(alemania);
                     db.insert(francia);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
        }else{
            console.log("INFO: New GET request to /gdp-population-stats/" + country);
        
            db.findOne({ country: country }, function(err,data){
                    if(err){
                        response.sendStatus(404);
                    }else{
                        response.send(data);
                    }
                });
        }
        
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /gdp-population-stats/ without Country to create, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!newCountry.country || !newCountry.year /*|| !newCountry.gdp-year || !newCountry.population-year*/) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({country: newCountry.country}, function (err, countriesBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if (countriesBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newCountry, 2, null));
                        db.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});

//post to one country--> method not allowed!!
app.post(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response){
    response.sendStatus(405);//method not allowed
});

//PUT to the entire api (update all the elements)
app.put(BASE_API_PATH + "/gdp-population-stats", function (request, response){
   response.sendStatus(405);//Method not allowed!! 
});

//update a single element
app.put(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response){
    var updatedCountry = request.body;
    var country = request.params.country;
    
    if (!updatedCountry) {
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!updatedCountry.country || !updatedCountry.year /*|| !updatedCountry.gdp-year || !updatedCountry.population-year*/) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }else{
            db.find({country: country}, function (err, countries) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    /*var countriesBeforeInsertion = countries.filter((country) => {
                        return (country.country.localeCompare(country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (countriesBeforeInsertion.length > 0) {
                        db.update({country: country}, updatedCountry);
                        response.send(updatedCountry); // return the updated contact
                    } else {
                        console.log("WARNING: There is not any country with name " + country);
                        response.sendStatus(404); // not found
                    }*/
                    if(countries.length == 0){
                        console.log("WARNING: There is not any country with name " + country);
                        response.sendStatus(404); // not found
                    }else{
                        db.update({country: country}, updatedCountry);
                        response.send(updatedCountry); // return the updated contact
                    }
                    
                }
            });
        }
    }
});


//DELETE over all the rows
app.delete(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    console.log("INFO: New FULL DELETE request");
    db.remove({}, {multi: true}, function (err, numRemoved) {
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


//DELETE over a single country
app.delete(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /gdp-population-stats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-population-stats/" + country);
        db.remove({country: country}, {}, function (err, numRemoved) {
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



////////////////////////////////////////////////CODIGO API ANTONY////////////////////////////////////////////////////////////