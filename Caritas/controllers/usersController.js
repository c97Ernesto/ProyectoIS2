const fs = require("fs");
const path = require("path");
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
class UsersController {
    constructor() {}

       
      // Controlador para obtener los usuarios voluntarios
    obtenerUsuariosVoluntarios = (req, res) => {
    const query = 'SELECT nombre, correo FROM usuarios WHERE rol = "comun"'; //cambiar por voluntario
        db.query(query, (err, results) => {
             if (err) {
                 return res.status(500).json({ message: 'Error al obtener los usuarios voluntarios', error: err });
            }
            res.status(200).json(results);
    });
   };
}
module.exports = new UsersController();