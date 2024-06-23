const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

function obtenerCorreoUsuarioDesdeToken(req) {
    // Obtén el token del encabezado de autorización
    const token = req.headers.authorization.split(" ")[1];
  
    // Decodifica el token y extrae el correo electrónico
    const decodedToken = jwt.verify(token, caritas);
    const correoUsuario = decodedToken.correo; // Suponiendo que el correo electrónico está almacenado en el token como 'correo'
  
    return correoUsuario;
  }

class TruequeController {
    registrarEstadoTrueque(req, res) {
        const { ofertaId, descripcion, estado } = req.body;

        const voluntario= obtenerCorreoUsuarioDesdeToken(req);
            db.query(
                `INSERT INTO trueques (descripcion, estado, voluntario, id_oferta)
                VALUES (?, ?, ?, ?);`,
                [
                  descripcion,
                  estado,
                  voluntario,
                  ofertaId,
                ],
                (err, rows) => {
                db.query('UPDATE ofertas SET estado = ? WHERE id = ?', ['finalizada', ofertaId], (err, updateResult) => {
                    if (err) {
                        console.error('Error al actualizar el estado de la oferta:', err);
                        return res.status(500).json({ message: 'Error al actualizar el estado de la oferta' });
                    }

                    res.status(200).json({ message: 'Estado del trueque registrado con éxito' });
                });
            });
    }
}

module.exports = new TruequeController();