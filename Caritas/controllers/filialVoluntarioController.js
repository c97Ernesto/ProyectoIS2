const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

function obtenerCorreoUsuarioDesdeToken(req) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, caritas);
    const correoUsuario = decodedToken.correo; 
  
    return correoUsuario;
  }

  class FilialVoluntarioController {
    asignarVoluntarioFilial(req, res) {
        const { filialId, correoNuevo } = req.body;
    
        try {
            // Asignar nuevo voluntario a la filial
            db.query('INSERT INTO filial_voluntario (id_filial, id_voluntario) VALUES (?, ?)', [filialId, correoNuevo]);
            db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', ['voluntario', correoNuevo]);
            db.query('UPDATE filial SET estado = ? WHERE id = ?', ['activa', filialId]);
    
            res.status(200).json({ message: 'Voluntario asignado a filial exitosamente' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    designarVoluntario (req, res) {
        const { correoUsuario, nuevoRol } = req.body;
    
        try {
            db.query('SELECT * FROM filial_voluntario WHERE id_voluntario = ?', [correoUsuario], (err, rows) => {
                if (err) {
                  return res.status(400).send(err.message);
                }
                const filialId=  rows[0].id_filial;
                db.query('SELECT COUNT(*) AS count FROM filial_voluntario WHERE id_filial = ?', [filialId], (err, rows) => {
                    if (err) {
                      return res.status(400).send(err.message);
                    }
                    const cant=  rows[0].count;
                    if (cant <= 1) {
                        // Si no hay otros voluntarios, cancelar las ofertas aceptadas y poner la filial en estado "inactiva"
                        db.query('UPDATE ofertas SET estado = ? WHERE estado = ? AND id_filial = ?', ['rechazada', 'aceptada', filialId]);
                        db.query('UPDATE filial SET estado = ? WHERE id = ?', ['inactiva', filialId]);
                    }
                });
            db.query('DELETE FROM filial_voluntario WHERE id_voluntario = ?', [correoUsuario]);
    
            // Cambiar el rol del usuario
            db.query('UPDATE usuarios SET rol = ? WHERE correo = ?', [nuevoRol, correoUsuario]);
    
            res.status(200).json({ message: 'El rol del voluntario se actualizó y se realizaron los cambios correspondientes' });
        });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    voluntarioFilial(req, res) {
        const { correoUsuario } = req.params;
    
        if (!correoUsuario) {
            return res.status(400).json({ message: 'El correo del usuario es requerido' });
        }
    
        db.query('SELECT * FROM filial_voluntario WHERE id_voluntario = ?', [correoUsuario], (err, rows) => {
            if (err) {
                console.error('Error al obtener la filial del voluntario:', err);
                return res.status(500).json({ message: 'Error al obtener la filial del voluntario', error: err.message });
            }
    
            if (rows.length === 0) {
                console.log('No se encontró ninguna filial para el voluntario');
                return res.status(404).json({ message: 'No se encontró ninguna filial para el voluntario' });
            }
    
            const filialId = rows[0].id_filial;
            db.query('SELECT * FROM filial_voluntario WHERE id_filial = ?', [filialId], (err, filas) => {
                if (err) {
                    console.error('Error al obtener las filas de la filial:', err);
                    return res.status(500).json({ message: 'Error al obtener las filas de la filial', error: err.message });
                }
                res.status(200).json(filas);
            });
        });
    }

  }

module.exports = new FilialVoluntarioController();