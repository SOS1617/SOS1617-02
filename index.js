"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');
var DataStore = require('nedb');


//Conexión con base de datos mongoDB
var MongoClient = require("mongodb").MongoClient;

var mdbURL = "mongodb://admin:admin@ds137370.mlab.com:37370/smi-stats";


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var db;

MongoClient.connect(mdbURL, {native_parser:true}, function (err, database){
    
    if(err){
        console.log("CAN NOT CONNECT TO DB"+err);
        process.exit(1);
    }
    
   db = database.collection("smi_stats");
   
   //Solo pongo el servidor a arrancar si la base de datos está arrancada
   app.listen(port, () =>{
    console.log("Magic is happening on port " + port);
    });
});


var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


// GET a collection

//En mongoDB nos devuelve un objeto que tenemos que transformar a un Array
//con la función .toArray()
app.get(BASE_API_PATH + "/smi_stats", function (request, response) {
    console.log("INFO: New GET request to /smi_stats");
    db.find({}).toArray( function (err, smi_stats) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending smi_stats: " + JSON.stringify(smi_stats, 2, null));
            response.send(smi_stats);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/smi_stats/:country", function (request, response) {
    var country = request.params.country;
    if (!country) {
        console.log("WARNING: New GET request to /smi_stats/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /smi_stats/" + country);
        db.find({}).toArray(function (err, filteredSMI_STATS){
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredSMI_STATS.length > 0) {
                    var smi_stat = filteredSMI_STATS; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending contact: " + JSON.stringify(smi_stat, 2, null));
                    response.send(smi_stat);
                } else {
                    console.log("WARNING: There are not any smi_stats with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/smi_stats", function (request, response) {
    var newContact = request.body;
    if (!newContact) {
        console.log("WARNING: New POST request to /smi_stats/ without smi_stats, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /smi_stats with body: " + JSON.stringify(newContact, 2, null));
        if (!newContact.name || !newContact.phone || !newContact.email) {
            console.log("WARNING: The contact " + JSON.stringify(newContact, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, contacts) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = contacts.filter((contact) => {
                        return (contact.name.localeCompare(newContact.name, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        console.log("WARNING: The contact " + JSON.stringify(newContact, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding contact " + JSON.stringify(newContact, 2, null));
                        db.insert(newContact);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var name = request.params.name;
    console.log("WARNING: New POST request to /contacts/" + name + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("WARNING: New PUT request to /contacts, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var updatedContact = request.body;
    var name = request.params.name;
    if (!updatedContact) {
        console.log("WARNING: New PUT request to /contacts/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact, 2, null));
        if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
            console.log("WARNING: The contact " + JSON.stringify(updatedContact, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, contacts) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var contactsBeforeInsertion = contacts.filter((contact) => {
                        return (contact.name.localeCompare(name, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (contactsBeforeInsertion.length > 0) {
                        db.update({name: name}, updatedContact);
                        console.log("INFO: Modifying contact with name " + name + " with data " + JSON.stringify(updatedContact, 2, null));
                        response.send(updatedContact); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any contact with name " + name);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("INFO: New DELETE request to /contacts");
    db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the contacts (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var name = request.params.name;
    if (!name) {
        console.log("WARNING: New DELETE request to /contacts/:name without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /contacts/" + name);
        db.remove({name: name}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: Contacts removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The contact with name " + name + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


