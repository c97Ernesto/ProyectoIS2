

const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

// Esta función decodifica el token y extrae el correo electrónico del usuario
function obtenerCorreoUsuarioDesdeToken(req) {
  // Obtén el token del encabezado de autorización
  const token = req.headers.authorization.split(" ")[1];

  // Decodifica el token y extrae el correo electrónico
  const decodedToken = jwt.verify(token, caritas);
  const correoUsuario = decodedToken.correo; // Suponiendo que el correo electrónico está almacenado en el token como 'correo'

  return correoUsuario;
}

class Usuario_Horarios_PredeterminadosControllers {
    constructor() {}

    obtenerHorariosPredetermiandos(req, res){
      const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);

    }

    cargarHorariosPredetermiandos(req, res){
      const correoUsuario = obtenerCorreoUsuarioDesdeToken(req);
      const { fechaHora, filial } = req.body;

      db.query(
        'INSERT INTO usuarios_horarios_predeterminados (fk_usuario_correo, fk_horario_id, fk_filial_id) VALUES (?, ?, ?)',
        [correoUsuario, fechaHora, filial],
        (err, result) => {
          if (err) {
            console.error('Error al realizar la oferta:', err.message);
            return res.status(400).send(err.message);
          }
          return res.status(201).json({ message: 'Oferta realizada con éxito',id: result.insertId });
        }
      );
      
    }
}

module.exports = new Usuario_Horarios_PredeterminadosControllers();
