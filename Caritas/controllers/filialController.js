

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
    constructor() {}

    // Método para cargar una filial
    cargarFilial(req, res) {
        try {
            const { nombre, horarios, fk_idUsuarioVoluntario } = req.body;

            // Insertar la filial
            db.query(
                "INSERT INTO filial (nombre, fk_idUsuarioVoluntario) VALUES (?, ?);",
                [nombre, fk_idUsuarioVoluntario],
                (err, result) => {
                    if (err) {
                        console.error('Error al insertar la filial:', err);
                        return res.status(400).json({ message: err.message });
                    }

                    const filialId = result.insertId;

                    // Insertar los horarios para la filial
                    const horarioQueries = horarios.map(horario => {
                        return new Promise((resolve, reject) => {
                            db.query(
                                "INSERT INTO horario (fechaHora, fk_IdFilial) VALUES (?, ?);",
                                [horario, filialId],
                                (err, result) => {
                                    if (err) {
                                        console.error('Error al insertar el horario:', err);
                                        return reject(err);
                                    }
                                    resolve(result);
                                }
                            );
                        });
                    });

                    // Ejecutar todas las consultas de horario
                    Promise.all(horarioQueries)
                        .then(() => {
                            return res.status(201).json({ message: 'Filial y horarios cargados exitosamente' });
                        })
                        .catch(err => {
                            console.error('Error al insertar los horarios:', err);
                            return res.status(500).json({ message: 'Error al insertar los horarios' });
                        });
                }
            );
        } catch (err) {
            console.error('Error al cargar la filial:', err);
            return res.status(500).json({ message: err.message });
        }
    }
    obtenerFiliales(req, res){
        db.query('SELECT id, nombre FROM filial', (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }
            res.json(results);
        });
    }
    obtenerLosHorariosDeUnaFilial(req, res){
        const { filialId } = req.params;
        db.query('SELECT id, fechaHora, estado FROM horario WHERE fk_IdFilial = ?', [filialId], (err, results) => {
             if (err) {
                     return res.status(500).json({ message: err.message });
             }
             res.json(results);
        });

    }
    

    ElegirUnaFilial(req, res){
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

    obtenerDetallesFilial(req, res){
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
        const { correoAntiguo, correoNuevo } = req.body;

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

                    db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', ['comun', correoAntiguo], (err, results) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }

                        res.status(200).json({ message: 'Se asigno un nuevo voluntario a la filial' });
                    });
                    

                    
                });
            });
        });
    }

}





module.exports = new FiliarController();
