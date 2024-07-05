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
    .route('/filiales-del-voluntario/:idVoluntario')
    .get(filialVoluntarioController.filialesDelVoluntario);

router
    .route('/filiales-con-el-voluntario/:idVoluntario')
    .get(filialVoluntarioController.filialesConElVoluntario);

module.exports = router;