var express = require("express");
var helmet = require("helmet");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var mlabURL = "mongodb://test:test@ds131890.mlab.com:31890/sandbox";
var port = (process.env.PORT || 8080);
var BASE_API_PATH = "/api/v1/gdp-population-stats";
var db;

var app = express(); //Inicializamos el servidor express
app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

var MongoClient = mongodb.MongoClient;
MongoClient.connect(mlabURL, {native_parser:true}, function(err,database){
    if(err){
      throw err;
   }else{
      console.log('Conectado a MongoDB');
   }
    db = database.collection("gdppopulationstats");
    app.listen(port);
    console.log("Magic is happening on port " + port);
});


//GET every row of data
app.get(BASE_API_PATH, function (request, response) {
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
app.get(BASE_API_PATH + "/:country", function (request, response) {
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
app.post(BASE_API_PATH, function (request, response) {
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /gdp-population-stats/ without Country to create, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!newCountry.country || !newCountry.year || !newCountry.gdp-year || !newCountry.population-year) {
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
app.post(BASE_API_PATH + "/:country", function (request, response){
    response.sendStatus(405);//method not allowed
});

//PUT to the entire api (update all the elements)
app.put(BASE_API_PATH, function (request, response){
   response.sendStatus(405);//Method not allowed!! 
});

//update a single element
app.put(BASE_API_PATH + "/:country", function (request, response){
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
                    if(countries.length = 0){
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
app.delete(BASE_API_PATH, function (request, response) {
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
app.delete(BASE_API_PATH + "/:country", function (request, response) {
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


app.get(BASE_API_PATH + "/loadInitialData", function (request, response){
    
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
    
    
});