const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');


router
  .route("/")
  .get(usersController.obtenerUsuarios);

router
  .route("/misDatos")
  .get(usersController.obtenerMisDatos)
  .put(usersController.actualizarMisDatos);

router
  .route("/voluntarios")
  .get(usersController.obtenerUsuariosVoluntarios);

router
  .route("/sinVoluntarios")
  .get(usersController.obtenerUsuariosSinVoluntarios);


router
  .route("/:usuarioCorreo")
  .get(usersController.obtenerUsuarioPorCorreo)
  .delete(usersController.eliminarUsuario);

router
  .route("/cambiarRol")
  .post(usersController.cambiarRol);

module.exports = router;
