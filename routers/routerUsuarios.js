const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const config = require("../config");
router.use(bodyParser.urlencoded({ extended: true }));
const controllerUsuarios = require("../controllers/controllerUsuarios");
const modelUsuarios = require("../models/modelUsuarios");
const modelPreguntas = require("../models/modelPreguntas");
const pool = mysql.createPool(config.mysqlConfig);
const mus = new modelUsuarios(pool);

const cus = new controllerUsuarios();

function identificacionRequerida(request, response, next) {
    if (request.session.currentUser !== undefined) {
        response.locals.userEmail = request.session.currentUser;

        mus.getUserImageName(response.locals.userEmail, function(err, result){
            if (err) {
                console.log(err.message);
            }
            else {
                let nombre = result[0].nombre;
                response.locals.userName = nombre;
                response.locals.numUsuario = result[0].num_usuario;
            }
            next();
        })
    } else {
        response.redirect("/loginout/login");
    }
}

router.get("/", identificacionRequerida, cus.getListaUsuarios);
router.get("/perfil/:numUsuario", identificacionRequerida, cus.getPerfilUsuario);
router.get("/filtrar", identificacionRequerida, cus.getFiltroUsuarios);


module.exports = router;