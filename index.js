//"use strict";
//global __dirname */
/*golbal assert*/

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var publicFolder = path.join(__dirname, 'public');

//Módulo con api José
var moduleSMI = require("./APIS/apiJose.js");

//Módulo con api Andrés
var moduleGDP = require("./APIS/apiAndres.js");
var moduleGDP_v2 = require("./APIS/apiAndres_v2.js");

//Módulo con api Antoni
var moduleRPC = require("./APIS/apiAntoni.js");

var BASE_API_PATH = "/api";

////////////////////////////////////////CONEXIÓN CON BASE DE DATOS////////////////////////////////////////////////////////////

//Conexión con base de datos mongoDB
var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://admin:admin@ds139360.mlab.com:39360/sos1617-02";

var port = (process.env.PORT || 10000);


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
       moduleSMI.register(app, dbJose, BASE_API_PATH + "/v1");
       ///////////////////CONEXIÓN CON MÓDULO ANDRES////////////////////////////
       moduleGDP.register(app, dbAndres, BASE_API_PATH + "/v1");
       moduleGDP_v2.register(app, dbAndres, BASE_API_PATH + "/v2");
       ///////////////////CONEXIÓN CON MÓDULO ANTONI////////////////////////////
       moduleRPC.register(app, dbAntony, BASE_API_PATH + "/v1");
   
   //Solo pongo el servidor a arrancar si la base de datos está arrancada
   app.listen(port, () =>{
    console.log("Magic is happening on port " + port);
    });
});


var app = express();


app.use("/", express.static(path.join(__dirname,"public")));

//BODYPARSER usa por defecto la codificación de JSON
app.use(bodyParser.json()); //use default json enconding/decoding

//HELMET aporta seguridad a nuestro servidor
app.use(helmet()); //improve security



////////////////////////////////////////////////CÓDIGO URL BASE////////////////////////////////////////////////////////////

app.get(BASE_API_PATH+"/tests", function(request, response){
    response.sendfile(publicFolder + "/tests.html");
});

app.get(BASE_API_PATH+"/smi-angular", function(request, response){
    response.sendfile(publicFolder + "/angularSMI/index.html");
});

app.get(BASE_API_PATH+"/rpc-angular", function(request, response){
    response.sendfile(publicFolder + "/angularRPC/index.html");
});

app.get(BASE_API_PATH+"/gdp-angular", function(request, response){
    response.sendfile(publicFolder + "/angularGDP/index.html");
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




