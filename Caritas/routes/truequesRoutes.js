const express = require('express');
const router = express.Router();
const truequeController = require('../controllers/truequeController');


router
  .route("/registrar")
  .post(truequeController.registrarEstadoTrueque)
  

module.exports = router;