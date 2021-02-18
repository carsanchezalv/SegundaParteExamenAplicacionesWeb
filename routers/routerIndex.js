const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");
const mysql = require("mysql");
const config = require("../config");
const modelUsuarios = require("../models/modelUsuarios");
const pool = mysql.createPool(config.mysqlConfig);
const mus = new modelUsuarios(pool);
///--------------------------------------------------------------------------///

function identificacionRequerida(request, response, next) {
    let estilos = "<link rel='stylesheet' href='/css/login404.css'>";
    if (request.session.currentUser !== undefined) {
        
        response.locals.userEmail = request.session.currentUser;

        mus.getUserImageName(response.locals.userEmail, function(err, result){
            if (err) {
                response.render("login404", {errorMsg: err.message, styles: estilos});
            }
            else {
                let nombre = result[0].nombre;
                response.locals.userName = nombre;
                response.locals.numUsuario = result[0].num_usuario;
            }
            next();
        })
    }
    else 
        response.render("login404", {errorMsg: "Ha habido un problema con el usuario identificado", styles: estilos});
}


router.get("/", identificacionRequerida, function(request, response, next){
    let estilos = "<link rel='stylesheet' href='/css/index.css'>";
    response.status(200);
    response.render("index", {styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: null});
});

router.get("/imageName", identificacionRequerida, function(request, response, next){
    mus.getUserImageName(response.locals.userEmail, function(err, result){
        if (err) {
            response.render("login404", {errorMsg: err.message});
        }
        else {
            let imagen = result[0].imagen;
            response.sendFile(path.join(__dirname, "../profile_imgs", imagen));
        }
    })
});



module.exports = router;