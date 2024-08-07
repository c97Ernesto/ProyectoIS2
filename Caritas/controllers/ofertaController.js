const fs = require("fs");
const path = require("path");
const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

// Esta función decodifica el token y extrae el correo electrónico del usuario
function obtenerCorreoUsuarioDesdeToken(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, caritas);
  return decodedToken.correo;
}

// Función para obtener un usuario a partir de su correo electrónico
function obtenerUsuarioPorCorreo(correo) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM usuarios WHERE Correo = ?', [correo], (error, results) => {
      if (error) {
        console.error('Error al obtener el usuario:', error);
        return reject(error);
      }
      if (results.length === 0) {
        console.error('Usuario no encontrado:', correo);
        return reject(new Error('Usuario no encontrado'));
      }

      resolve(results[0]);
    });
  });
}

function obtenerHorarioPorId(horarioId) {
  return new Promise((resolve, reject) => {
    db.query('SELECT fechaHora FROM horario WHERE id = ?', [horarioId], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.length === 0) {
        return resolve(null);
      }
      resolve(results[0]);
    });
  });
}

// Función para obtener un producto a partir de su ID
function obtenerProductoPorId(idProducto) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM publicacion WHERE id = ?', [idProducto], (error, results) => {
      if (error) {
        console.error('Error al obtener el producto:', error);
        return reject(error);
      }
      if (results.length === 0) {
        console.error('Producto no encontrado:', idProducto);
        return reject(new Error('Producto no encontrado'));
      }

      resolve(results[0]);
    });
  });
}


class OfertaController {
  realizarOferta(req, res) {
    const { idProductoObjetivo, idProductoOfertante, filialId, horario } = req.body;
    const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

    //const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

    obtenerUsuarioPorCorreo(correoUsuario)
      .then(userOfertante => {
        if (!userOfertante) {
          throw new Error('Usuario ofertante no encontrado');
        }

        return Promise.all([
          userOfertante,
          obtenerProductoPorId(idProductoObjetivo)
        ]);
      })
      .then(([userOfertante, productoObjetivo]) => {
        if (!productoObjetivo) {
          throw new Error('Producto objetivo no encontrado');
        }

        return Promise.all([
          userOfertante,
          productoObjetivo,
          obtenerUsuarioPorCorreo(productoObjetivo.fk_usuario_correo),
          obtenerHorarioPorId(horario) // Añadir esta consulta para obtener el horario específico
        ]);
      })
      .then(([userOfertante, productoObjetivo, userReceptor, horarioDetalle]) => {
        if (!userReceptor) {
          throw new Error('Usuario receptor no encontrado');
        }

        if (!horarioDetalle) {
          throw new Error('Horario no encontrado');
        }

        const estado = 'pendiente';
        const fechaIntercambio = horarioDetalle.fechaHora;

        db.query(
          'INSERT INTO ofertas (dni_ofertante, nombre_ofertante, dni_receptor, nombre_receptor, id_producto_ofertante, id_producto_receptor, id_filial, estado, fecha_intercambio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [userOfertante.DNI, userOfertante.Nombre, userReceptor.DNI, userReceptor.Nombre, idProductoOfertante, idProductoObjetivo, filialId, estado, fechaIntercambio],
          (err, result) => {
            if (err) {
              console.error('Error al realizar la oferta:', err.message);
              return res.status(400).send(err.message);
            }
            return res.status(201).json({ message: 'Oferta realizada con éxito', id: result.insertId });
          }
        );
      })
      .catch(error => {
        console.error('Error al realizar la oferta:', error.message);
        res.status(500).json({ error: 'Error al realizar la oferta' });
      });
  }


  obtenerOferta(req, res) {
    const idOferta = req.params.id
    try {
      db.query(`SELECT * FROM ofertas WHERE id = ?`, [idOferta], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          return res.status(404).send('Oferta no encontrada');
        }

        res.redirect(`/visualizarOferta.html?id=${idOferta}`);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  obtenerOfertaDetalles(req, res) {
    const idOferta = req.params.id
    try {
      db.query(`SELECT * FROM ofertas WHERE id = ?`, [idOferta], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          return res.status(404).send('Oferta no encontrada');
        }
        console.log(rows)
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  aceptarOferta(req, res) {
    const { id } = req.params;
    try {
      db.query('UPDATE ofertas SET estado = "Aceptada" WHERE id = ?', [id]);

      res.status(200).json({ message: 'Oferta aceptada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al aceptar la oferta', error });
    }
  };

  rechazarOferta(req, res) {
    const { id } = req.params;
    try {
      db.query('UPDATE ofertas SET estado = "Rechazada" WHERE id = ?', [id]);

      res.status(200).json({ message: 'Oferta rechazada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al rechazar la oferta', error });
    }
  };


  obtenerOfertasDeFilial(req, res) {
    const { filialId } = req.params;

    console.log(filialId);

    try {
      db.query(`SELECT * FROM ofertas WHERE id_filial = ?`, [filialId], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          console.log('No hay ofertas para la filial con id: ' + filialId);
          return res.status(200).json(rows);
        }
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  eliminarOfertasDeFilial(req, res) {
    const { filialId } = req.params;

    console.log(filialId);

    try {
      db.query(`DELETE FROM ofertas WHERE id_filial = ?`, [filialId], (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (result.affectedRows === 0) {
          console.log('No hay ofertas para la filial con id: ' + filialId);
          return res.status(200).json({ message: 'No hay ofertas para la filial con id: ' + filialId });
        }
        console.log('Hay ofertas para la filial con id: ' + filialId);
        return res.status(200).json({ message: 'Ofertas eliminadas correctamente para la filial con id: ' + filialId });
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  obtenerOfertasAceptadasDeFilial(req, res) {
    const { filialId } = req.params;

    console.log(filialId);

    try {
      db.query(`SELECT * FROM ofertas WHERE id_filial = ? AND estado = 'aceptada'`, [filialId], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          console.log('No hay ofertas aceptadas para la filial con id: ' + filialId);
          return res.status(200).json(rows);
        }
        console.log('Hay ofertas aceptadas para la filial con id: ' + filialId);
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  eliminarOfertasAceptadasDeFilial(req, res) {
    const { filialId } = req.params;

    console.log(filialId);

    try {
      db.query(`DELETE FROM ofertas WHERE id_filial = ? AND estado = 'aceptada'`, [filialId], (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (result.affectedRows === 0) {
          console.log('No hay ofertas aceptadas para la filial con id: ' + filialId);
          return res.status(200).json({ message: 'No hay ofertas para la filial con id: ' + filialId });
        }
        console.log('Hay ofertas aceptadas para la filial con id: ' + filialId);
        return res.status(200).json({ message: 'Ofertas eliminadas correctamente para la filial con id: ' + filialId });
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  obtenerOfertasPorDni(req, res) {
    const { dni } = req.params;

    try {
      db.query(`SELECT * FROM ofertas WHERE dni_ofertante = ?`, [dni], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          console.log('No hay ofertas para el usuario con dni: ' + dni);
          return res.status(200).json(rows);
        }
        console.log('Hay ofertas para el usuario con dni: ' + dni);
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  eliminarOfertasPorDni(req, res) {
    const { dni } = req.params;

    console.log(dni);

    try {
      db.query(`DELETE FROM ofertas WHERE dni_ofertante = ?`, [dni], (err, result) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (result.affectedRows === 0) {
          console.log('No hay ofertas para el Usuario con Dni: ' + dni);
          return res.status(200).json({ message: 'No hay ofertas para el Usuario con Dni: ' + dni });
        }
        console.log('No hay ofertas para el Usuario con Dni: ' + dni);
        return res.status(200).json({ message: 'Ofertas eliminadas correctamente para el Usuario con Dni: ' + dni });
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  eliminar(req, res) {
    const { id } = req.params;
    try {
      db.query(`DELETE FROM ofertas WHERE id = ?`, [id], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        res.status(201).json(rows);
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = new OfertaController();