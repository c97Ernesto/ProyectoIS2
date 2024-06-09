

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

        db.query('SELECT estado FROM horario WHERE fechaHora = ? AND fk_IdFilial = ?', [fechaHora, filial], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length === 0) {
                // No existe el horario
                res.json({ disponible: false, message: 'El horario no existe. Horarios solo de 08:00am a 05:00pm' });
            } else {
                const estado = results[0].estado;
                if (estado === 'ocupado') {
                    // El horario está ocupado
                    res.json({ disponible: false, message: 'El horario está ocupado.' });
                } else {
                    // El horario está disponible
                    res.json({ disponible: true, message: 'El horario está disponible.' });
                }
            }
        });
    }

    confirmarHorario(req, res) {
        const { fechaHora, filial } = req.body;

        db.query('SELECT id, estado FROM horario WHERE fechaHora = ? AND fk_IdFilial = ?', [fechaHora, filial], (err, results) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            if (results.length > 0) {
                const horario = results[0];
                if (horario.estado === 'ocupado') {
                    return res.status(400).json({ success: false, message: 'El horario está ocupado.' });
                } else {
                    db.query('UPDATE horario SET estado = ? WHERE id = ?', ['ocupado', horario.id], (err) => {
                        if (err) {
                            return res.status(500).json({ message: err.message });
                        }
                        return res.json({ success: true });
                    });
                }
            } else {
                return res.status(400).json({ success: false, message: 'El horario no existe.' });
            }
        });
    }
}

module.exports = new HorarioController();
