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
app.get('/perfilVoluntario', (req, res) => {
  const filePath = path.join(__dirname, '..', 'perfilVoluntario.html');
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

app.get('/ofertas-enviadas', (req, res) => {
  const filePath = path.join(__dirname, '..', 'ofertas-enviadas.html');
  res.sendFile(filePath);
});

app.get('/ofertas-recibidas', (req, res) => {
  const filePath = path.join(__dirname, '..', 'ofertas-recibidas.html');
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
      const token = jwt.sign({ correo: usuario.Correo, rol: rol }, secretKey, { expiresIn: '1h' });

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

    // Obtener la contraseña del primer usuario encontrado
    const contraseña = results[0].Contraseña;

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey('keySG.fxqSbXGJS-Wxj_s0OM_gRg.lcOpQbQJQ70kDXGmzrqNWLFUrSWpDEIJka-UZ8i9gzk');

    const msg = {
        to: correo, // Cambiar por el destinatario
        from: 'prueba2003123@gmail.com', // Cambiar por el remitente verificado
        subject: 'Recuperación de Contraseña',
        text: `Esta es su contraseña: ${contraseña}`,
        html: `<strong>Recuperación</strong><br/>Esta es su contraseña: ${contraseña}`,
    };

  sgMail
      .send(msg)
      .then(() => {
          console.log('Correo enviado');
          return res.status(200).json({ success: true, message: 'Correo electrónico enviado.' });
      })
      .catch((error) => {
          console.error("Hubo un error: ", error);
          return res.status(500).json({ success: false, message: 'Error al enviar el correo electrónico.' });
      });
});
});

app.post('/ofertas-enviadas', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
      console.error('No se proporcionó un token en los encabezados');
      return res.status(401).send('No se proporcionó un token en los encabezados');
  }

  const accessToken = token.split(' ')[1]; // Extraer el token del encabezado
  try {
      const decodedToken = jwt.verify(accessToken, 'codigo secreto');
      const email = decodedToken.correo;

      // Realizar la consulta para obtener el DNI del usuario basado en el correo electrónico
      const query = 'SELECT dni FROM usuarios WHERE correo = ?';
      db.query(query, [email], (err, results) => {
          if (err) {
              console.error('Error al obtener el DNI:', err);
              return res.status(500).send('Error al obtener el DNI');
          }
          if (results.length === 0) {
              return res.status(404).send('Usuario no encontrado');
          }
          const dni = results[0].dni;

          // Consultar ofertas enviadas usando el DNI obtenido
          const queryEnv = 'SELECT * FROM ofertas WHERE dni_ofertante = ?';
          db.query(queryEnv, [dni], (errEnv, resultsEnv) => {
              if (errEnv) {
                  console.error('Error fetching data:', errEnv);
                  return res.status(500).send('Error fetching data');
              }
              res.json(resultsEnv);
          });
      });
  } catch (error) {
      console.error('Error al verificar y decodificar el token:', error);
      return res.status(401).send('Token inválido');
  }
});

app.post('/ofertas-recibidas', async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
      console.error('No se proporcionó un token en los encabezados');
      return res.status(401).send('No se proporcionó un token en los encabezados');
  }

  const accessToken = token.split(' ')[1]; // Extraer el token del encabezado
  try {
      const decodedToken = jwt.verify(accessToken, 'codigo secreto');
      const email = decodedToken.correo;

      // Realizar la consulta para obtener el DNI del usuario basado en el correo electrónico
      const query = 'SELECT dni FROM usuarios WHERE correo = ?';
      db.query(query, [email], (err, results) => {
          if (err) {
              console.error('Error al obtener el DNI:', err);
              return res.status(500).send('Error al obtener el DNI');
          }
          if (results.length === 0) {
              return res.status(404).send('Usuario no encontrado');
          }
          const dni = results[0].dni;

          // Consultar ofertas recibidas usando el DNI obtenido
          const queryRec = 'SELECT * FROM ofertas WHERE dni_receptor = ?';
          db.query(queryRec, [dni], (errRec, resultsRec) => {
              if (errRec) {
                  console.error('Error fetching data:', errRec);
                  return res.status(500).send('Error fetching data');
              }
              res.json(resultsRec);
          });
      });
  } catch (error) {
      console.error('Error al verificar y decodificar el token:', error);
      return res.status(401).send('Token inválido');
  }
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

const horarioRoutes = require("../routes/horarioRoutes.js");
app.use("/horario", horarioRoutes);

const usuario_horarios_predeterminadosRoutes = require("../routes/usuario_horarios_predeterminadosRoutes.js");
app.use("/usuarios_horarios_predeterminados", usuario_horarios_predeterminadosRoutes);