const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const db = require('../database/conexion.js');
app.use(bodyParser.json());
const path= require("path");
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
const secretKey = "codigo secreto";
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../')));

app.get('/registrar', (req, res)=> {
    const filePath= path.join(__dirname, '..', 'registro.html');
    res.sendFile(filePath);
})


app.get('/login', (req, res)=> {
    const filePath = path.join(__dirname, '..', 'login.html');
    res.sendFile(filePath);
})

app.get('/perfil', (req, res) => {
  const filePath = path.join(__dirname, '..', 'perfil.html');
  res.sendFile(filePath);
});
app.get('/perfilAdm', (req, res) => {
  const filePath = path.join(__dirname, '..', 'perfilAdm.html');
  res.sendFile(filePath);
});

app.get('/inicio', (req, res) => {
  const filePath = path.join(__dirname, '..', 'inicio.html');
  res.sendFile(filePath);
});

app.get('/misPublicaciones', (req, res) => {
  const filePath = path.join(__dirname, '..', 'misPublicaciones.html');
  res.sendFile(filePath);
});

app.get('/ofertas', (req, res) => {
  const filePath = path.join(__dirname, '..', 'ofertas.html');
  res.sendFile(filePath);
});

app.get('/buscarPorCategoriaPropio', (req, res) => {
  const filePath = path.join(__dirname, '..', 'buscarPorCategoriaPropio.html');
  res.sendFile(filePath);
});

app.post("/registrar", async (req, res) => {
  var { correo, password, usuario, nombre, apellido, nacimiento, dni, tlf, rol } = req.body;
  try {
    var contraseña = await bcrypt.hash(password, 10); // 10 es el número de rondas de encriptación
    password = contraseña;

    console.log("Usuario a registrar:", {
      correo,
      contraseña,
      usuario,
      nombre,
      apellido,
      nacimiento,
      dni,
      tlf,
      rol
    });

    db.query(
      "SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?",
      [correo],
      (err, results) => {
        if (err) {
          console.error("Error al verificar el correo:", err);
          return res.status(500).json({ error: "Error al verificar el correo" });
        }
        if (results[0].count > 0) {
          console.log("El correo ya está registrado");
          return res.status(400).json({ message: "Correo ya registrado" });
        }

        // Insertar nuevo usuario si el correo no está registrado
        db.query(
          "INSERT INTO usuarios (Correo, Contraseña, Usuario, Nombre, apellido, nacimiento, DNI, Telefono, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [correo, contraseña, usuario, nombre, apellido, nacimiento, dni, tlf, rol],
          (err, results) => {
            if (err) {
              console.error("Error al guardar el usuario:", err);
              return res.status(500).json({ error: "Error al guardar el usuario" });
            }
            console.log("Usuario guardado exitosamente");
            res.status(200).json({ message: "Usuario registrado exitosamente" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});



app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  // Consulta a la base de datos para obtener el usuario por correo
  db.query('SELECT * FROM usuarios WHERE Correo = ?', [correo], async (err, results) => {
      if (err) {
          console.error('Error al buscar el usuario:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }

      // Verificar si se encontró el usuario
      if (results.length === 0) {
          return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
      }

      const usuario = results[0];

      // Comparar la contraseña proporcionada con la almacenada en la base de datos
      const passwordMatch = await bcrypt.compare(password, usuario.Contraseña);

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
      }

      const rol = usuario.rol;

      // Generar un token JWT con el rol incluido y una expiración de 1 hora
      const token = jwt.sign({ correo: usuario.Correo, rol }, secretKey, { expiresIn: '1h' });
      console.log(token + rol)

      // Responder con el token JWT, el rol del usuario y un mensaje de éxito
      res.json({ token, rol, message: 'Inicio de sesión exitoso' });
  });
});

app.post('/recuperarContrasena', async (req, res) => {
  const { correo } = req.body;

  // Consulta a la base de datos para obtener el usuario por correo
  db.query('SELECT * FROM usuarios WHERE Correo = ?', [correo], async (err, results) => {
      if (err) {
          console.error('Error al buscar el usuario:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
      }
      // Verificar si no se encontró el usuario
      if (results.length === 0) {
          return res.status(401).json({ error: 'Correo electrónico no registrado' });
      }

      // using Twilio SendGrid's v3 Node.js Library
      // https://github.com/sendgrid/sendgrid-nodejs
      const sgMail = require('@sendgrid/mail')
      sgMail.setApiKey('keySG.fxqSbXGJS-Wxj_s0OM_gRg.lcOpQbQJQ70kDXGmzrqNWLFUrSWpDEIJka-UZ8i9gzk')
      const msg = {
        to: correo, // Change to your recipient
        from: 'prueba2003123@gmail.com', // Change to your verified sender
        subject: 'Recuperación de Contraseña',
        text: 'Por favor, sigue este enlace para restablecer tu contraseña: http://localhost:3000/editarPerfil?token=${token}',
        html: '<strong>Recuperacion</strong>',
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Correo enviado')
          return res.status(200).json({ success: true, message: 'Correo electrónico enviado.' });
        })
        .catch((error) => {
          console.error("Hubo un error: ",error)
          return res.status(500).json({ success: false, message: 'Error al enviar el correo electrónico.' });
        })
  });
});

app.listen(PORT, () => {
  console.log(
    `Servidor Express en ejecución en http://localhost:${PORT}`
  );
});
const publicacionRoutes = require("../routes/publicacionRoutes");
const filialRoutes = require("../routes/filialRoutes");
const userRoutes = require("../routes/userRoutes");

app.use("/publicacion", publicacionRoutes);

const ofertaRoutes = require("../routes/ofertaRoutes");

app.use("/ofertas", ofertaRoutes);
app.use("/filial", filialRoutes);
app.use("/usuarios",userRoutes);
