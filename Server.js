const express = require('express');
const app = express();

const mongoose = require('mongoose');
let bodyParser = require('body-parser');         // pull information from HTML POST (express4)
let methodOverride = require('method-override');

let database = require('./config/database');
const port = process.env.PORT || 5656;


let Handler = require('./api-handler/GeneralHandler');

// Models
let Beca = require('./model/Beca');
let Alumno = require('./model/Alumno');
let Especialidad = require('./model/Especialidad');
let Estado = require('./model/Estado');
let Institucion = require('./model/Institucion');
let TipoBeca = require('./model/TipoBeca');
let Cuenta = require('./model/Cuenta');


// Configurations
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Connection
mongoose.connect(database.url);

app.listen(port);
console.log("App listening on port : " + port);

//====ROOT DIRECTORY===//
app.get('/', function(req, res) {
    res.json('You are using sistema-becas-API.');
});


let tables = [
    {schema: Beca, name: 'becas'},
    {schema: Alumno, name: 'alumnos'},
    {schema: Especialidad, name: 'especialidades'},
    {schema: Estado, name: 'estados'},
    {schema: Institucion, name: 'instituciones'},
    {schema: TipoBeca, name: 'tipos-de-becas'},
    {schema: Cuenta, name: 'cuentas'}
];


tables.forEach(table =>{
    let tableHandler = new Handler(table.schema);
    app.get('/' + table.name, tableHandler.getAllItems);
    app.get('/' + table.name + '/:_id', tableHandler.getItemById);
    app.post('/' + table.name, tableHandler.insertItem);
    app.put('/' + table.name + '/:_id', tableHandler.updateItem);
    app.delete('/' + table.name + '/:_id', tableHandler.deleteItem);
});
