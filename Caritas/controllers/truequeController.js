const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

function obtenerCorreoUsuarioDesdeToken(req) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, caritas);
    const correoUsuario = decodedToken.correo; 
  
    return correoUsuario;
  }

  class TruequeController {
      registrarEstadoTrueque(req, res) {
          const { ofertaId, descripcion, estado,donacion } = req.body;
          const voluntario = obtenerCorreoUsuarioDesdeToken(req);
  
          db.query('SELECT * FROM ofertas WHERE id = ?', [ofertaId], (err, results) => {
              if (err) {
                  console.error('Error al obtener los detalles de la oferta:', err);
                  return res.status(500).json({ message: 'Error al obtener los detalles de la oferta' });
              }
  
              if (results.length === 0) {
                  return res.status(404).json({ message: 'Oferta no encontrada' });
              }
  
              const oferta = results[0];
              const filialId = oferta.id_filial;
  
              db.query('SELECT nombre FROM filial WHERE id = ?', [filialId], (err, filialResults) => {
                  if (err) {
                      console.error('Error al obtener el nombre de la filial:', err);
                      return res.status(500).json({ message: 'Error al obtener el nombre de la filial' });
                  }
  
                  if (filialResults.length === 0) {
                      return res.status(404).json({ message: 'Filial no encontrada' });
                  }
  
                  const filialNombre = filialResults[0].nombre;

                  db.query(
                      `INSERT INTO trueques (descripcion, estado, voluntario, id_oferta, dni_ofertante, nombre_ofertante, dni_receptor, nombre_receptor, id_filial, id_producto_ofertante, id_producto_receptor,nombre_filial, fecha_intercambio, donacion)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                      [
                        descripcion,
                        estado,
                        voluntario,
                        ofertaId,
                        oferta.dni_ofertante,
                        oferta.nombre_ofertante,
                        oferta.dni_receptor,
                        oferta.nombre_receptor,
                        oferta.id_filial,
                        oferta.id_producto_ofertante,
                        oferta.id_producto_receptor,
                        filialNombre,
                        oferta.fecha_intercambio,
                        donacion  
                      ],
                      (err, rows) => {
                          if (err) {
                              console.error('Error al insertar el trueque:', err);
                              return res.status(500).json({ message: 'Error al registrar el trueque' });
                          }
  
                          // Actualiza el estado de la oferta
                          db.query('UPDATE ofertas SET estado = ? WHERE id = ?', ['finalizada', ofertaId], (err, updateResult) => {
                              if (err) {
                                  console.error('Error al actualizar el estado de la oferta:', err);
                                  return res.status(500).json({ message: 'Error al actualizar el estado de la oferta' });
                              }
  
                              res.status(200).json({ message: 'Estado del trueque registrado con éxito' });
                          });
                      }
                  );
              });
          });
      }
  }

module.exports = new TruequeController();