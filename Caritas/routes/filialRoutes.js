const express = require('express');
const router = express.Router();
const filialController = require('../controllers/filialController');

router
  .route("/")
  .get(filialController.obtenerFiliales)
  .post(filialController.cargarFilial);


router
   .route("/elegirFilial")
   .post(filialController.ElegirUnaFilial);

router
   .route("/horarios/:filialId")
   .get(filialController.obtenerLosHorariosDeUnaFilial);


   
module.exports = router;
