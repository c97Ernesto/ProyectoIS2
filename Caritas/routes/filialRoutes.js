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
   .route("/asignarVoluntario")
   .post(filialController.asignarVoluntarioFilial);

router
   .route("/reasignarVoluntario")
   .post(filialController.reasignarVoluntario);


router
   .route("/horarios/:filialId")
   .get(filialController.obtenerLosHorariosDeUnaFilial);

router
   .route("/detalles")
   .get(filialController.obtenerDetallesFiliales);

router
   .route("/detalles/:id")
   .get(filialController.obtenerDetallesFilial);


// Nueva ruta para obtener ofertas pendientes
router
  .route("/truequesPendientes")
  .get(filialController.obtenerTruequesPendientes);

router
   .route("/horarios/:filialId/:productoId")
   .get(filialController.obtenerLosHorariosDeUnaFilial);
   
module.exports = router;
