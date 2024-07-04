const caritas = "codigo secreto";
const db = require("../database/conexion");
const jwt = require("jsonwebtoken");

function obtenerCorreoUsuario(req) {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.decode(token);
  const correoUsuario = decodedToken.correo;
  return correoUsuario;
}

class filial_voluntario_Controller {
  constructor() { }

  

  filialesDelVoluntario(req, res) {
    const { idVoluntario } = req.params;  // Id === Correo, del usuario

    console.log(idVoluntario);

    try {
      db.query(`SELECT * FROM filial_voluntario WHERE id_voluntario = ?`, [idVoluntario], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          console.log('No hay filiales para el usuario con correo: ' + idVoluntario);
          return res.status(200).json(rows);
        }
        console.log('Hay filiales para el usuario con correo: ' + idVoluntario);
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  voluntariosDeFilial(req, res) {
    const { idFilial } = req.params;  // Id === Correo, del usuario
    console.log(idFilial);
    try {
      db.query(`SELECT * FROM filial_voluntario WHERE id_filial = ?`, [idFilial], (err, rows) => {
        if (err) {
          res.status(400).send(err.message);
        }
        if (rows.length === 0) {
          console.log('No hay voluntarios para la filial con Id: ' + idFilial);
          return res.status(200).json(rows);
        }
        console.log('Hay voluntarios para la filial con Id: ' + idFilial);
        return res.status(200).json(rows);
      }
      );
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

}

module.exports = new filial_voluntario_Controller();
