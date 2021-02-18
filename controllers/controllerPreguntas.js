const modelPreguntas = require("../models/modelPreguntas");
const mysql = require("mysql");
const config = require("../config");
const modelUsers = require("../models/modelUsuarios");
const pool = mysql.createPool(config.mysqlConfig);
const mpr = new modelPreguntas(pool);
const mus = new modelUsers(pool);
const path = require("path");

class controllerPreguntas{

    constructor() {}

    getLista(request, response, next) {
        
        mpr.todasLasPreguntas(function(err, datos, long) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/preguntas404.css'>";

                if(datos) {
                    datos.sort(function (a, b) {
                        let x = a.id;
                        let y = b.id;
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }

                response.status(200);
                response.render("preguntas404", { styles: estilos, datos: datos, contador: long, numero: response.locals.numUsuario, nombre: response.locals.userName, encabezado: "Todas las preguntas"});
            }
        });
    }

    getBusqueda(request, response, next) {  
        mpr.buscarPregunta(request.query.busqueda, function(err, datos, long) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/preguntas404.css'>";
                let enc = "Resultados para la búsqueda \"" + request.query.busqueda + "\"";
                
                if(datos) {
                    datos.sort(function (a, b) {
                        let x = a.id;
                        let y = b.id;
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }
                response.status(200);
                response.render("preguntas404", { styles: estilos, datos: datos, numero: response.locals.numUsuario, contador: long, nombre: response.locals.userName, encabezado: enc});
            }
        });
    }

    getFormular(request, response, next) {
        mpr.getEtiquetas(function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {               
                if(datos) {
                    datos.sort(function (a, b) {
                        let y = a;
                        let x = b;
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }
                let estilos = "<link rel='stylesheet' href='/css/formular.css'>";
                response.status(200);
                response.render("formular", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, etiquetas: datos});
            }
        });
    }

    postFormular(request, response, next) {
        let tags = request.body.textoEtiqueta.split('@');
        tags = tags.slice(1, tags.length);
        let datos = {titulo: request.body.textoTitulo, cuerpo: request.body.textoCuerpo, etiquetas: tags, numero: response.locals.numUsuario, usuario: response.locals.userEmail};
        mpr.registerQuestion(datos, function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                response.redirect("/preguntas");
            }
        });
    }
    getEtiquetadas(request, response, next) {
        mpr.todasLasPreguntas(function(err, result, long) {
            if (err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else
            {   
                let estilos = "<link rel='stylesheet' href='/css/preguntas404.css'>";
                let enc = "Preguntas con la etiqueta [" + request.params.texto + "]";
            
                let filtradas = result.filter(aux => aux.etiquetas.some(aux => aux == request.params.texto));

                if(filtradas) {
                    filtradas.sort(function (a, b) {
                        let x = a.id;
                        let y = b.id;
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }

                response.status(200);
                response.render("preguntas404", { styles: estilos, numero: response.locals.numUsuario, datos: filtradas, contador: filtradas.length, nombre: response.locals.userName, encabezado: enc});
            }
        })
    }

    getNoRespondidas(request, response, next) {
        mpr.noRespondidas(function(err, datos, long) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/preguntas404.css'>";
                let enc = "Preguntas sin responder";
            
                if(datos) {
                    datos.sort(function (a, b) {
                        let x = a.id;
                        let y = b.id;
                        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                    });
                }
                
                response.status(200);
                response.render("preguntas404", { styles: estilos, numero: response.locals.numUsuario, datos: datos, contador: long, nombre: response.locals.userName, encabezado: enc});
            }
        });
    }

    getPregunta(request, response, next) {
        mpr.preguntaById(request.params.id, response.locals.userEmail, function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/pregunta.css'>";
                response.status(200);
                response.render("pregunta", { styles: estilos, numero: response.locals.numUsuario, datos: datos, nombre: response.locals.userName });
            }
        });
    }

    postFormularRespuesta(request, response, next) {
        let datos = {
            textoRespuesta: request.body.respuesta,
            idPregunta: request.params.idPregunta,
            usuarioRespuesta: response.locals.userEmail
        }
        mpr.formularRespuesta(datos, function(err, datos){
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                response.redirect("/preguntas");
            }
        })
    }

    getvotopositivopregunta(request, response, next) {
        let datos = {
            id_usuario: response.locals.userEmail,
            tipo_voto: 1,
            id_pregunta: request.params.idPregunta
        }

        mpr.usuarioVotaPregunta(datos, function(err, rows) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("pregunta", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let redi = "/preguntas/" + request.params.idPregunta;
                response.redirect(redi);
            }
        })
    }

    getImagenUsuario (request, response, next) {
        mus.getUserImageName(request.params.email, function(err, result) {
            if (err) {
                console.log(err.message); 
            }
            else
            {
                let imagen = result[0].imagen;
                
                response.sendFile(path.join(__dirname, "../profile_imgs", imagen));
            }
        })
    }

    getvotonegativopregunta(request, response, next) {
        let datos = {
            id_usuario: response.locals.userEmail,
            tipo_voto: -1,
            id_pregunta: request.params.idPregunta
        }

        mpr.usuarioVotaPregunta(datos, function(err, rows) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let redi = "/preguntas/" + request.params.idPregunta;
                response.redirect(redi);
            }
        })
    }

    getvotopositivorespuesta(request, response, next) {
        let datos = {
            id_usuario: response.locals.userEmail,
            tipo_voto: 1,
            id_respuesta: request.params.idRespuesta
        }

        mpr.usuarioVotaRespuesta(datos, function(err, rows) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let redi = "/preguntas/" + request.params.idPregunta;
                response.redirect(redi);
            }
        })
    }

    getvotonegativorespuesta(request, response, next) {
        let datos = {
            id_usuario: response.locals.userEmail,
            tipo_voto: -1,
            id_respuesta: request.params.idRespuesta
        }

        mpr.usuarioVotaRespuesta(datos, function(err, rows) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let redi = "/preguntas/" + request.params.idPregunta;
                response.redirect(redi);
            }
        })
    }
}

module.exports = controllerPreguntas;