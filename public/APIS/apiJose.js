var exports = module.exports = {};

exports.register = function(app, dbJose, BASE_API_PATH) {


////////////////////////////////////////////////CODIGO API JOSÉ////////////////////////////////////////////////////////////

//Initializing with some data
app.get(BASE_API_PATH + "/smi-stats/loadInitialData", function (request, response){
    
            var spain = new Object();
            spain.country = "Spain";
            spain.year = "2017";
            spain.smi_year = "825.70";
            spain.smi_year_variation = "8.01";
    
            var france = new Object();
            france.country = "France";
            france.year = "2017";
            france.smi_year = "1480.3";
            france.smi_year_variation = "0.93";
            
            var china = { "country": "China", "year": "2013", "smi-year": "170.3 €", "smi-year-variation": "10.28%" };
            var japan = { "country": "Japan", "year": "2014", "smi-year": "919.9 €", "smi-year-variation": "-19.91%" };
            
    
            console.log("INFO: Initializing data.");
    
    //Busca en la base de datos y obtiene un array
            dbJose.find({}).toArray(function(err, countries){
                //Si hay algún error en el servidor, lanzo el error como respuesta.
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    //Si hay algun elemento en el array, respondo con que ya hay datos en la DB
                    if(countries.length > 0){
                        console.log("INFO: Already Data.");
                        response.sendStatus(409);//Already Data
                    }else{
                    //Si no había datos, inserto los datos en la DB
                     dbJose.insert(spain);
                     dbJose.insert(france);
                     dbJose.insert(japan);
                     dbJose.insert(china);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
});


//1. GET a collection

//En mongoDB nos devuelve un objeto que tenemos que transformar a un Array
//con la función .toArray()
app.get(BASE_API_PATH + "/smi-stats", function (request, response) {
    console.log("INFO: New GET request to /smi-stats");
    
    dbJose.find({}).toArray( function (err, smi_stats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            //Si no da error, devuelvo todos los elementos del array
            console.log("INFO: Sending smi-stats: " + JSON.stringify(smi_stats, 2, null));
            response.send(smi_stats);
        }
    });
});



//2. GET a collection of a same year

app.get(BASE_API_PATH + "/smi-stats/:year", function (request, response) {
    
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
            dbJose.find({"country":country}).toArray(function (err, filteredSMI_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredSMI_STATS.length > 0) {
                        
                        //Devolvemos todos los elementos que cumplan el criterio de búsqueda
                        var smi_stat = filteredSMI_STATS; //since we expect to have exactly ONE statics for this country 
                        console.log("INFO: Sending stats of: " + JSON.stringify(smi_stat, 2, null));
                        response.send(smi_stat);
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
            dbJose.find({year:year}).toArray(function (err, filteredSMI_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredSMI_STATS.length > 0) {
                        
                        //Devolvemos todos los elementos que cumplan el criterio de búsqueda(están guardados en el array)
                        var smi_stat = filteredSMI_STATS; //since we expect to have exactly ONE statics with this year
                        console.log("INFO: Sending contact: " + JSON.stringify(smi_stat, 2, null));
                        response.send(smi_stat);
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

//3. GET over a single resource

app.get(BASE_API_PATH + "/smi-stats/:country/:year", function (request, response) {
    
    //Guardamos en una variable el parametro pasado por la consulta de la URL
    var country = request.params.country;
    var year = request.params.year;
        //Si no llega ningún dato por la consulta, mandamos error
        if (!country || !year) {
            console.log("WARNING: New GET request to /smi-stats/:country/:year without country or year, sending 400...");
            response.sendStatus(400); // bad request
        } else {
            console.log("INFO: New GET request to /smi-stats/" + country);
            
            //Buscamos en la DB si hay alguna entrada con los mismos parámetros que los introducidos y los guardamos en el array fileteredSMI_STATS
            //Esta variable recogerá en un array todos los elementos que cumplan la confición de la búsqueda
            dbJose.find({"country":country , $and:[{"year":year}]}).toArray(function (err, filteredSMI_STATS){
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                    if (filteredSMI_STATS.length > 0) {
                        //Devolvemos el primer elemento del array de todos los elementos que cumplan el criterio de búsqueda
                        var smi_stat = filteredSMI_STATS[0]; //since we expect to have exactly ONE statics for this country 
                        console.log("INFO: Sending smi-stats of "+country+" in "+year+": " + JSON.stringify(smi_stat, 2, null));
                        response.send(smi_stat);
                    } else {
                        //Si no existiesen elementos en el array.
                        console.log("WARNING: There are not any smi-stats registered in "+ year + " for country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
});

//4. POST over a collection
app.post(BASE_API_PATH + "/smi-stats", function (request, response) {
    
    //Recogemos el cuerpo de la petición y lo guardamos en la variable. En ella tenemos ahora mismo los datos que hemos dado mediante la petición CURL
    //para hacer el post a la colección
    var newCountry = request.body;
    if (!newCountry) {
        console.log("WARNING: New POST request to /smi-stats/ without smi-stats, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        
        console.log("INFO: New POST request to /smi-stats with body: " + JSON.stringify(newCountry, 2, null));
        
        //Si le falta algun parámetro al nuevo elemento que queremos introducir con el POST, devolvemos error
        if (!newCountry.country || !newCountry.year || !newCountry["smi-year"]|| !newCountry["smi-year-variation"]) {
            console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(400); // bad request
            
        } else {
            dbJose.find({country: newCountry.country}, function (err, countriesBeforeInsertion) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    if (countriesBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newCountry, 2, null));
                        dbJose.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
                }
            );
        }
    }
});


// POST over a single resource (PROHIBIDO)
app.post(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /smi-stats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


// PUT over a collection (PROHIBIDO)
app.put(BASE_API_PATH + "/smi-stats", function (request, response) {
    console.log("WARNING: New PUT request to /smi-stats/, sending 405...");
    response.sendStatus(405); // method not allowed
});


//5. PUT over a single resource
app.put(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    
    //Guardamos los datos introducidos en el comando CURL del país
    var updatedCountry = request.body;
    //Guardamos el parámetro introducido en la URL
    var countryB = request.params.country;
    
    if (!updatedCountry || countryB != updatedCountry.country) {
        console.log("WARNING: New PUT request to /smi-stats/ without country or the country is not the same, sending 400...");
        response.sendStatus(400); // bad request
        
    } else {
        console.log("INFO: New PUT request to /smi-stats/" + countryB + " with data " + JSON.stringify(updatedCountry, 2, null));
        
        //Si los datos recogidos en el comando CURL no contienen algunos de estos atributos, habrá error.
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["smi-year"]|| !updatedCountry["smi-year-variation"]) {
            console.log("WARNING: The country " + JSON.stringify(updatedCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(400); // Bad Request
        } else {
            //Buscamos los países que tengan el mismo nombre que el que se introduce en la URL
            //Los guardamos en un array
            dbJose.find({country:countryB}).toArray(function (err, smi_stats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else{ 
                    if(smi_stats.length > 0) {
                        dbJose.update({"country": countryB}, updatedCountry);
                        console.log("INFO: Modifying country with name " + countryB + " with data " + JSON.stringify(updatedCountry, 2, null));
                        response.send(updatedCountry); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any country with name " + countryB);
                        response.sendStatus(404); // not found
                    }
               } 
                
            });
        }
    }
});


//6. DELETE over a collection
app.delete(BASE_API_PATH + "/smi-stats", function (request, response) {
    
    console.log("INFO: New DELETE request to /smi-stats");
    
    //Lo borra todo
    dbJose.remove({}, {multi: true}, function (err, result) {
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


//7. DELETE over a single resource
app.delete(BASE_API_PATH + "/smi-stats/:country/:year", function (request, response) {
    
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New DELETE request to /smi-stats/:country/:year without country or year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        
        // {$set: {tags: []}}, {upsert: false, multi: true},
        console.log("INFO: New DELETE request to /smi-stats/" + country+"/"+year);
        dbJose.deleteOne({country: country, $and:[{"year":year}]}, function (err, result) {
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
    
};
