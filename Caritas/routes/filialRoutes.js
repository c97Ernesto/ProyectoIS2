const express = require('express');
const router = express.Router();
const filialController = require('../controllers/filialController');

router
  .route("/")
  .post(filialController.cargarFilial);


module.exports = router;
