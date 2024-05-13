const express = require("express");

//obtengo router en lugar de app, porque solo quiero las funcionalidades de las rutas
const router = express.Router();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
//obtenemos controladores
const publicacionController = require("../controllers/publicacionController.js");
//obtenemos la conexión a la bd

const db = require("../database/conexion.js");

//buscamos los datos de las publicaciones
router
  .route("/")
  .get(publicacionController.consultar)
  .post(publicacionController.ingresar);

//buscamos los datos de una publicación mediante id
router
  .route("/:id")
  .get(publicacionController.consultarDetalles)
  .put(publicacionController.actualizar)
  .delete(publicacionController.borrar);

const isAuthenticate = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        "codigo secreto"
      );
      db.query(
        "SELECT * FROM usuarios WHERE correo = ?",
        [decodificada.correo],
        (error, results) => {
          if (error) {
            console.error(error);
            return next(error);
          }
          if (!results || results.length === 0) {
            return next();
          }
          req.usuario = results[0];
          return next();
        }
      );
    } catch (error) {
      console.error(error);
      return next(error);
    }
  } else {
    res.redirect("/login");
  }
};
//buscamos la publicación de un usuario
router
  .route("/miPublicacion/:id")
  .get(isAuthenticate, publicacionController.consultarDetalles);

module.exports = router;
