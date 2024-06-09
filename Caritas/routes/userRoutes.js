const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router
  .route("/")
  .get(usersController.obtenerUsuarios);

router
  .route("/voluntarios")
  .get(usersController.obtenerUsuariosVoluntarios);

router
  .route("/comunes")
  .get(usersController.obtenerUsuariosComunes);


router
  .route("/:usuarioCorreo")
  .get(usersController.obtenerUsuarioPorCorreo);

router
  .route("/cambiarRol")
  .post(usersController.cambiarRol);

module.exports = router;
