

const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");


function obtenerCorreoUsuario(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.decode(token);
  const correoUsuario = decodedToken.correo; 
  return correoUsuario;
}

class Usuario_Horarios_PredeterminadosControllers {
    constructor() {}

    obtenerHorariosPredetermiandos(req, res){
      const correoUsuario = obtenerCorreoUsuario(req);

    }

    establecerHorarioPredeterminado(req, res) {
      const { horario } = req.body; 
      const correoUsuario = obtenerCorreoUsuario(req);
  
      // Verificar si se proporcionó un horario
      if (!horario || !horario.id) {
          return res.status(400).json({ success: false, message: 'No se ha proporcionado un horario válido.' });
      }
  
      db.query('INSERT INTO usuarios_horarios_predeterminados (fk_usuario_correo, fk_horario_id, fk_filial_id) VALUES (?, ?, ?)', [correoUsuario, horario.id, horario.fk_IdFilial], (err) => {
          if (err) {
              return res.status(500).json({ message: err.message });
          }
          return res.json({ success: true, horario });
      });
  }
}

module.exports = new Usuario_Horarios_PredeterminadosControllers();
