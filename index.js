//"use strict";
//global __dirname */
/*golbal assert*/

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var publicFolder = path.join(__dirname, 'public');

//Módulo con api José
var moduleSMI = require("./public/APIS/apiJose.js");

//Módulo con api Andrés
var moduleGDP = require("./public/APIS/apiAndres.js");

//Módulo con api Antoni
var moduleRPC = require("./public/APIS/apiAntoni.js");


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
       ///////////////////CONEXIÓN CON MÓDULO ANTONI////////////////////////////
       moduleRPC.register(app, dbAntony, BASE_API_PATH);
   
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

app.get("/test", function(request, response){
    response.sendfile(publicFolder + "/test.html");
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




