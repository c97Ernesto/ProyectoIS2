const express = require('express');
//obtengo router en lugar de app, porque solo quiero las funcionalidades de las rutas
const router = express.Router();

//obtenemos controladores
const publicacionController = require('../controllers/publicacionController.js')
//obtenemos la conexión a la bd
const db = require('../database/conexion.js');

//buscamos los datos de las publicaciones
router.route("/")
  .get(publicacionController.consultar)
  .post(publicacionController.ingresar);

//buscamos los datos de una publicación mediante id
router.route("/:id")
  .get(publicacionController.consultarDetalles)
  .put(publicacionController.actualizar)
  .delete(publicacionController.borrar);

module.exports = router;