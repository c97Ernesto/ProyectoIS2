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
    const { idProductoObjetivo, idProductoOfertante } = req.body;
    const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

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
          obtenerUsuarioPorCorreo(productoObjetivo.fk_usuario_correo)
        ]);
      })
      .then(([userOfertante, productoObjetivo, userReceptor]) => {
        if (!userReceptor) {
          throw new Error('Usuario receptor no encontrado');
        }
       

        const id_filial = 1; 
        const estado = 'esperando'; 

        db.query(
          'INSERT INTO ofertas (dni_ofertante, nombre_ofertante, dni_receptor, nombre_receptor, id_producto_ofertante, id_producto_receptor, id_filial, estado, fecha_intercambio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [userOfertante.DNI, userOfertante.Nombre, userReceptor.DNI, userReceptor.Nombre, idProductoOfertante, idProductoObjetivo, id_filial, estado,fecha],
          (err, result) => {
            if (err) {
              console.error('Error al realizar la oferta:', err.message);
              return res.status(400).send(err.message);
            }
            return res.status(201).json({ message: 'Oferta realizada con éxito',id: result.insertId });
          }
        );
      })
      .catch(error => {
        console.error('Error al realizar la oferta:', error.message);
        res.status(500).json({ error: 'Error al realizar la oferta' });
      });
  }


  obtenerOferta(req, res){
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

  obtenerOfertaDetalles(req, res){
    const idOferta = req.params.id
    try {
      db.query(`SELECT * FROM ofertas WHERE id = ?`, [idOferta], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          return res.status(404).send('Oferta no encontrada');
        }
        return res.status(200).json(rows);
      }
    );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
}

module.exports = new OfertaController();