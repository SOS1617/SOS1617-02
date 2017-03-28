var exports = module.exports = {};

exports.register = function(app, dbAndres, BASE_API_PATH) {

////////////////////////////////////////////////CODIGO API ANDRÉS////////////////////////////////////////////////////////////

//GET every row of data
app.get(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    console.log("INFO: New GET/ received");
    dbAndres.find({}).toArray(function (err, data) {
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
    
            var francia = new Object();
            francia.country = "Francia";
            francia.year = 2014;
            francia.gdpyear = "2.633.576 M\u20ac";
            francia.populationyear = 814545;
    
            console.log("INFO: Initializing data.");
    
            dbAndres.find({}).toArray(function(err, countries){
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    if(countries.length > 0){
                        dbAndres.remove({});
                        dbAndres.insert(alemania);
                        dbAndres.insert(francia);
                        response.sendStatus(201); //created!
                    }else{
                     dbAndres.insert(alemania);
                     dbAndres.insert(francia);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
        }else{
            console.log("INFO: New GET request to /gdp-population-stats/" + country);
        
            dbAndres.find({ country: country }).toArray(function(err,data){
                    if(err){
                        response.sendStatus(404);
                    }else{
                        if(data.length == 0){
                            response.sendStatus(404);
                        }else{
                         response.send(data);   
                        }
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
        if (!newCountry.country || !newCountry.year || !newCountry["gdp-year"] || !newCountry["population-year"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbAndres.find({country: newCountry.country}).toArray(function (err, countriesBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if (countriesBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newCountry, 2, null));
                        dbAndres.insert(newCountry);
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
    
    if (!updatedCountry || updatedCountry.name != country) {
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["gdp-year"] || !updatedCountry["population-year"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }else{
            dbAndres.find({country: country}, function (err, countries) {
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
                        dbAndres.update({country: country}, updatedCountry);
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
    dbAndres.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            response.sendStatus(204);
            //ToDo why this returns 404?? 
            /*if (numRemoved > 0) {
                console.log("INFO: All the countries (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no countries to delete");
                response.sendStatus(404); // not found
            }*/
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
        dbAndres.remove({country: country}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Country successfully removed.");
                
                console.log("INFO: The country with name " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                //ToDo why this returns 404?? 
                /*if (numRemoved === 1) {
                    console.log("INFO: The country with name " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }else{
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }*/
            }
        });
    }
});

    
};
