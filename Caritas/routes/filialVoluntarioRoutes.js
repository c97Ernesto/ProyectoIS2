const express = require('express');
const router = express.Router();
const filialVoluntarioController = require('../controllers/filialVoluntarioController');


router
  .route("/asignarVoluntario")
  .post(filialVoluntarioController.asignarVoluntarioFilial);
  
router
  .route("/designarVoluntario")
  .post(filialVoluntarioController.designarVoluntario);

  router
  .route('/voluntarioFilial/:correoUsuario')
  .get(filialVoluntarioController.voluntarioFilial);

module.exports = router;