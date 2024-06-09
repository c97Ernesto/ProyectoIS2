const express = require('express');
const router = express.Router();
const usuarios_horarios_predeterminados = require('../controllers/usuario_horarios_predeterminadosControllers');

router
  .route("/")
  .post(usuarios_horarios_predeterminados.establecerHorarioPredeterminado);

module.exports = router;
