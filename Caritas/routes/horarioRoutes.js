const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

// router
//   .route("/")
//   .get(horarioController.obtenerHorarios)
//   .post(horarioController.cargarHorario);


router
   .route("/verificarHorario")
   .get(horarioController.verificarDisponibilidad);

router
   .route("/confirmar")
   .post(horarioController.confirmarHorario);
   
module.exports = router;
