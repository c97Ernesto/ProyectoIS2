const express = require('express');
const router = express.Router();
const truequeController = require('../controllers/truequeController');


router
  .route("/registrar")
  .post(truequeController.registrarEstadoTrueque)
  
router
  .route("/de-la-filial/:idFilial")
  .get(truequeController.obtenerTruequesDeFilial)

router
  .route("/del-usuario/:dni")
  .get(truequeController.obtenerTruequesPorDni)

module.exports = router;