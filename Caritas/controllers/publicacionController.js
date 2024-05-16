const fs = require('fs');
const path = require('path');

// Resto del código del controlador
const db = require('../database/conexion')

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
      //desestructuramos los datos
      console.log(req.body);
      const { nombrePublicacion, descripcion, urlImagen, estado, categoria, correoUsuario } = req.body;
      const descripcionFinal = descripcion || '';

      //retornamos datos de la publicación
      db.query(
        `INSERT INTO publicacion (id, nombre, descripcion, imagenes, estado, categoria, fk_usuario_correo)
        VALUES (NULL, ?, ?, ?, ?, ?, ?);`,
        [nombrePublicacion, descripcionFinal, urlImagen, estado, categoria, correoUsuario],
        (err, rows) => {
          if (err) {
            res.status(400).send(err.message);
          }
          res.status(201).json({ id: rows.insertId });
        }
      );
    } catch (err) {
      res.status(500).send(err.message);
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
            fs.readFile(path.join(__dirname, '../miPublicacion.html'), 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).send(err.message);
                }
                // Reemplaza ciertas partes del contenido del archivo con los datos de la publicación
                const contenido = data.replace('{{nombre}}', rows[0].nombre)
                                      .replace('{{descripcion}}', rows[0].descripcion)
                                      .replace('{{imagenes}}', rows[0].imagenes)
                                      .replace('{{categoria}}', rows[0].categoria)
                                      .replace('{{estado}}', rows[0].estado);

                // Envía el contenido modificado como respuesta al cliente
                res.send(contenido);
            });
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
  consultarPublicacionesDeUsuario() {}
}

module.exports = new PublicacionController();
