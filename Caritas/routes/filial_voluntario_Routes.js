const express = require('express');
const router = express.Router();
const filial_voluntario_Controller = require('../controllers/filial_voluntario_Controller');


router
    .route('/voluntarios-de-filial/:idFilial')
    .get(filial_voluntario_Controller.voluntariosDeFilial);

router
    .route('/filiales-del-voluntario/:idVoluntario')
    .get(filial_voluntario_Controller.filialesDelVoluntario);

module.exports = router;
