const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');

// Ruta para realizar una oferta

router
  .route("/")
  .post(ofertaController.realizarOferta)
  
router.post('/realizarOfertas', (req, res) => ofertaController.realizarOferta(req, res));

module.exports = router;