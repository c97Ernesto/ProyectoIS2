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


router
    .route('/voluntarios-de-filial/:idFilial')
    .get(filialVoluntarioController.voluntariosDeFilial);

router
    .route('/filial-del-voluntario/:idVoluntario')
    .get(filialVoluntarioController.filialDelVoluntario);

module.exports = router;