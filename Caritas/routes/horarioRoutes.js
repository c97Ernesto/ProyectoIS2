const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router
   .route("/verificarHorarios")
   .get(horarioController.verificarDisponibilidad);

router
   .route("/confirmar")
   .post(horarioController.confirmarHorario);

module.exports = router;
