//Módulos para dar formato a la hora
var format = require('date-format');
var format1 = require('dateformat');

//Server
var express = require("express");

//Variable for save enviorment var or port number
var port = (process.env.PORT || 23455);

//(Execute with Run)
var app = express();

//Port Run Server (Cloud9 don't allow anyone port)
//Asynchronous execution
app.listen(port,(err)=> {
    
    if(!err)
        console.log("Server initialized on port "+ port);
    else
        console.log("Error initializing server on port "+ port + ": " + err );
});

//Definimos correlación de un recurso. (El recurso es el "/" en este ejemplo)
app.get("/",(req,res) => {
    
    res.send("<html><body><h1>Escribe /time al final de la url para saber la hora exacta</h1></body></html>");
    
});

app.use("/time",(req, res) => {
    
    format1.masks.one = 'dS mmmm '
    format1.masks.two = ' yy, hh:MM:ss';
    
    //Tenemos que partir en dos la cadena porque no admite texto aparte del 
    //reservado (en la documentación del módulo dice que sí se puede, pero probando vemos que no)
    var one = format1(new Date(), "one");
    var two = format1(new Date(), "two");
    
    
    
    //Prueba con otro módulo
    var time = format.asString('ddst MM of yyyy, hh:mm:ss', new Date());
    
    


    
    res.write(one + "of"+ two+"\n");
    
    
    res.write("Prueba con otro módulo:\n"+time);
    res.end();
    
});


