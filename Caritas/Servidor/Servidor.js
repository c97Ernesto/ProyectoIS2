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

app.post("/registrar", async (req, res) => {
  var { correo, password, usuario, nombre, apellido, nacimiento, dni, tlf, rol } =
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
      rol
    });

    // Aquí debemos verificar las credenciales del usuario en tu base de datos
    db.query(
      "SELECT COUNT(*) AS count FROM usuarios WHERE correo = ?",
      [correo],
      (err, results) => {
        bool = true;
        if (err) {
          console.error("Error al verificar el correo:", err);
          bool=false;
        }
        if (results[0].count > 0) {
          console.log("El correo ya está registrado");
          bool=false;
        }
        if (bool) {
          // Insertar nuevo usuario si el correo no está registrado
          db.query(
            "INSERT INTO usuarios (Correo, Contraseña, Usuario, Nombre, apellido, nacimiento, DNI, Telefono, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [correo, contraseña, usuario, nombre, apellido, nacimiento, dni, tlf, rol],
            (err, results) => {
              if (err) {
                console.error("Error al guardar el usuario:", err);
                return;
              }
              console.log("Usuario guardado exitosamente");
            }
          );     
        }
           
        if(bool){
          res.status(200).json({ message: "Autenticación exitosa" });
        }else {
          res.status(400).json({ message: "Correo ya registrado" });
        }
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
      sgMail.setApiKey('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')
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

app.use("/publicacion", publicacionRoutes);
