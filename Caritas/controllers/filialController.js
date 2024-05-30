

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
    // Otros métodos

    // Método para cargar una filial
    cargarFilial(req, res) {
        try {
            console.log(req.body);
            const { nombre, fechaHora, fk_idUsuarioVoluntario } = req.body;
            db.query(
                "INSERT INTO filial (nombre, fechaHora, fk_idUsuarioVoluntario) VALUES (?, ?, ?);",

                [nombre, fechaHora, fk_idUsuarioVoluntario],
                (err, result) => {
                    if (err) {
                        console.error('Error al insertar la filial:', err);
                       
                        return res.status(400).json({ message: err.message });
                    }
                    return res.status(201).json({ id: result.insertId });
                }
            );
        } catch (err) {
            console.error('Error al cargar la filial:', err);
            return res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new FiliarController();
