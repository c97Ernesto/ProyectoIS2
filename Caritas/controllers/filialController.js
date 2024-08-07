

const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

// Esta función decodifica el token y extrae el correo electrónico del usuario
function obtenerCorreoUsuarioDesdeToken(req) {
    // Obtén el token del encabezado de autorización
    const token = req.headers.authorization.split(" ")[1];

    // Decodifica el token y extrae el correo electrónico
    const decodedToken = jwt.verify(token, caritas);
    const correoUsuario = decodedToken.correo; // Suponiendo que el correo electrónico está almacenado en el token como 'correo'

    return correoUsuario;
}

class FiliarController {
    constructor() { }

    async cargarFilial(req, res) {
        try {
            const { nombre, fechaInicio, fechaFin, horaInicio, horaFin, intervalo, diasTrabajo } = req.body;
            const fechaInicioObj = new Date(fechaInicio);
            const fechaFinObj = new Date(fechaFin);
            const [horaInicioHoras, horaInicioMinutos] = horaInicio.split(':').map(Number);
            const [horaFinHoras, horaFinMinutos] = horaFin.split(':').map(Number);

            console.log('Datos recibidos:', { nombre, fechaInicio, fechaFin, horaInicio, horaFin, intervalo, diasTrabajo });

            db.query("INSERT INTO filial (nombre, estado) VALUES (?, ?);", [nombre, 'inactiva'], (err, result) => {
                if (err) {
                    console.error('Error al insertar la filial:', err);
                    return res.status(400).json({ message: err.message });
                }

                const filialId = result.insertId;
                const horarios = [];

                let currentDate = new Date(fechaInicioObj);
                while (currentDate <= fechaFinObj) {
                    console.log('Procesando fecha:', currentDate);
                    if (diasTrabajo.includes(currentDate.getDay().toString())) {
                        console.log('Día de trabajo:', currentDate.getDay());
                        let currentHour = horaInicioHoras;
                        let currentMinute = horaInicioMinutos;

                        while (currentHour < horaFinHoras || (currentHour === horaFinHoras && currentMinute < horaFinMinutos)) {
                            const horario = new Date(currentDate);
                            horario.setHours(currentHour, currentMinute, 0, 0);
                            horarios.push({
                                fechaHora: horario.toISOString().slice(0, 19).replace('T', ' '),
                                fk_idFilial: filialId,
                                estado: 'disponible'
                            });
                            console.log('Horario agregado:', horario.toISOString());

                            currentMinute += parseInt(intervalo, 10);
                            if (currentMinute >= 60) {
                                currentMinute -= 60;
                                currentHour += 1;
                            }
                        }
                    }
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                console.log('Horarios generados:', horarios);

                const horarioQueries = horarios.map(horario => {
                    return new Promise((resolve, reject) => {
                        db.query("INSERT INTO horario (fechaHora, fk_idFilial, estado) VALUES (?, ?, ?);", [horario.fechaHora, horario.fk_idFilial, horario.estado], (err, result) => {
                            if (err) {
                                console.error('Error al insertar el horario:', err);
                                return reject(err);
                            }
                            resolve(result);
                        });
                    });
                });

                Promise.all(horarioQueries)
                    .then(() => {
                        return res.status(201).json({ message: 'Filial y horarios cargados exitosamente' });
                    })
                    .catch(err => {
                        console.error('Error al insertar los horarios:', err);
                        return res.status(500).json({ message: 'Error al insertar los horarios' });
                    });
            });
        } catch (err) {
            console.error('Error al cargar la filial:', err);
            return res.status(500).json({ message: err.message });
        }
    }



    obtenerFiliales(req, res) {
        db.query('SELECT id, nombre FROM filial WHERE estado = "activa"', (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(results);
        });
    }

    obtenerTodasFiliales(req, res) {
        db.query('SELECT id, nombre FROM filial ', (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(results);
        });
    }


    obtenerDetallesFiliales = (req, res) => {
        const query = "SELECT * FROM filial";
        db.query(query, (err, results) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Error al obtener las filiales (obtenerDetallesFiliales línea81 FilialController)", error: err });
            }
            res.status(200).json(results);
        });
    };
    obtenerLosHorariosDeUnaFilial(req, res) {
        const { filialId } = req.params;
        db.query('SELECT id, fechaHora, estado FROM horario WHERE fk_IdFilial = ?', [filialId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(results);
        });

    }
    /*
    obtenerLosHorariosDeUnaFilial(req, res) {
        const { filialId } = req.params;
        const { productoId } = req.query;
    
        db.query('SELECT fk_usuario_correo FROM publicacion WHERE id = ?', [productoId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener el dueño de la publicación' });
            }
    
            const correoDueno = result[0].fk_usuario_correo;
            console.log(correoDueno);
    
            db.query('SELECT fk_horario_id FROM usuarios_horarios_predeterminados WHERE fk_filial_id = ? AND fk_usuario_correo = ?', [filialId, correoDueno], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al obtener los horarios preferidos del dueño de la publicación' });
                }
    
                const horariosIds = results.map(row => row.fk_horario_id);
    
                if (horariosIds.length > 0) {
                    db.query('SELECT id, fechaHora, estado FROM horario WHERE id IN (?) AND fk_IdFilial = ?', [horariosIds, filialId], (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                        res.json(results);
                    });
                } else {
                    return res.status(404).json({ message: 'No se encontraron horarios preferidos para el dueño de la publicación' });
                }
            });
        });
    }
    */

    ElegirUnaFilial(req, res) {
        const { filialId, horarioId } = req.body;

        // Verificar si el horario está disponible
        db.query('SELECT estado FROM horario WHERE id = ?', [horarioId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length === 0 || results[0].estado !== 'disponible') {
                return res.status(400).json({ message: 'El horario no está disponible' });
            }

            // Actualizar el estado del horario a 'ocupado'
            db.query('UPDATE horario SET estado = ? WHERE id = ?', ['ocupado', horarioId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }
                res.status(200).json({ message: 'Filial elegida exitosamente' });
            });
        });
    }
    obtenerTruequesPendientes(req, res) {
        try {
            const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

            // Primero, obtener el ID de la filial usando el correo del usuario
            const obtenerFilialIdQuery = `
            SELECT f.id_filial AS filialId
            FROM filial_voluntario f
            JOIN usuarios u ON f.id_voluntario = u.Correo
            WHERE u.Correo = ?
          `;

            db.query(obtenerFilialIdQuery, [correoUsuario], (err, results) => {
                if (err) {
                    console.error('Error al obtener el ID de la filial:', err);
                    return res.status(500).json({ message: 'Error al obtener el ID de la filial' });
                }
                if (results.length === 0) {
                    return res.status(404).json({ message: 'No se encontró la filial para el usuario' });
                }

                const filialId = results[0].filialId;
                const { fecha } = req.query;

                // Ahora, obtener los trueques pendientes para la filial obtenida
                let query = `
              SELECT o.id, o.dni_ofertante, o.nombre_ofertante, o.dni_receptor, o.nombre_receptor, 
                     p1.nombre AS nombre_producto_ofertante, p2.nombre AS nombre_producto_receptor, 
                     o.fecha_intercambio
              FROM ofertas o
              JOIN publicacion p1 ON o.id_producto_ofertante = p1.id
              JOIN publicacion p2 ON o.id_producto_receptor = p2.id
              WHERE o.id_filial = ? AND o.estado = 'aceptada'
            `;

                const queryParams = [filialId];
                if (fecha) {
                    query += " AND DATE(o.fecha_intercambio) = ?";
                    queryParams.push(fecha);
                }

                db.query(query, queryParams, (err, results) => {
                    if (err) {
                        console.error('Error al obtener trueques pendientes:', err);
                        return res.status(500).json({ message: 'Error al obtener trueques pendientes' });
                    }
                    if (results.length === 0) {
                        return res.status(404).json({ message: 'No hay trueques pendientes para la filial' });
                    }
                    res.json(results);
                });
            });
        } catch (err) {
            console.error('Error al obtener el correo del usuario desde el token:', err);
            return res.status(401).json({ message: 'No autorizado' });
        }
    }


    obtenerDetallesFilial(req, res) {
        const id = req.params.id
        console.log(id)
        try {
            db.query(`SELECT * FROM filial WHERE id = ?`, [id], (err, rows) => {
                if (err) {
                    res.status(400).send(err.message);
                }
                if (rows.length === 0) {
                    return res.status(404).send('Filial no encontrada');
                }
                return res.status(200).json(rows);
            }
            );
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
    asignarVoluntarioFilial(req, res) {
        const { filialId, correoNuevo } = req.body;

        db.query('SELECT fk_idUsuarioVoluntario FROM filial WHERE id = ?', [filialId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            const correoAntiguoVoluntario = results[0].fk_idUsuarioVoluntario;

            db.query('UPDATE filial SET fk_idUsuarioVoluntario = ? WHERE id = ?', [correoNuevo, filialId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', ['voluntario', correoNuevo], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', ['comun', correoAntiguoVoluntario], (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }

                        res.status(200).json({ message: 'Voluntario asignado a filial exitosamente' });
                    });
                });
            });
        });
    }

    reasignarVoluntario(req, res) {
        const { correoAntiguo, correoNuevo, nuevoRol } = req.body;

        db.query('SELECT id FROM filial WHERE fk_idUsuarioVoluntario = ?', [correoAntiguo], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length === 0) {
                return res.status(400).json({ message: 'El voluntario antiguo no está asignado a ninguna filial' });
            }

            const filialId = results[0].id;

            db.query('UPDATE filial SET fk_idUsuarioVoluntario = ? WHERE id = ?', [correoNuevo, filialId], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', ['voluntario', correoNuevo], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: err.message });
                    }

                    db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', [nuevoRol, correoAntiguo], (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }

                        res.status(200).json({ message: 'Se asigno un nuevo voluntario a la filial' });
                    });



                });
            });
        });
    }

    /*eliminarFilial = (req, res) => {
        const filialId = req.params.id;
        const query = "DELETE FROM filial WHERE id = ?";
        db.query(query, [filialId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error al eliminar la filial", error: err });
            }
            res.status(200).json({ message: "Filial eliminada exitosamente" });
        });
    };*/

    eliminarFilial = (req, res) => {
        const filialId = req.params.id;

        //voluntarios asociados con la filial
        const obtenerVoluntariosQuery = `
            SELECT u.Correo 
            FROM usuarios u
            JOIN filial_voluntario fv ON u.Correo = fv.id_voluntario
            WHERE fv.id_filial = ?
        `;

        db.query(obtenerVoluntariosQuery, [filialId], (err, results) => {
            if (err) {
                return res.status(500).json({ message: "Error al obtener los voluntarios de la filial", error: err });
            }


            if (results.length === 0) {
                db.query(`DELETE FROM horario WHERE fk_IdFilial = ?`, [filialId], (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ message: "Error al eliminar los horarios relacionados", error: err });
                    }

                    db.query(`DELETE FROM filial WHERE id = ?`, [filialId], (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ message: "Error al eliminar la filial", error: err });
                        }
                        res.status(200).json({ message: "Filial eliminada exitosamente (sin voluntarios)" });
                    });
                });
            }
            else {

                const voluntarios = results.map(voluntario => voluntario.Correo);

                // Actualizar el rol de los voluntarios a 'comun'
                const actualizarRolQuery = `
                UPDATE usuarios 
                SET rol = 'comun' 
                WHERE Correo IN (?)
                `;

                db.query(actualizarRolQuery, [voluntarios], (err, updateResults) => {
                    if (err) {
                        return res.status(500).json({ message: "Error al actualizar el rol de los voluntarios", error: err });
                    }

                    //eliminar la relación en la tabla filial_voluntario
                    const eliminarRelacionQuery = `
                    DELETE FROM filial_voluntario 
                    WHERE id_filial = ?
                    `;

                    db.query(eliminarRelacionQuery, [filialId], (err, deleteResults) => {
                        if (err) {
                            return res.status(500).json({ message: "Error al eliminar la relación filial-voluntario", error: err });
                        }

                        // eliminar la filial
                        const eliminarFilialQuery = `
                        DELETE FROM filial 
                        WHERE id = ?
                        `;

                        db.query(`DELETE FROM horario WHERE fk_IdFilial = ?`, [filialId], (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({ message: "Error al eliminar los horarios relacionados", error: err });
                            }
        
                            db.query(`DELETE FROM filial WHERE id = ?`, [filialId], (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({ message: "Error al eliminar la filial", error: err });
                                }
                                res.status(200).json({ message: "Filial eliminada exitosamente (sin voluntarios)" });
                            });
                        });
                    });
                });
            }
        });
    };

    async obtenerFilialesDelVoluntario(req, res) {
        const idVoluntario = obtenerCorreoUsuarioDesdeToken(req);

        try {
            db.query(`SELECT f.* FROM filial f JOIN filial_voluntario fv ON f.id = fv.id_filial WHERE fv.id_voluntario = ?`, [idVoluntario], (err, result) => {
                if (err) {
                    return res.status(400).send(err.message);
                }
                if (result.length === 0) {
                    console.log(`No hay filiales para el voluntario con correo ${idVoluntario}`);
                    return res.status(200).json(result);
                }
                return res.status(200).json(result);
            });
        } catch (error) {
            console.error('Error al obtener las filiales del voluntario:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

module.exports = new FiliarController();
