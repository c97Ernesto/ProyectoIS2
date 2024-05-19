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

class PublicacionController {
  constructor() {}

  //Obtenemos todas las publicaciones
  consultar(req, res) {
    try {
      db.query(`SELECT * FROM publicacion`, (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(200).json(rows);
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //Ingresamos una nueva publicación
  ingresar(req, res) {
    try {
      const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

      //desestructuramos los datos
      console.log(req.body);
      const { nombrePublicacion, descripcion, urlImagen, estado, categoria } =
        req.body;
      const descripcionFinal = descripcion || "";

      //retornamos datos de la publicación
      db.query(
        `INSERT INTO publicacion (nombre, descripcion, imagenes, estado, categoria, fk_usuario_correo)
        VALUES (?, ?, ?, ?, ?, ?);`,
        [
          nombrePublicacion,
          descripcionFinal,
          urlImagen,
          estado,
          categoria,
          correoUsuario,
        ],
        (err, rows) => {
          if (err) {
            console.log(err.message);
            console.log(rows);
            return res.status(400).send(err.message);
          }
          console.log(rows);
          return res.status(201).json({ id: rows.insertId });
        }
      );
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  //Obtenemos la información de la publicación según el id recibido y devolvemos un JSON

  consultarDetalles(req, res) {
    const { id } = req.params;
    try {
      db.query(`SELECT * FROM publicacion WHERE id = ?`, [id], (err, rows) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        // Lee el contenido del archivo detallePublicacion.html
        fs.readFile(
          path.join(__dirname, "../miPublicacion.html"),
          "utf8",
          (err, data) => {
            if (err) {
              return res.status(500).send(err.message);
            }
            // Reemplaza ciertas partes del contenido del archivo con los datos de la publicación
            const contenido = data
              .replace("{{nombre}}", rows[0].nombre)
              .replace("{{descripcion}}", rows[0].descripcion)
              .replace("{{imagenes}}", rows[0].imagenes)
              .replace("{{categoria}}", rows[0].categoria)
              .replace("{{estado}}", rows[0].estado);

            // Envía el contenido modificado como respuesta al cliente
            res.send(contenido);
          }
        );
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //actualizamos una publicación
  actualizar(req, res) {
    const { id } = req.params;
    try {
      const { nombre, descripcion, imagenes, estado, categoria } = req.body;
      db.query(
        `UPDATE publicacion 
        SET nombre = ?, descripcion = ?, imagenes = ?, estado = ?, categoria = ?
        WHERE id = ?`,
        [nombre, descripcion, imagenes, estado, categoria, id],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          res.status(201).json(rows);
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //eliminamos una publicación
  borrar(req, res) {
    const { id } = req.params;
    try {
      db.query(`DELETE FROM publicacion WHERE id = ?`, [id], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(201).json(rows);
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //consultar las publicaciones de un usuario
  consultarPublicacionDeUsuario(req, res) {
    const { correo, id } = req.params; // Suponiendo que tanto el correo como el ID se pasan como parámetros en la URL
    try {
      db.query(
        `SELECT * FROM publicacion WHERE usuario_correo = ? AND id = ?`,
        [correo, id],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          res.status(200).json(rows);
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  //consultar todas las publicacioens de un usuario
  consultarPublicacionesDeUsuario(req, res) {
    try {
      const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);
      db.query(
        "SELECT * FROM publicacion WHERE fk_usuario_correo = ?",
        [correoUsuario],
        (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          return res.status(200).json(rows);
        }
      );
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  consultarPublicacionesAgenas(req, res) {
    console.log("publicacionesagenas");
    try {
      let query = "SELECT * FROM publicacion";
      const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

      console.log("publicaionAgenas");

      if (correoUsuario) {
        console.log("hayCorreousuario" + correoUsuario);
        query += " WHERE fk_usuario_correo <> ?";
        db.query(query, [correoUsuario], (err, rows) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          return res.status(200).json(rows);
        });
      }
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }
}

module.exports = new PublicacionController();
