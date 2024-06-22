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

   obtenerUsuariosSinVoluntarios = (req, res) => {
    const query = 'SELECT nombre, correo, apellido FROM usuarios WHERE rol != "voluntario"'; 
        db.query(query, (err, results) => {
             if (err) {
                 return res.status(500).json({ message: 'Error al obtener los usuarios voluntarios', error: err });
            }
            res.status(200).json(results);
    });
   };

   obtenerUsuarios = (req, res) => {
    const query = 'SELECT *, rol FROM usuarios';
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


    cambiarRol = async (req, res) => {
        const { usuarioCorreo, nuevoRol } = req.body;

        db.query('SELECT rol FROM usuarios WHERE correo = ?', [usuarioCorreo], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error al obtener el rol del usuario', error: err });
            }
            const rolAnterior = results[0].rol;

             db.query(
               'UPDATE usuarios SET rol = ? WHERE correo = ?',
                [nuevoRol, usuarioCorreo], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error al cambiar el rol del usuario', error: err });
                }

                if (rolAnterior === 'voluntario' && nuevoRol === 'comun') {
                    res.status(200).json({ message: 'Rol cambiado correctamente. Seleccione un nuevo voluntario para la filial.' });
                } else {
                    res.status(200).json({ message: 'Rol cambiado correctamente' });
                }
            });
        });
    };

// Eliminar un usuario

 eliminarUsuario = async (req, res) => {
  const { usuarioCorreo } = req.params;
  console.log(`Intentandoooo eliminar usuario con correo: ${usuarioCorreo}`);
  const getUserRoleQuery = 'SELECT rol FROM usuarios WHERE Correo = ?';

  db.query(getUserRoleQuery, [usuarioCorreo], (error, results) => {
      if (error) {
          console.error('Error al obtener el rol del usuario:', error);
          return res.status(500).json({ message: 'Error al obtener el rol del usuario', error });
      }
      if (results.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const userRole = results[0].rol;

      if (userRole === 'voluntario') {
        const updateFilialStatusQuery = 'UPDATE filial SET estado = "inactiva", fk_idUsuarioVoluntario = NULL WHERE fk_idUsuarioVoluntario = ?';
          db.query(updateFilialStatusQuery, [usuarioCorreo], (updateError, updateResults) => {
              if (updateError) {
                  console.error('Error al actualizar el estado de la filial:', updateError);
                  return res.status(500).json({ message: 'Error al actualizar el estado de la filial', updateError });
              }

              const deleteUserQuery = 'DELETE FROM usuarios WHERE Correo = ?';
              db.query(deleteUserQuery, [usuarioCorreo], (deleteError, deleteResults) => {
                  if (deleteError) {
                      console.error('Error al eliminar el usuario:', deleteError);
                      return res.status(500).json({ message: 'Error al eliminar el usuario', deleteError });
                  }
                  res.sendStatus(200);
              });
          });
      } else {
          const deleteUserQuery = 'DELETE FROM usuarios WHERE Correo = ?';
          db.query(deleteUserQuery, [usuarioCorreo], (deleteError, deleteResults) => {
              if (deleteError) {
                  console.error('Error al eliminar el usuario:', deleteError);
                  return res.status(500).json({ message: 'Error al eliminar el usuario', deleteError });
              }
              res.sendStatus(200);
          });
      }
  });
};
}

module.exports = new UsersController();