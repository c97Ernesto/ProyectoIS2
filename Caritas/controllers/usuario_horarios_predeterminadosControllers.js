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

  establecerHorarioPredeterminado(req, res) {
    const { horario } = req.body; 
    const correoUsuario = obtenerCorreoUsuario(req);

    // Verificar si se proporcionó un horario
    if (!horario || !horario.id) {
        return res.status(400).json({ success: false, message: 'No se ha proporcionado un horario válido.' });
    }

    db.query('INSERT INTO usuarios_horarios_predeterminados (fk_usuario_correo, fk_horario_id, fk_filial_id) VALUES (?, ?, ?)', 
      [correoUsuario, horario.id, horario.fk_IdFilial], (err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        return res.json({ success: true, horario });
    });
  }

  obtenerHorariosPredeterminados(req, res) {
    const correoUsuario = obtenerCorreoUsuario(req);
    const correoUsuarioPublicacionObjetivo = req.query.correoUsuarioPublicacionObjetivo;

    db.query('SELECT h.* FROM horario h JOIN usuarios_horarios_predeterminados uhp ON h.id = uhp.fk_horario_id WHERE uhp.fk_usuario_correo = ?', 
      [correoUsuarioPublicacionObjetivo], (err, results) => {
      if (err) {
          return res.status(500).json({ message: err.message });
      }
      console.log(results);
      return res.json({ success: true, horarios: results });
    });
  }

  obtenerHorarioId(req, res) {
    const idHorario = req.query.idHorario;

    if (!idHorario) {
        return res.status(400).json({ success: false, message: 'No se ha proporcionado un ID de horario.' });
    }

    db.query('SELECT * FROM horario WHERE id = ?', 
      [idHorario], (err, results) => {
      if (err) {
          return res.status(500).json({ message: err.message });
      }
      if (results.length === 0) {
          return res.status(404).json({ success: false, message: 'Horario no encontrado.' });
      }
      console.log(results);
      return res.json({ success: true, horarios: results });
    });
  }
}

module.exports = new Usuario_Horarios_PredeterminadosControllers();
