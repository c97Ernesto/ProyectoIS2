const express = require("express");

//obtengo router en lugar de app, porque solo quiero las funcionalidades de las rutas
const router = express.Router();
//obtenemos controladores
const publicacionController = require("../controllers/publicacionController");

//buscamos los datos de las publicaciones
router
  .route("/")
  .get(publicacionController.consultar)
  .post(publicacionController.ingresar)

router
  .route("/ofertas")
  .get(publicacionController.consultarPublicacionesAgenas)

router
  .route("/misPublicaciones")
  .get(publicacionController.consultarPublicacionesDeUsuario);

//buscamos los datos de una publicación mediante id
router
  .route("/:id")
  .get(publicacionController.consultarDetalles)
  .put(publicacionController.actualizar)
  .delete(publicacionController.borrar);

// Ruta para obtener publicaciones por categoría
router
  .route("/misPublicaciones/categoria/:categoria")
  .get(publicacionController.consultarPublicacionPorCategoria);
  
// Nueva ruta para obtener productos de la misma categoría del usuario logueado
router
   .route("/buscarPorCategoriaPropio/:categoria")
   .get(publicacionController.consultarPublicacionPorCategoriaPropio);

router
   .route("/buscarPublicacionesAutenticado/:id")
   .get(publicacionController.consultarDetallesAutenticado);

module.exports = router;
