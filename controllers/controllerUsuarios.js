const modelUsuarios = require("../models/modelUsuarios");
const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config.mysqlConfig);
const mus = new modelUsuarios(pool);

class controllerUsuarios{

    constructor() {}

    getLogin(request, response, next) {
        let estilos = "<link rel='stylesheet' href='/css/login404.css'>";
        request.session.destroy();
        response.status(200);
        response.render("login404", { errorMsg: null, styles: estilos });
    }

    getLogout(request, response, next) {
        request.session.destroy();
        response.redirect("/loginout/login");
    }

    postLogin(request, response, next){
        let estilos = "<link rel='stylesheet' href='/css/login404.css'>";
        mus.isUserCorrect(request.body.email, request.body.password,
            function (err, ok) {
            if (err) { // error de acceso a la base de datos
                response.status(500);
                response.render("login404", {errorMsg:"Error interno de acceso a la base de datos", styles: estilos})
            }
            else if (ok) {
                request.session.currentUser = request.body.email;
                response.redirect("/index");
            }
            else {
                response.status(200);
                response.render("login404",
                {errorMsg:"Dirección de correo y/o contraseña no válidos", styles: estilos});
            }
        });
    }

    getRegistro(request, response, next) {
        let estilos = "<link rel='stylesheet' href='/css/registro404.css'>"

        response.status(200);
        response.render("registro404", {errorMsg: null, styles: estilos})
    }

    postRegistro(request, response, next) {
        let estilos = "<link rel='stylesheet' href='/css/registro404.css'>";
        let pass1 = request.body.pass1;
        let pass2 = request.body.pass2;

        if(pass1 !== pass2) {
            response.status(200);
            response.render("registro404", {errorMsg:"Las contraseñas introducidas no coinciden. Presta más atención la próxima vez, por favor.", styles: estilos})
        }
          
        else {
            request.checkBody("pass1", "Contraseña no válida: Debe tener mínimo 8 caracteres y máximo 20").isLength({min: 8, max: 20});
            request.checkBody("nombre", "Nombre no válido: Debe contener solo caracteres alfanuméricos.").matches(/^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ_-]+$/i);
            request.getValidationResult().then(function(result) {
                
                if(result.isEmpty())
                {
                    let foto = "pavorandom.jpg";

                    if(request.file) 
                        foto = request.file.filename;

                    else
                    {
                        let aleatoria = Math.floor(Math.random() * 2) + 1; // Num aleatorio entre 1 y 3 inclusives para generar foto aleatoria en usuario sin foto, el floor quita decimales redondeando
                        foto = "defecto"+aleatoria+".png";
                    }

                    let datos = {
                        email: request.body.email,
                        nombre: request.body.nombre,
                        imagen: foto,
                        contraseña: request.body.pass1
                    };   
                    
                    mus.registerUser(datos, function(err) {
                        if (err) {
                            response.status(200);
                            response.render("registro404", {errorMsg:"Error al registrar el usuario. Probablemente ya estés registrado con ese email. Presta más atención la próxima vez, por favor.", styles: estilos})
                        }
                        else
                            response.redirect("/loginout/login");
                    });
                }
                else
                {
                    response.status(200);
                    response.render("registro404", {errorMsg: result.array()[0].msg, styles: estilos});
                }
            })
        }
    }

    getPerfilUsuario(request, response, next) {
        let estilos = "<link rel='stylesheet' href='/css/perfil.css'>";

        mus.getUserByNumber(request.params.numUsuario, function(err, rows) {
            if(err) {
                let indexstyle = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", {errorMsg: err.message, styles: indexstyle, nombre: response.locals.userName, numero: response.locals.numUsuario});
            } 
            else {
                let datos = rows.user;
                let med = rows.medallas;
                mus.countBronce(datos.email, function(err, bronce) {
                    if(err) {
                        let indexstyle = "<link rel='stylesheet' href='/css/index.css'>";
                        response.status(200);
                        response.render("index", {errorMsg: err.message, styles: indexstyle, nombre: response.locals.userName, numero: response.locals.numUsuario});
                    }
                    else {
                        mus.countPlata(datos.email, function(err, plata) {
                            if(err) {
                                let indexstyle = "<link rel='stylesheet' href='/css/index.css'>";
                                response.status(200);
                                response.render("index", {errorMsg: err.message, styles: indexstyle, nombre: response.locals.userName, numero: response.locals.numUsuario});
                            }
                            else {
                                mus.countOro(datos.email, function(err, oro) {
                                    if(err) {
                                        let indexstyle = "<link rel='stylesheet' href='/css/index.css'>";
                                        response.status(200);
                                        response.render("index", {errorMsg: err.message, styles: indexstyle, nombre: response.locals.userName, numero: response.locals.numUsuario});
                                    }
                                    else {
                                        let medallitas = [];
                                        
                                        med.forEach(aux => {
                                            let encontrado = false;
                                            
                                            for(let i = 0; i < medallitas.length && !encontrado; ++i)
                                            {
                                                if(aux.nombre == medallitas[i].nombre) {
                                                    ++medallitas[i].cont;
                                                    encontrado = true;
                                                }
                                            }
                                            if(!encontrado) 
                                                medallitas.push({nombre: aux.nombre, metal: aux.metal, cont: 1});
                                        });

                                        let oros = [];
                                        let platas = [];
                                        let bronces = [];
                                        medallitas.forEach(elem => {
                                            if(elem.metal == "ORO") 
                                                oros.push(elem);
                                            else if(elem.metal == "PLATA")
                                                platas.push(elem);
                                            else
                                                bronces.push(elem);
                                        })
                                        
                                        let arrayFecha = datos.fecha_alta.split('-');
                                    
                                        let dia = arrayFecha[2];
                                        let mes = arrayFecha[1];
                                        let anyo = arrayFecha[0];

                                        let fechaOrdenada = dia + "/" + mes + "/" + anyo;
                                        datos.fecha_alta = fechaOrdenada;

                                        response.status(200);
                                        response.render("perfil", {bronces: bronces, platas: platas, oros: oros, bronce: bronce, oro: oro, plata: plata, datos: datos, styles: estilos, nombre: response.locals.userName, numero: response.locals.numUsuario});
                                    }
                                })
                            }
                        })
                    }
                })
            }
        });
    }

    getListaUsuarios(request, response, next) {
        mus.getAllUsers(function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/usuarios.css'>";
                let enc = "Usuarios";
                response.status(200);
                response.render("usuarios", { styles: estilos, numero: response.locals.numUsuario, datos: datos, nombre: response.locals.userName, encabezado: enc});
            }
        });
    }

    getFiltroUsuarios(request, response, next) {
        mus.getFilterUsers(request.query.filtro, function(err, datos) {
            if(err) {
                let estilos = "<link rel='stylesheet' href='/css/index.css'>";
                response.status(200);
                response.render("index", { styles: estilos, numero: response.locals.numUsuario, nombre: response.locals.userName, errorMsg: err.message });
            }
            else {
                let estilos = "<link rel='stylesheet' href='/css/usuarios.css'>";
                let enc = "Usuarios filtrados por [\"" + request.query.filtro + "\"]";
                response.status(200);
                response.render("usuarios", { styles: estilos, numero: response.locals.numUsuario, datos: datos, nombre: response.locals.userName, encabezado: enc});
            }
        });
    }
}

module.exports = controllerUsuarios;