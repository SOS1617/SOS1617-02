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


/*TAREAS FEEDBACK 2
//Definimos correlación de un recurso. (El recurso es el "/" en este ejemplo)
app.get("/time1",(req,res) => {
    
    res.send("<html><body><h1>Escribe /time al final de la url para saber la hora exacta</h1></body></html>");
    
});

app.use("/time",(req, res) => {
    
    format.masks.one = 'dS mmmm '
    format.masks.two = ' yyyy, hh:MM:ss';
    
    //Tenemos que partir en dos la cadena porque no admite texto aparte del 
    //reservado (en la documentación del módulo dice que sí se puede, pero probando vemos que no)
    var one = format(new Date(), "one");
    var two = format(new Date(), "two");
    
    res.write(one + "of"+ two+"\n");
    res.end();
    
});
*/


//TAREAS FEEDBACK 3


//Paquete para concatenar los directorios (nativo)
var path = require("path");


//__dirname = directorio donde se está ejecutando node
//Estamos guardando la carpeta public en la variable publicFolder
var publicFolder = path.join(__dirname,'public');

//Devuelve todos los archivos al cliente.
//El módulo express(mediante el método static)define una carpeta que es la que se va a utilizar conmo contenido estático. 
app.use("/",express.static(publicFolder));