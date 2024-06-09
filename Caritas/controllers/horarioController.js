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

class HorarioController {
    constructor() {}

    verificarDisponibilidad(req, res) {
        const { fechaHora, filial } = req.query;

        db.query('SELECT id, fechaHora, fk_IdFilial, estado FROM horario WHERE fechaHora = ? AND fk_IdFilial = ?', [fechaHora, filial], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length > 0) {
                const horario = results[0];
                if (horario.estado === 'ocupado') {
                    return res.json({ disponible: false, horario, message: 'El horario está ocupado.' });
                } else {
                    return res.json({ disponible: true, horario });
                }
            } else {
                return res.json({ disponible: false, message: 'El horario no existe.' });
            }
        });
    }

    confirmarHorario(req, res) {
        const { fechaHora, filial } = req.body;

        db.query('SELECT id, fechaHora, fk_IdFilial, estado FROM horario WHERE fechaHora = ? AND fk_IdFilial = ?', [fechaHora, filial], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length > 0) {
                const horario = results[0];
                if (horario.estado === 'ocupado') {
                    return res.status(400).json({ success: false, message: 'El horario está ocupado.', horario });
                } else {
                    db.query('UPDATE horario SET estado = ? WHERE id = ?', ['ocupado', horario.id], (err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                        // Actualizar el estado del horario antes de devolverlo
                        horario.estado = 'ocupado';
                        return res.json({ success: true, horario });
                    });
                }
            } else {
                return res.status(400).json({ success: false, message: 'El horario no existe.' });
            }
        });
    }
}

module.exports = new HorarioController();
