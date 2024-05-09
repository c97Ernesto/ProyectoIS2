const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const db = require('../database/conexion.js');


app.use(cors());
app.use(bodyParser.json());
const secretKey = "codigo secreto";

app.post("/registrar", async (req, res) => {
  var { correo, password, usuario, nombre, apellido, nacimiento, dni, tlf } =
    req.body;
  try {
    var contraseña = await bcrypt.hash(password, 10); // 10 es el número de rondas de encriptación
    // Actualizar el objeto userData con la contraseña encriptada
    password = contraseña;
    // Aquí puedes almacenar el nombre de usuario y la contraseña en tu base de datos
    console.log("Usuario a registrar:", {
      correo,
      contraseña,
      usuario,
      nombre,
      apellido,
      nacimiento,
      dni,
      tlf,
    });

    // Aquí debemos verificar las credenciales del usuario en tu base de datos
    db.query(
      "SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?",
      [correo],
      (err, results) => {
        if (err) {
          console.error("Error al verificar el correo:", err);
          return;
        }
        if (results[0].count > 0) {
          console.log("El correo ya está registrado");
          return;
        }

        // Insertar nuevo usuario si el correo no está registrado
        db.query(
          "INSERT INTO usuarios (Correo, Contraseña, Usuario, Nombre, apellido, nacimiento, DNI, Telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [correo, contraseña, usuario, nombre, apellido, nacimiento, dni, tlf],
          (err, results) => {
            if (err) {
              console.error("Error al guardar el usuario:", err);
              return;
            }
            console.log("Usuario guardado exitosamente");
          }
        );
      }
    );
    // Generar un token JWT con una expiración de 1 hora
    const token = jwt.sign({ correo }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ message: "Autenticación exitosa", token });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});
app.listen(PORT, () => {
  console.log(
    `Servidor Express en ejecución en http://localhost:${PORT}/registrar`
  );
});
