"use strict"
const mysql = require("mysql");


function asignarDatos(respuestas, result, etiquet) {

    let arrayFecha = result[0].fecha.split('-');
                                    
    let dia = arrayFecha[2];
    let mes = arrayFecha[1];
    let anyo = arrayFecha[0];

    let fechaOrdenada = dia + "/" + mes + "/" + anyo;

    let objeto = {
        nombre: result[0].nombre,
        id: result[0].id,
        fecha: fechaOrdenada,
        cuerpo: result[0].cuerpo,
        email: result[0].email,
        titulo: result[0].titulo,
        etiquetas: etiquet,
        num_visitas: result[0].num_visitas,
        num_votos: result[0].num_votos,
        num_respuestas: result[0].num_respuestas,
        respuestas: respuestas,
        numUsuario: result[0].num_usuario
    }

    return objeto;
}


class modelPreguntas {
    constructor(pool) { this.pool = pool; }

    registerQuestion(datos, callback) {

        // Para eliminar duplicados (teniendo en cuenta tildes, ñ y mayúsculas) del array de etiquetas:
        let chars={
            "á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",
            "à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"n",
            "Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",
            "À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"N"}
        let expr=/[áàéèíìóòúùñ]/ig;
        const newEtiquetas = [];
        const myObj = {};
        datos.etiquetas.forEach(elem => !(elem.toUpperCase().replace(expr,function(e){return chars[e]}) in myObj) && elem != "" && elem.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') == elem && (myObj[elem.toUpperCase().replace(expr,function(e){return chars[e]})] = true) && newEtiquetas.push(elem))

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO pregunta (id_usuario, cuerpo, titulo) VALUES(?,?,?)",
                [datos.usuario, datos.cuerpo, datos.titulo],
                
                function (err, rows) {
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        let etiquetas = newEtiquetas;
                        
                        if(etiquetas.length > 5) // Límite 5 etiquetas
                            etiquetas = etiquetas.slice(0, 5);
                        
                        let valores = "";
                        let aux = [];

                        for(let i = 0; i < etiquetas.length; i++) {
                            valores += " (?,?)";
                            if(i < etiquetas.length - 1) {
                                valores +=",";
                            }
                            aux.push(rows.insertId); // El último ID que ha insertado
                            aux.push(etiquetas[i].toLowerCase()); // Siempre en minuscula para facilitar el filtro por etiquetas
                        }
                        connection.query("INSERT INTO etiquetas (id_pregunta, texto) VALUES" + valores,
                        aux,
                        function () { // si da error es porque no hay etiquetas y eso está muy bien también
                            callback(null);
                        });
                        connection.release();
                    }
                });
            }
        });
    }

    registerAnswer(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO RESPUESTA (id_usuario, cuerpo, id_pregunta) VALUES(?,?,?)",
                [datos.usuario, datos.cuerpo, datos.id_pregunta],
                
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    usuarioVotaPregunta(datos, callback) {

        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO USUARIO_VOTA_PREGUNTA VALUES(?,?,?)",
                [datos.id_usuario, datos.id_pregunta, datos.tipo_voto],
                function () {
                    callback(null);
                });
            }
        });
    }

    usuarioVisitaPregunta(datos, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else{
                connection.query("INSERT INTO USUARIO_VISITA_PREGUNTA (id_usuario, id_pregunta) VALUES(?,?)",
                [datos.id_usuario, datos.id_pregunta],
                
                function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("el usuario ya habia visitado esta pregunta"));
                    }
                });
                
            }
        });
    }

    buscarPregunta(texto, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let texto2 = "%" + texto + "%";
                connection.query("SELECT * FROM PREGUNTA P JOIN USUARIO U ON P.ID_USUARIO=U.EMAIL WHERE P.TITULO LIKE (?) OR P.CUERPO LIKE (?)",
                [texto2, texto2],
                function (err, result) {
                    if (err) {
                        callback(new Error("Error al buscar la pregunta"));
                    }
                    else {
                        let datos = [];
                        if(result.length == 0) 
                        {
                            callback(null, null, 0);
                            connection.release();
                        }
                        else
                        {
                            result.forEach((aux, i) => {
                                connection.query("SELECT * FROM ETIQUETAS WHERE ID_PREGUNTA=(?)",
                                [aux.id],
                                function(err, rows) {
                                    if(err) {
                                        callback(new Error("Error al listar las etiquetas de preguntas"));
                                    }
                                    else
                                    {   
                                        // Formato fecha
                                        let etiquet = [];                      
                                        rows.forEach(eti => {
                                            etiquet.push(eti.texto);
                                        });

                                        let arrayFecha = aux.fecha.split('-');
                                    
                                        let dia = arrayFecha[2];
                                        let mes = arrayFecha[1];
                                        let anyo = arrayFecha[0];

                                        let fechaOrdenada = dia + "/" + mes + "/" + anyo;

                                        // Formato cuerpo (150 caracteres)
                                        if(aux.cuerpo.length > 150)
                                            aux.cuerpo = aux.cuerpo.substr(0, 150) + "...";
                                        
                                        let objeto = {
                                            nombre: aux.nombre,
                                            id: aux.id,
                                            fecha: fechaOrdenada,
                                            cuerpo: aux.cuerpo,
                                            email: aux.email,
                                            titulo: aux.titulo,
                                            etiquetas: etiquet,
                                            numUsuario: aux.num_usuario
                                        }
                                        datos.push(objeto);
                                    }
                                    
                                    if(i == result.length - 1) {
                                        let long = datos.length;
                                        callback(null, datos, long);
                                        connection.release();
                                    }
                                });
                            })
                        }
                    }
                });
            }
        });
    }

    usuarioVotaRespuesta(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO USUARIO_VOTA_RESPUESTA (id_usuario, id_respuesta, tipo) VALUES(?,?,?)",
                [datos.id_usuario, datos.id_respuesta, datos.tipo_voto],
                function (rows) {
                    connection.release();
                    callback(null, rows);
                });
            }
        });
    }

    todasLasPreguntas(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM PREGUNTA P JOIN USUARIO U ON P.ID_USUARIO=U.EMAIL",
                                
                function (err, result) {                    
                    if (err) {
                        callback(new Error("Error al listar las preguntas"));
                    }
                    else {
                         
                        if(result.length === 0)
                            callback(null, null, 0)
                        else {
                            let datos = [];
                            
                            result.forEach((aux, i) => {
                                connection.query("SELECT * FROM ETIQUETAS WHERE ID_PREGUNTA=(?)",
                                [aux.id],
                                function(err, rows) {
                                    
                                    if(err) {
                                        callback(new Error("Error al listar las etiquetas de preguntas"));
                                    }
                                    else
                                    {   
                                        let etiquet = [];                      
                                        rows.forEach(eti => {
                                            etiquet.push(eti.texto);
                                        });
                                        
                                        // Formato fecha
                                        let arrayFecha = aux.fecha.split('-');
                                        
                                        let dia = arrayFecha[2];
                                        let mes = arrayFecha[1];
                                        let anyo = arrayFecha[0];

                                        let fechaOrdenada = dia + "/" + mes + "/" + anyo;
                                        
                                        // Formato cuerpo (150 caracteres)
                                        if(aux.cuerpo.length > 150)
                                            aux.cuerpo = aux.cuerpo.substr(0, 150) + "...";

                                        let objeto = {
                                            nombre: aux.nombre,
                                            id: aux.id,
                                            fecha: fechaOrdenada,
                                            cuerpo: aux.cuerpo,
                                            email: aux.email,
                                            titulo: aux.titulo,
                                            etiquetas: etiquet,
                                            numUsuario: aux.num_usuario
                                        }
                                        datos.push(objeto);
                                    }
                                    
                                    if(i == result.length - 1) {
                                        let long = datos.length;
                                        callback(null, datos, long);
                                        connection.release();
                                    }
                                });
                            })
                        }
                    }
                });
            }
        });
    }
    noRespondidas(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM PREGUNTA P JOIN USUARIO U ON P.ID_USUARIO=U.EMAIL WHERE P.NUM_RESPUESTAS = 0",
                                
                function (err, result) {
                    if (err) {
                        callback(new Error("Error al listar las preguntas"));
                    }
                    else {
                        if(result.length === 0)
                            callback(null, null, 0)
                        else {
                            let datos = [];
                            result.forEach((aux, i) => {
                                connection.query("SELECT * FROM ETIQUETAS WHERE ID_PREGUNTA=(?)",
                                [aux.id],
                                function(err, rows) {
                                    if(err) {
                                        callback(new Error("Error al listar las etiquetas de preguntas"));
                                    }
                                    else {   
                                        let etiquet = [];                      
                                        rows.forEach(eti => {
                                            etiquet.push(eti.texto);
                                        });

                                        // Formato fecha
                                        let arrayFecha = aux.fecha.split('-');
                                        
                                        let dia = arrayFecha[2];
                                        let mes = arrayFecha[1];
                                        let anyo = arrayFecha[0];

                                        let fechaOrdenada = dia + "/" + mes + "/" + anyo;
                                    
                                        // Formato cuerpo (150 caracteres)
                                        if(aux.cuerpo.length > 150)
                                            aux.cuerpo = aux.cuerpo.substr(0, 150) + "...";

                                        let objeto = {
                                            nombre: aux.nombre,
                                            id: aux.id,
                                            fecha: fechaOrdenada,
                                            cuerpo: aux.cuerpo,
                                            email: aux.email,
                                            titulo: aux.titulo,
                                            etiquetas: etiquet,
                                            numUsuario: aux.num_usuario
                                        }
                                        datos.push(objeto);
                                    }
                                    
                                    if(i == result.length - 1) {
                                        let long = datos.length;
                                        callback(null, datos, long);
                                        connection.release();
                                    }
                                });
                            })
                        }
                    }
                });
            }
        });
    }

    preguntaById(id, usuarioActual, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO USUARIO_VISITA_PREGUNTA (ID_USUARIO, ID_PREGUNTA) VALUES(?,?)",
                [usuarioActual, id],                
                function () {
                    connection.query("SELECT * FROM PREGUNTA P JOIN USUARIO U ON P.ID_USUARIO=U.EMAIL WHERE P.ID = (?)",
                    [id],                
                    function (err, result) {
                        if (err) {
                            callback(new Error("Error al listar las preguntas"));
                        }
                        else {
                            if(result[0]) {
                                connection.query("SELECT * FROM ETIQUETAS WHERE ID_PREGUNTA=(?)",
                                [id],
                                function(err, rows) {                   
                                    if(err) {
                                        callback(new Error("Error al listar las etiquetas de preguntas"));
                                    }
                                    else {   
                                        connection.query("SELECT * FROM RESPUESTA R JOIN USUARIO U ON R.ID_USUARIO=U.EMAIL WHERE ID_PREGUNTA=(?)",
                                        [id],
                                        function(err, filas) {
                                            if(err) {
                                                callback(new Error("Error al listar las RESPUESTAS"));
                                            }
                                            else { 
                                                let etiquet = [];                      
                                                rows.forEach(eti => {
                                                    etiquet.push(eti.texto);
                                                });

                                                let respuestas = [];
                                                if(filas.length == 0) {
                                                    connection.release();
                                                    let datos = asignarDatos(respuestas, result, etiquet);
                                                    callback(null, datos);
                                                }
                                                filas.forEach((resp, i) =>{
                                                    connection.query("SELECT * FROM USUARIO WHERE EMAIL=(?)",
                                                    [resp.id_usuario],
                                                    function(err, lineas) {
                                                        if(err) {
                                                            callback(new Error("Error al coger los datos del usuario de la respuesta"));
                                                        }
                                                        else {
                                                            // Formato fecha
                                                            let arrayFecha = resp.fecha.split('-');
                                    
                                                            let dia = arrayFecha[2];
                                                            let mes = arrayFecha[1];
                                                            let anyo = arrayFecha[0];
                    
                                                            let fechaOrdenada = dia + "/" + mes + "/" + anyo;
                                                            
                                                            let aux = {
                                                                nombreUsuario: lineas[0].nombre,
                                                                cuerpo: resp.cuerpo,
                                                                num_votos: resp.num_votos,
                                                                fecha: fechaOrdenada,
                                                                id_usuario: resp.id_usuario,
                                                                id: resp.id,
                                                                numUsuario: resp.num_usuario
                                                            }
                                                            respuestas.push(aux);

                                                            if(i == filas.length -1) {
                                                                connection.release();
                                                                let datos = asignarDatos(respuestas, result, etiquet);
                                                                callback(null, datos);
                                                            }
                                                        }
                                                    });
                                                })
                                            }
                                        });
                                    }
                                });
                            }
                        
                            else {
                                callback(new Error("Error al encontrar la pregunta solicitada."));
                            }
                        }
                    });
                    
                });
            }
        });
    }

    formularRespuesta(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO RESPUESTA (id_usuario, id_pregunta, cuerpo) VALUES(?,?,?)",
                [datos.usuarioRespuesta, datos.idPregunta, datos.textoRespuesta],
                function (err) {
                    connection.release();
                    if (err) {
                         callback(new Error("Error al insertar una nueva respuesta"));
                    }
                    else {
                        callback(null);
                    }
                });
            }
        });
    }

    getEtiquetas(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM ETIQUETAS",
                function (err, rows) {
                    connection.release();
                    if (err) {
                         callback(new Error("Error al buscar las etiquetas"));
                    }
                    else {
                        let datos = []
                        rows.forEach(e => {
                            if(!datos.includes(e.texto)) {
                                datos.push(e.texto);
                            }
                        });
                        console.log(datos);
                        callback(null, datos);
                    }
                });
            }
        });
    }
}

module.exports = modelPreguntas;