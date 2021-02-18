const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require("path");
const config = require("../config");
router.use(bodyParser.urlencoded({ extended: true }));
const controllerPreguntas = require("../controllers/controllerPreguntas");
const modelUsuarios = require("../models/modelUsuarios");
const pool = mysql.createPool(config.mysqlConfig);
const mus = new modelUsuarios(pool);
//-------------------------------------------------------------//

const cpr = new controllerPreguntas();

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
                let numero = result[0].num_usuario;
                response.locals.numUsuario = numero;
            }
            next();
        })
    }
    else
        response.redirect("/loginout/login");
}


router.get("/", identificacionRequerida, cpr.getLista);
router.get("/buscar", identificacionRequerida, cpr.getBusqueda);
router.get("/formular", identificacionRequerida, cpr.getFormular);
router.post("/formular", identificacionRequerida, cpr.postFormular);
router.get("/imagen/:email", identificacionRequerida, cpr.getImagenUsuario);
router.get("/sinresponder", identificacionRequerida, cpr.getNoRespondidas);
router.post("/formularrespuesta/:idPregunta", identificacionRequerida, cpr.postFormularRespuesta);
router.get("/votopositivo/:idPregunta", identificacionRequerida, cpr.getvotopositivopregunta);
router.get("/votonegativo/:idPregunta", identificacionRequerida, cpr.getvotonegativopregunta);
router.get("/votopositivo/:idPregunta/:idRespuesta", identificacionRequerida, cpr.getvotopositivorespuesta);
router.get("/votonegativo/:idPregunta/:idRespuesta", identificacionRequerida, cpr.getvotonegativorespuesta);
router.get("/etiquetadas/:texto", identificacionRequerida, cpr.getEtiquetadas); 
router.get("/:id", identificacionRequerida, cpr.getPregunta); 

module.exports = router;