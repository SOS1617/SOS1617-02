//"use strict";
//global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var DataStore = require('nedb');

var publicFolder = path.join(__dirname, 'public');


////////////////////////////////////////CONEXIÓN CON BASE DE DATOS////////////////////////////////////////////////////////////

//Conexión con base de datos mongoDB
var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://admin:admin@ds139360.mlab.com:39360/sos1617-02";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


//Base de datos mongoDB JOSÉ
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
app.use("/", express.static(path.join(__dirname, BASE_API_PATH + "/")));


////////////////////////////////////////////////CÓDIGO URL BASE////////////////////////////////////////////////////////////

app.get(BASE_API_PATH + "/", function(request, response){
    response.sendfile(publicFolder + "/index.html");
});

////////////////////////////////////////////////CODIGO API JOSÉ////////////////////////////////////////////////////////////

//Initializing with some data
app.get(BASE_API_PATH + "/smi-stats/loadInitialData", function (request, response){
    
            var spain = new Object();
            spain.country = "Spain";
            spain.year = 2017;
            spain.smi_year = "825.70";
            spain.smi_year_variation = "8.01";
    
            var france = new Object();
            france.country = "France";
            france.year = 2017;
            france.smi_year = "1480.3";
            france.smi_year_variation = "0.93";
    
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
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
});


// GET a collection

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



// GET a single resource
app.get(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    
    //Guardamos en una variable el parametro pasado por la consulta de la URL
    var country = request.params.country;
    
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
                    
                    //Recogemos el primer elemento que lo cumpla y lo devolvemos
                    var smi_stat = filteredSMI_STATS[0]; //since we expect to have exactly ONE contact with this country name
                    console.log("INFO: Sending contact: " + JSON.stringify(smi_stat, 2, null));
                    response.send(smi_stat);
                } else {
                    
                    //Si no existiesen elementos en el array.
                    console.log("WARNING: There are not any smi-stats for country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});



//POST over a collection
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
            response.sendStatus(422); // unprocessable entity
            
        } else {
            dbJose.find({}, function (err, smi_stats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    
                    //Esta variable recoge, mediante un callback, un array que se rellenará si existen en la DB países iguales a los que queremos 
                    //insertar con el POST
                    var countryBeforeInsertion = smi_stats.filter((country) => {
                        return (country.name.localeCompare(newCountry.country, "en", {'sensitivity': 'base'}) === 0);
                    });
                    //Si hay algún país que queremos meter y ya estaba, devolvemos conflicto
                    if (countryBeforeInsertion.length > 0) {
                        console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        
                        //Si no existe ningún país que coincida con el que queremos añadir, lo insertamos en la DB
                        console.log("INFO: Adding country " + JSON.stringify(newCountry, 2, null));
                        dbJose.insert(newCountry);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    var country = request.params.country;
    console.log("WARNING: New POST request to /smi-stats/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/smi-stats", function (request, response) {
    console.log("WARNING: New PUT request to /smi-stats/, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    
    //Guardamos los datos introducidos en el comando CURL del país
    var updatedCountry = request.body;
    //Guardamos el parámetro introducido en la URL
    var countryB = request.params.country;
    
    if (!updatedCountry) {
        console.log("WARNING: New PUT request to /smi-stats/ without contact, sending 400...");
        response.sendStatus(400); // bad request
        
    } else {
        console.log("INFO: New PUT request to /smi-stats/" + countryB + " with data " + JSON.stringify(updatedCountry, 2, null));
        
        //Si los datos recogidos en el comando CURL no contienen algunos de estos atributos, habrá error.
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["smi-year"]|| !updatedCountry["smi-year-variation"]) {
            console.log("WARNING: The country " + JSON.stringify(updatedCountry, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            //Buscamos los países que tengan el mismo nombre que el que se introduce en la URL
            //Los guardamos en un array
            dbJose.find({country:countryB}).toArray(function (err, smi_stats) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else if(smi_stats.length > 0) {
                        dbJose.update({"country": countryB}, updatedCountry);
                        console.log("INFO: Modifying country with name " + countryB + " with data " + JSON.stringify(updatedCountry, 2, null));
                        response.send(updatedCountry); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any country with name " + countryB);
                        response.sendStatus(404); // not found
                    }
                });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/smi-stats", function (request, response) {
    
    console.log("INFO: New DELETE request to /smi-stats");
    
    //Lo borra todo
    dbJose.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            //Se controla si el número de paises borrados es mayor que 0, respondemos que ya no hay contenido, pero cuando no es mayor que 0,
            //Se va al NotFound
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
app.delete(BASE_API_PATH + "/smi-stats/:country", function (request, response) {
    
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /smi-stats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        
        console.log("INFO: New DELETE request to /smi-stats/" + country);
        dbJose.remove({country: country}, function (err, numRemoved) {
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
                        response.sendStatus(501);//Conflict
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
        
            dbAndres.findOne({ country: country }, function(err,data){
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
        if (!newCountry.country || !newCountry.year || !newCountry["gdp-year"] || !newCountry["population-year"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbAndres.find({country: newCountry.country}, function (err, countriesBeforeInsertion) {
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
    
    if (!updatedCountry) {
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
        dbAndres.remove({country: country}, {}, function (err, numRemoved) {
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
   
