"use strict"
const mysql = require("mysql");

class modelUsers {
    constructor(pool) { this.pool = pool; }

    isUserCorrect(email, password, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuario WHERE email = ? AND contraseña = ?",
                [email, password],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(null, false); //no está el usuario con la password proporcionada
                        }
                        else {
                            callback(null, true);
                        }
                    }
                });
            }
        }
        );
    }

    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuario WHERE email = ?",
                [email],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(new Error("No existe el usuario"));
                        }
                        else {
                            callback(null, rows);
                        }
                    }
                });
            }
        });
    }

    getUserByNumber(number, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM usuario WHERE num_usuario = ?",
                [number],
                function (err, rows) {       
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else {
                        if (rows.length === 0) {
                            callback(new Error("No existe el usuario"));
                        }
                        else {
                            connection.query("SELECT * FROM usuario_gana_medalla GM JOIN medalla M ON M.id=GM.id_medalla WHERE GM.id_usuario = ?",
                            [rows[0].email],
                            function(err, filas) {
                                connection.release();
                                let datos = {user: rows[0], medallas: filas};
                                callback(null, datos);
                            });
                        }
                    }
                });
            }
        });
    }

    countBronce(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT COUNT(*) as NUM FROM usuario_gana_medalla GM JOIN medalla M ON M.ID=GM.ID_MEDALLA WHERE id_usuario=(?) AND METAL='BRONCE'",
                [email],
                function (err, rows) {
                    if(err)
                        callback(new Error("Error en medallas bronce"));
                    else {
                        callback(null, rows[0].NUM);
                    }
                });
            }
        });
    }

    countPlata(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT COUNT(*) as NUM FROM usuario_gana_medalla GM JOIN medalla M ON M.ID=GM.ID_MEDALLA WHERE id_usuario=(?) AND METAL='PLATA'",
                [email],
                function (err, rows) {
                    if(err)
                        callback(new Error("Error en medallas plata"));
                    else {
                        callback(null, rows[0].NUM);
                    }
                });
            }
        });
    }

    countOro(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT COUNT(*) as NUM FROM usuario_gana_medalla GM JOIN medalla M ON M.ID=GM.ID_MEDALLA WHERE id_usuario=(?) AND METAL='ORO'",
                [email],
                function (err, rows) {
                    if(err)
                        callback(new Error("Error en medallas oro"));
                    else {
                        callback(null, rows[0].NUM);
                    }
                });
            }
        });
    }

    registerUser(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("INSERT INTO usuario (email, nombre, imagen, contraseña) VALUES(?,?,?,?)",
                [datos.email, datos.nombre, datos.imagen, datos.contraseña],
                function (err) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else
                        callback(null);
                });
            }
        });
    }

    getAllUsers(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM USUARIO",
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else
                        callback(null, rows);
                });
            }
        });
    }

    getFilterUsers(nombre, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                let nombre2 = "%" + nombre + "%";
                connection.query("SELECT * FROM USUARIO WHERE NOMBRE LIKE (?)",
                [nombre2],
                function (err, rows) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error de acceso a la base de datos"));
                    }
                    else
                        callback(null, rows);
                });
            }
        });
    }
}

module.exports = modelUsers;