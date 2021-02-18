const config = require("./config");
const path = require("path");
const createError = require('http-errors');
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
    host: "localhost",
    user: "root",
    password: "",
    database: "404_g04"
});

const middlewareSession = session({
    saveUninitialized: false,
    secret: "foobar34",
    resave: false,
    store: sessionStore
});

// Crear un servidor Express.js
const app = express();
app.set("view engine", "ejs");
app.use(middlewareSession);
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));


const routerUsuarios = require("./routers/routerUsuarios");
const routerPreguntas = require("./routers/routerPreguntas");
const routerLoginOut = require("./routers/routerLoginOut");
const routerIndex = require("./routers/routerIndex");

app.use("/usuarios", routerUsuarios);
app.use("/preguntas", routerPreguntas);
app.use("/loginout", routerLoginOut);
app.use("/index", routerIndex);


app.use(function(req, res, next) {
	next(createError(404));
});

app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = err;

    res.status(err.status || 500);
    let estilos = "<link rel='stylesheet' href='/css/error.css'>";
	res.render('error', {styles: estilos});
});

app.listen(config.port, function(err) {
    if (err) {
       console.log("ERROR al iniciar el servidor");
    }
    else {
       console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});

module.exports = app;