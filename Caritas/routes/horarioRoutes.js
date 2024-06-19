const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router
   .route("/verificarHorarios")
   .get(horarioController.verificarDisponibilidad);

router
   .route("/verificarDisponibilidadHorario")
   .get(horarioController.verificarDisponibilidadId);

router
   .route("/confirmar")
   .post(horarioController.confirmarHorario);

router
   .route("/confirmarHorarioId")
   .post(horarioController.confirmarHorarioMedianteId);


module.exports = router;
