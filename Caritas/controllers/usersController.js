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
    const query =
      'SELECT nombre, correo, apellido FROM usuarios WHERE rol = "voluntario"';
    db.query(query, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({
            message: "Error al obtener los usuarios voluntarios",
            error: err,
          });
      }
      res.status(200).json(results);
    });
  };

  obtenerUsuariosSinVoluntarios = (req, res) => {
    const query =
      'SELECT nombre, correo, apellido FROM usuarios WHERE rol != "voluntario"';
    db.query(query, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({
            message: "Error al obtener los usuarios voluntarios",
            error: err,
          });
      }
      res.status(200).json(results);
    });
  };

  obtenerUsuarios = (req, res) => {
    const query = "SELECT *, rol FROM usuarios";
    db.query(query, (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al obtener los usuarios", error: err });
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
  };

  obtenerMisDatos = async (req, res) => {
    const correo = obtenerCorreoUsuarioDesdeToken(req);
    console.log(correo);

    db.query(
      `SELECT * FROM usuarios WHERE Correo = ? `,
      [correo],
      (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json(rows);
      }
    );
  };

  actualizarMisDatos = async (req, res) => {
    const correo = obtenerCorreoUsuarioDesdeToken(req);
    const { usuario, nombre, apellido, dni, telefono } = req.body; // Datos actualizados que vienen en el cuerpo de la solicitud

    console.log(req.body);

    // Verificar que se proporcionen los datos necesarios para la actualización
    if (!usuario || !nombre || !apellido || !telefono) {
      return res
        .status(400)
        .json({
          message:
            "Todos los campos (usuario, nombre, apellido, dni) son requeridos para actualizar.",
        });
    }

    // Actualizar los datos del usuario en la base de datos
    db.query(
      `UPDATE usuarios SET Usuario = ?, Nombre = ?, Apellido = ?, DNI = ?, Telefono = ? WHERE Correo = ?`,
      [usuario, nombre, apellido, dni, telefono, correo],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({
              message: "Error al actualizar los datos del usuario",
              error: err,
            });
        }
        // Si se actualizó correctamente, devolver los datos actualizados
        db.query(
          `SELECT * FROM usuarios WHERE Correo = ?`,
          [correo],
          (err, rows) => {
            if (err) {
              return res
                .status(500)
                .json({
                  message:
                    "Error al obtener los datos actualizados del usuario",
                  error: err,
                });
            }
            res.status(200).json(rows[0]); // Devolver solo el primer registro (suponiendo que haya solo uno con el mismo correo)
          }
        );
      }
    );
  };

  cambiarRol = async (req, res) => {
    const { usuarioCorreo, nuevoRol } = req.body;

    try {
        db.query(
            "UPDATE usuarios SET rol = ? WHERE Correo = ?",
            [nuevoRol, usuarioCorreo],
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error al cambiar el rol del usuario",
                        error: err,
                    });
                }

                res.status(200).json({
                    message: 'Rol cambiado con éxito para el usuario ${usuarioCorreo}',
                });
            }
        );
    } catch (error) {
        console.error("Error al cambiar el rol del usuario:", error);
        res.status(500).json({
            message: "Error al cambiar el rol del usuario",
            error: error.message,
        });
    }
};

  // Eliminar un usuario

  eliminarUsuario = async (req, res) => {
    const { usuarioCorreo } = req.params;
    console.log(`Intentandoooo eliminar usuario con correo: ${usuarioCorreo}`);
    const getUserRoleQuery = "SELECT rol FROM usuarios WHERE Correo = ?";

    db.query(getUserRoleQuery, [usuarioCorreo], (error, results) => {
      if (error) {
        console.error("Error al obtener el rol del usuario:", error);
        return res
          .status(500)
          .json({ message: "Error al obtener el rol del usuario", error });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const userRole = results[0].rol;

      if (userRole === "voluntario") {
        const updateFilialStatusQuery =
          'UPDATE filial SET estado = "inactiva", fk_idUsuarioVoluntario = NULL WHERE fk_idUsuarioVoluntario = ?';
        db.query(
          updateFilialStatusQuery,
          [usuarioCorreo],
          (updateError, updateResults) => {
            if (updateError) {
              console.error(
                "Error al actualizar el estado de la filial:",
                updateError
              );
              return res
                .status(500)
                .json({
                  message: "Error al actualizar el estado de la filial",
                  updateError,
                });
            }

            const deleteUserQuery = "DELETE FROM usuarios WHERE Correo = ?";
            db.query(
              deleteUserQuery,
              [usuarioCorreo],
              (deleteError, deleteResults) => {
                if (deleteError) {
                  console.error("Error al eliminar el usuario:", deleteError);
                  return res
                    .status(500)
                    .json({
                      message: "Error al eliminar el usuario",
                      deleteError,
                    });
                }
                res.sendStatus(200);
              }
            );
          }
        );
      } else {
        const deleteUserQuery = "DELETE FROM usuarios WHERE Correo = ?";
        db.query(
          deleteUserQuery,
          [usuarioCorreo],
          (deleteError, deleteResults) => {
            if (deleteError) {
              console.error("Error al eliminar el usuario:", deleteError);
              return res
                .status(500)
                .json({ message: "Error al eliminar el usuario", deleteError });
            }
            res.sendStatus(200);
          }
        );
      }
    });
  };
}

module.exports = new UsersController();
