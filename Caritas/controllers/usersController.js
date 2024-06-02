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
    const query = 'SELECT nombre, correo, apellido FROM usuarios WHERE rol = "voluntario"'; 
        db.query(query, (err, results) => {
             if (err) {
                 return res.status(500).json({ message: 'Error al obtener los usuarios voluntarios', error: err });
            }
            res.status(200).json(results);
    });
   };

   obtenerUsuarios = (req, res) => {
    const query = 'SELECT nombre, apellido, correo, rol FROM usuarios WHERE rol != "administrador"';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener los usuarios', error: err });
      }
      res.status(200).json(results);
    });
  };
   
obtenerUsuarioPorCorreo = async (req, res) => {
    const { usuarioCorreo } = req.params;

    db.query(
      `SELECT * FROM usuarios WHERE Correo = ? `,
      [usuarioCorreo],
      (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json(rows[0]);
      }
    ); 
}

cambiarRolUsuario(req, res) {
  const { usuarioCorreo, nuevoRol } = req.body;

  try {
    db.query(
          'UPDATE usuarios SET rol = ? WHERE correo = ?',
          [nuevoRol, usuarioCorreo]
      );

      res.status(200).json({ message: "Se cambió el rol del usuario exitosamente" });
  } catch (error) {
      console.error("Error al cambiar el rol del usuario:", error);
      res.status(500).json({ message: "Error al cambiar el rol del usuario" });
  }
}

}  
module.exports = new UsersController();