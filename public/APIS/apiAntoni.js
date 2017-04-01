var exports = module.exports = {};

exports.register = function(app, dbAntony, BASE_API_PATH){
    
    ////////////////////////////////////////////////CODIGO API ANTONY////////////////////////////////////////////////////////////

//Initializing with some data
app.get(BASE_API_PATH + "/rpc-stats/loadInitialData", function (request, response){
    
    var alemania = new Object();
    alemania.country = "Alemania";
    alemania.year = "2017";
    alemania.rpcyear = "56.238";
    alemania.rpcvariation = "1.6%";
    
    var francia = new Object();
    francia.country = "Francia";
    francia.year = "2014";
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

//Get by year

app.get(BASE_API_PATH + "/rpc-stats/:year", function (request, response) {
    
    //Guardamos en una variable el parametro pasado por la consulta de la URL
    var country = request.params.year;
    var year = request.params.year;
    
    //Tratamos la petición a la api según si está entrando un año o un país
    if(isNaN(request.params.year.charAt(0))){
    
        //Si no llega ningún dato por la consulta, mandamos error
        if (!country) {
            console.log("WARNING: New GET request to /smi-stats/:country without country, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /smi-stats/" + country);
            
            //Buscamos en la DB si hay alguna entrada con el mismo parámetro que el introducido y creamos un Array asociado a la variable filteredSMI_STATS
            //Esta variable recogerá en un array todos los elementos que cumplan la confición de la búsqueda
            dbAntony.find({"country":country}).toArray(function (err, filteredRPC_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredRPC_STATS.length > 0) {
                        
                        //Devolvemos todos los elementos que cumplan el criterio de búsqueda
                        var rpc_stat = filteredRPC_STATS; //since we expect to have exactly ONE statics for this country 
                        console.log("INFO: Sending stats of: " + JSON.stringify(rpc_stat, 2, null));
                        response.send(rpc_stat);
                    } else {
                        
                        //Si no existiesen elementos en el array.
                        console.log("WARNING: There are not any smi-stats for country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }else{
        
       //Si no llega ningún dato por la consulta, mandamos error
        if (!year) {
            console.log("WARNING: New GET request to /smi-stats/:country without country, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /smi-stats/" + country);
            
            //Buscamos en la DB si hay alguna entrada con el mismo parámetro que el introducido y creamos un Array asociado a la variable filteredSMI_STATS
            //Esta variable recogerá en un array todos los elementos que cumplan la confición de la búsqueda
            dbAntony.find({year:year}).toArray(function (err, filteredRPC_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredRPC_STATS.length > 0) {
                        
                        //Devolvemos todos los elementos que cumplan el criterio de búsqueda(están guardados en el array)
                        var rpc_stat = filteredRPC_STATS; //since we expect to have exactly ONE statics with this year
                        console.log("INFO: Sending contact: " + JSON.stringify(rpc_stat, 2, null));
                        response.send(rpc_stat);
                    } else {
                        
                        //Si no existiesen elementos en el array.
                        console.log("WARNING: There are not any smi-stats for the year " + year);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//Get by country & year


app.get(BASE_API_PATH + "/rpc-stats/:country/:year", function (request, response) {
    
    //Guardamos en una variable el parametro pasado por la consulta de la URL
    var country = request.params.country;
    var year = request.params.year;
        //Si no llega ningún dato por la consulta, mandamos error
        if (!country || !year) {
            console.log("WARNING: New GET request to /rpc-stats/:country/:year without country or year, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /rpc-stats/" + country);
            
        
            dbAntony.find({"country":country , $and:[{"year":year}]}).toArray(function (err, filteredRPC_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredRPC_STATS.length > 0) {
                        //Devolvemos el primer elemento del array de todos los elementos que cumplan el criterio de búsqueda
                        var rpc_stat = filteredRPC_STATS[0]; //since we expect to have exactly ONE statics for this country 
                        console.log("INFO: Sending rpc-stats of "+country +JSON.stringify(rpc_stat, 2, null));
                        response.send(rpc_stat);
                    } else {
                        //Si no existiesen elementos en el array.
                        console.log("WARNING: There are not any rpc-stats registered in   for country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
});

//Get by country

app.get(BASE_API_PATH + "/rpc-stats/:country",function(request,response){
    
    
    var country= request.params.country;
    
    if(!country){
        console.log("WARNING: New GET request to /rpc-stats/:country/ without country or year, sending 400...");
        response.sendStatus(400); // bad request
        
    }else {
            console.log("INFO: New GET request to /rpc-stats/" + country);
            
        
            dbAntony.find({"country":country }).toArray(function (err, filteredRPC_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredRPC_STATS.length > 0) {
                        //Devolvemos el primer elemento del array de todos los elementos que cumplan el criterio de búsqueda
                        var rpc_stat = filteredRPC_STATS[0]; //since we expect to have exactly ONE statics for this country 
                        console.log("INFO: Sending rpc-stats of "+country +JSON.stringify(rpc_stat, 2, null));
                        response.send(rpc_stat);
                    } else {
                        //Si no existiesen elementos en el array.
                        console.log("WARNING: There are not any rpc-stats registered in   for country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    
    
});








//GET a single row
/*app.get(BASE_API_PATH + "/rpc-stats/:country", function (request, response) {
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
        
    });*/
    
    

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
            response.sendStatus(409); // unprocessable entity
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
    
    if (!updatedCountry || updatedCountry.country != country) {
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["rpc-year"] || !updatedCountry["rpc-variation"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(409); // unprocessable entity
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
/*app.delete(BASE_API_PATH + "/rpc-stats", function (request, response) {
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
});*/

/*app.delete(BASE_API_PATH + "/rpc-stats/:country", function (request, response) {
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
});*/

    
    app.delete(BASE_API_PATH + "/rpc-stats/:country/:year", function (request, response) {
    
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /rpc-stats/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        
        // {$set: {tags: []}}, {upsert: false, multi: true},
        console.log("INFO: New DELETE request to /rpc-stats/" + country+"/"+year);
        dbAntony.deleteOne({country: country, $and:[{year:year}]}, function (err, result) {
            var numRemoved= JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Countries removed: " + numRemoved.n);
                if (numRemoved.n === 1 ) {
                    console.log("INFO: The stats with name " + country + "and year "+year+" has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
    
    app.delete(BASE_API_PATH + "/rpc-stats", function (request, response) {
    
    console.log("INFO: New DELETE request to /rpc-stats");
    
    //Lo borra todo
    dbAntony.remove({}, {multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            //Se controla si el número de paises borrados es mayor que 0, respondemos que ya no hay contenido, pero cuando no es mayor que 0,
            //Se va al NotFound
            if (numRemoved.n > 0) {
                console.log("INFO: All the countries (" + numRemoved.n + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no countries to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    

});
    
    
};



