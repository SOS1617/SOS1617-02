var exports = module.exports = {};

exports.register = function(app, dbAndres, BASE_API_PATH) {
    
var apiKey = ["GVAODcH3"];

function checkApiKey(request, response){
    var introducedKey = request.query.apikey;
    var res = true;

    //In this version we override this!!
   
    return res;
}


////////////////////////////////////////////////CODIGO API ANDRÉS////////////////////////////////////////////////////////////

//GET every row of data
app.get(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    console.log("INFO: New GET/ received");
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    var limit = parseInt(request.query.limit, 10); //This is the number of elements to be returned (by default is 10).
    var offset = parseInt(request.query.offset, 0); //This is the starting point from which we return 'limit' elements.
    //We use this variables in db.find();
    
    //These are used for searches
    var country = request.query.country;
    var year = parseInt(request.query.year);
    
    if(country || year){
        
        dbAndres.find({"country":country, $and:[{"year":year}]}).toArray(function (err, filteredData){
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                //Si el array es mayor que 0 es que hay al menos un elemento que lo cumple. 
                if (filteredData.length > 0) {
                var data = filteredData[0];
                    console.log("INFO-SEARCH: Sending smi-stats of "+country+" in " +year);
                    response.send(data);
                    } else {
                        //Si no existiesen elementos en el array.
                        console.log("WARNING-SEARCH: There are not any stats registered in "+ year +"  for country " + country);
                        response.sendStatus(404); // not found
                    }
                }
        });
        
    }else{
        
        dbAndres.find({}).skip(offset).limit(limit).toArray(function (err, data) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending out every row of data");
            response.send(data);
        }
        });
    }
    
    
});

    
//Proxy
app.get(BASE_API_PATH + "/gdp-population-stats/proxy/", (req,res)=>{
    
     if(checkApiKey(req,res)==true){
            var http = require('http');
            
           var options = {
                host:"sos1617-07.herokuapp.com",
                path:'/api/v1/salaries/?apikey=sos07'
            };
            
            callback =function(response){
               
                var str='';
                
                //another chunk of data has been recieved, so append it to str
                response.on('data',function(chunk){
                    
                    str += chunk;
                });
                
                //the wole response has been recieved, so we just print it out here
                response.on('end',function(){
                    res.send(str);
                });
            };
            
            http.request(options,callback).end();
       
         
     }
});    
    
//Proxy
app.get(BASE_API_PATH + "/gdp-population-stats/btcproxy/", (req,res)=>{
    
     if(checkApiKey(req,res)==true){
            var http = require('http');
            
           var options = {
                host:"api.coinmarketcap.com",
                path:'/v1/ticker/?limit=10'
            };
            
            callback =function(response){
               
                var str='';
                
                //another chunk of data has been recieved, so append it to str
                response.on('data',function(chunk){
                    
                    str += chunk;
                });
                
                //the wole response has been recieved, so we just print it out here
                response.on('end',function(){
                    res.send(str);
                });
            };
            
            http.request(options,callback).end();
       
         
     }
});

    
//Proxy
app.get(BASE_API_PATH + "/gdp-population-stats/priceproxy/", (req,res)=>{
    
     if(checkApiKey(req,res)==true){
            var http = require('http');
            
           var options = {
                host:"api.coindesk.com",
                path:'/v1/bpi/historical/close.json'
            };
            
            callback =function(response){
               
                var str='';
                
                //another chunk of data has been recieved, so append it to str
                response.on('data',function(chunk){
                    
                    str += chunk;
                });
                
                //the wole response has been recieved, so we just print it out here
                response.on('end',function(){
                    res.send(str);
                });
            };
            
            http.request(options,callback).end();
       
         
     }
});
   
    
//GET a single row
app.get(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response) {
    var country = request.params.country;
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    if (!country) {
        console.log("WARNING: New GET request to /gsp-population-stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        if(country == "loadInitialData"){
            var alemania = new Object();
            alemania.country = "Germany";
            alemania.year = 2017;
            alemania["gdp-year"] = "820";
            alemania["population-year"] = 81416745;

            var francia = new Object();
            francia.country = "France";
            francia.year = 2014;
            francia["gdp-year"] = "960";
            francia["population-year"] = 814545;
            
            var holanda = new Object();
            holanda.country = "Holand";
            holanda.year = 2010;
            holanda["gdp-year"] = "440";
            holanda["population-year"] = 44545;
            
            var italia = new Object();
            italia.country = "Italy";
            italia.year = 2017;
            italia["gdp-year"] = "345";
            italia["population-year"] = 4545;
            
            var portugal = new Object();
            portugal.country = "Portugal";
            portugal.year = 2004;
            portugal["gdp-year"] = "123";
            portugal["population-year"] = 814545;
            
            var finlandia = new Object();
            finlandia.country = "Usa";
            finlandia.year = 2000;
            finlandia["gdp-year"] = "543";
            finlandia["population-year"] = 33545;
    
            console.log("INFO: Initializing data.");
    
            dbAndres.find({}).toArray(function(err, countries){
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    if(countries.length > 0){
                        dbAndres.remove({});
                        dbAndres.insert(alemania);
                        dbAndres.insert(francia);
                        dbAndres.insert(holanda);
                        dbAndres.insert(italia);
                        dbAndres.insert(portugal);
                        dbAndres.insert(finlandia);
                        response.sendStatus(201); //created!
                    }else{
                        dbAndres.insert(alemania);
                        dbAndres.insert(francia);
                        dbAndres.insert(holanda);
                        dbAndres.insert(italia);
                        dbAndres.insert(portugal);
                        dbAndres.insert(finlandia);
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
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    
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
                        console.log("WARNING: The country " + JSON.stringify(newCountry, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding country " + JSON.stringify(newCountry, 2, null));
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
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    response.sendStatus(405);//method not allowed
});

//PUT to the entire api (update all the elements)
app.put(BASE_API_PATH + "/gdp-population-stats", function (request, response){
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
   response.sendStatus(405);//Method not allowed!! 
});

//update a single element
app.put(BASE_API_PATH + "/gdp-population-stats/:country", function (request, response){
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    
    var updatedCountry = request.body;
    var country = request.params.country;
    
    if (!updatedCountry || updatedCountry.country != country) {
        response.sendStatus(400); // bad request
    }else{
        console.log("INFO: New POST request to /gdp-population-stats");
        if (!updatedCountry.country || !updatedCountry.year || !updatedCountry["gdp-year"] || !updatedCountry["population-year"]) {
            console.log("WARNING: The country is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }else{
            
            dbAndres.find({country:country}).toArray(function (err, gdp_stats) {
                    if (err) {
                        console.error('WARNING: Error getting data from DB');
                        response.sendStatus(500); // internal server error
                    } else{ 
                        if(gdp_stats.length > 0) {
                            dbAndres.update({"country": country}, updatedCountry);
                            console.log("INFO: Modifying country with name " + country + " with data " + JSON.stringify(updatedCountry, 2, null));
                            response.send(updatedCountry); // return the updated contact
                        } else {
                            console.log("WARNING: There are not any country with name " + country);
                            response.sendStatus(404); // not found
                        }
                   } 
                    
                });
        }
    }
});


//DELETE over all the rows
app.delete(BASE_API_PATH + "/gdp-population-stats", function (request, response) {
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    
    console.log("INFO: New FULL DELETE request");
    dbAndres.remove({}, {multi: true}, function (err, result) {
        var numRemoved= JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            
            if (numRemoved.n > 0) {
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
    
    if(checkApiKey(request, response) === false){
        return; //this is basically like a break
    }
    
    
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New DELETE request to /gdp-population-stats/:country without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /gdp-population-stats/" + country);
        dbAndres.remove({country: country}, function (err, result) {
            var numRemoved= JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                if (numRemoved.n === 1) {
                    console.log("INFO: The country with name " + country + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                }else{
                    console.log("WARNING: There are no countries to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

};