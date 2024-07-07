const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');
const caritas = "codigo secreto";
const jwt = require("jsonwebtoken");

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers)
  console.log('Authorization Header:', authHeader); // Agrega esto para depuración

  if (!authHeader) {
    return res.status(403).send('Token no proporcionado');
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(403).send('Formato de token incorrecto');
  }

  const token = parts[1];

  jwt.verify(token, caritas, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token no válido o expirado');
    }
    req.userId = decoded.id; // Guarda la información del usuario en req
    next(); // Pasa al siguiente middleware o ruta
  });
};

// Ruta para realizar una oferta
router
  .route("/")
  .post(ofertaController.realizarOferta)

router.post('/realizarOfertas', (req, res) => ofertaController.realizarOferta(req, res));

router
  .route("/misOfertas/:id")
  .get(ofertaController.obtenerOferta)

router
  .route("/detalles/:id")
  .get(ofertaController.obtenerOfertaDetalles)


router.post('/aceptar/:id', ofertaController.aceptarOferta);
router.post('/rechazar/:id', ofertaController.rechazarOferta);

router
  .route('/ofertas-por-filial/:filialId')
  .get(ofertaController.obtenerOfertasDeFilial)
  .delete(ofertaController.eliminarOfertasDeFilial);

router
  .route('/ofertas-aceptadas-por-filial/:filialId')
  .get(ofertaController.obtenerOfertasAceptadasDeFilial)
  .delete(ofertaController.eliminarOfertasAceptadasDeFilial);

router
  .route('/ofertas-por-dni/:dni')
  .get(ofertaController.obtenerOfertasPorDni)
  .delete(ofertaController.eliminarOfertasPorDni);




module.exports = router;