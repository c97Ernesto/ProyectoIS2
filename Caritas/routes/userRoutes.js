const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router
  .route("/")
  .get(usersController.obtenerUsuariosVoluntarios);

router
  .route("/voluntarios")
  .get(usersController.obtenerUsuariosVoluntarios);

module.exports = router;
