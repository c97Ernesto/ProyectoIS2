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

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

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

app.get('/estadisticas', (req, res) => {
  const filePath = path.join(__dirname, '..', 'estadisticas.html');
  res.sendFile(filePath);
});
app.post('/estadisticas', (req, res) => {
  const { startDate, endDate } = req.body;

  const queries = {
    intercambiosPorFilial: `SELECT f.nombre, COUNT(*) as count 
                          FROM ofertas o 
                          JOIN filial f ON o.id_filial = f.id 
                          WHERE o.fecha_intercambio BETWEEN ? AND ? 
                          GROUP BY f.nombre`,
    publicacionesPorCategoria: `SELECT categoria, COUNT(*) as count FROM publicacion WHERE fecha_publicacion BETWEEN ? AND ? GROUP BY categoria ORDER BY count DESC`,
    donaciones: `SELECT COUNT(*) as count FROM trueques WHERE donacion = 'si' AND fecha_intercambio BETWEEN ? AND ?`,
    intercambiosPorEstado: `SELECT estado, COUNT(*) as count FROM ofertas WHERE fecha_intercambio BETWEEN ? AND ? GROUP BY estado`,
    truequesPorEstado: `SELECT estado, COUNT(*) as count FROM trueques WHERE fecha_intercambio BETWEEN ? AND ? GROUP BY estado`,
    intercambiosPorEstadoYFilial: `SELECT f.nombre AS filial, o.estado, COUNT(*) as count 
                                      FROM ofertas o 
                                      JOIN filial f ON o.id_filial = f.id 
                                      WHERE o.fecha_intercambio BETWEEN ? AND ? 
                                      GROUP BY f.nombre, o.estado`,
    donacionesPorFilial: `SELECT f.nombre, COUNT(*) as count 
                          FROM trueques t 
                          JOIN filial f ON t.id_filial = f.id 
                          WHERE t.donacion = 'si' AND t.fecha_intercambio BETWEEN ? AND ? 
                          GROUP BY f.nombre`
  };

  const results = {};

  const runQuery = (query, key) => {
    return new Promise((resolve, reject) => {
      db.query(query, [startDate, endDate], (error, queryResults) => {
        if (error) {
          return reject(error);
        }
        results[key] = queryResults.length ? queryResults : [];
        resolve();
      });
    });
  };

  Promise.all(Object.keys(queries).map(key => runQuery(queries[key], key)))
    .then(() => res.json(results))
    .catch(error => res.status(500).json({ error: error.message }));
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

    // Generar una nueva contraseña
    const nuevaContrasena = '12345';
    const saltRounds = 10;

    try {
        // Hashé la nueva contraseña
        const hash = await bcrypt.hash(nuevaContrasena, saltRounds);

        // Actualizar la contraseña en la base de datos
        db.query('UPDATE usuarios SET Contraseña = ? WHERE Correo = ?', [hash, correo], (err, results) => {
            if (err) {
                console.error('Error al actualizar la contraseña:', err);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }

            // Enviar el correo con la nueva contraseña
            const msg = {
                to: correo, // Cambiar por el destinatario
                from: 'prueba2003123@gmail.com', // Cambiar por el remitente verificado
                subject: 'Recuperación de Contraseña',
                text: `Esta es su nueva contraseña: ${nuevaContrasena}`,
                html: `<strong>Recuperación</strong><br/>Esta es su nueva contraseña: ${nuevaContrasena}`,
            };

            sgMail
                .send(msg)
                .then(() => {
                    console.log('Correo enviado');
                    return res.status(200).json({ success: true, message: 'Correo electrónico enviado.' });
                })
                .catch((error) => {
                    console.error('Hubo un error:', error);
                    return res.status(500).json({ success: false, message: 'Error al enviar el correo electrónico.' });
                });
        });
    } catch (error) {
        console.error('Error al hashé la contraseña:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
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
              if (resultsEnv.length === 0) {
                  return res.json({ success: false, message: 'Aún no se enviaron ofertas' });
              }
              res.json({ success: true, data: resultsEnv });
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
          const queryRec = `SELECT * FROM ofertas WHERE dni_receptor = ? AND estado <> 'finalizada'`
          db.query(queryRec, [dni], (errRec, resultsRec) => {
              if (errRec) {
                  console.error('Error fetching data:', errRec);
                  return res.status(500).send('Error fetching data');
              }
              if (resultsRec.length === 0) {
                  return res.json({ success: false, message: 'No se han recibido ofertas' });
              }
              res.json({ success: true, data: resultsRec });
          });
      });
  } catch (error) {
      console.error('Error al verificar y decodificar el token:', error);
      return res.status(401).send('Token inválido');
  }
});

app.post('/copiarYEliminarPublicacion', (req, res) => {
  const { id } = req.body;

  // Paso 1: Obtener los datos de la publicación
  db.query('SELECT * FROM publicacion WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener la publicación:', err);
      return res.status(500).json({ success: false, message: 'Error al obtener la publicación' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
    }

    const publicacion = results[0];

    // Paso 2: Copiar los datos a la tabla publicacion_borrada
    const insertQuery = 'INSERT INTO publicacion_borrada (id, nombre, descripcion, imagenes, estado, categoria, fk_usuario_correo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const insertValues = [publicacion.id, publicacion.nombre, publicacion.descripcion, publicacion.imagenes, publicacion.estado, publicacion.categoria, publicacion.fk_usuario_correo];

    db.query(insertQuery, insertValues, (err, results) => {
      if (err) {
        console.error('Error al insertar la publicación en publicacion_borrada:', err);
        return res.status(500).json({ success: false, message: 'Error al copiar la publicación' });
      }

      // Paso 3: Eliminar las ofertas relacionadas
      db.query('DELETE FROM ofertas WHERE id_producto_ofertante = ? OR id_producto_receptor = ?', [id, id], (err, results) => {
        if (err) {
          console.error('Error al eliminar ofertas relacionadas:', err);
          return res.status(500).json({ success: false, message: 'Error al eliminar ofertas relacionadas' });
        }
      // 3 y medio, eliminar comentarios
      db.query(sql, [publicacionId], (err, result) => {
        if (err) {
          console.error('Error al borrar comentarios:', err);
          return res.status(500).json({ error: 'Error al borrar comentarios en la base de datos' });
        }
        // Paso 4: Eliminar la publicación original
        db.query('DELETE FROM publicacion WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.error('Error al eliminar la publicación original:', err);
            return res.status(500).json({ success: false, message: 'Error al eliminar la publicación' });
          }

          res.json({ success: true, message: 'Publicación y ofertas relacionadas eliminadas con éxito' });
        });
      })
      });
    });
  });
});

app.post('/editarPublicacion', (req, res) => {
  const { nombre, descripcion, imagenes, estado, id  } = req.body;

  console.log(id)
  // Consulta para actualizar la publicación
  const updateQuery = `
    UPDATE publicacion 
    SET 
      nombre = ?, 
      descripcion = ?, 
      imagenes = ?, 
      estado = ?
    WHERE id = ?`;

  const updateValues = [nombre, descripcion, imagenes, estado, id];

  db.query(updateQuery, updateValues, (err, results) => {
    if (err) {
      console.error('Error al actualizar la publicación:', err);
      return res.status(500).json({ success: false, message: 'Error al actualizar la publicación' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Publicación no encontrada' });
    }

    res.json({ success: true, message: 'Publicación actualizada con éxito' });
  });
});

app.get('/obtenerPublicacion/:idPublicacion', (req, res) => {
  const { idPublicacion } = req.params;

  // Ejemplo de respuesta de la publicación (simulación)
  const publicacion = {
      id: idPublicacion,
      nombre: 'Nombre de la publicación',
      descripcion: 'Descripción de la publicación',
      categoria: 'Categoría de la publicación'
  };

  res.json(publicacion);
});

// Endpoint para obtener comentarios por ID de publicación
app.get('/obtenerComentarios/:idPublicacion', (req, res) => {
  const { idPublicacion } = req.params;

  // Consulta SQL para obtener los comentarios de la publicación específica
  const sql = 'SELECT * FROM comentarios WHERE publicacion_id = ?';
  db.query(sql, [idPublicacion], (err, result) => {
      if (err) {
          console.error('Error al obtener comentarios:', err);
          return res.status(500).json({ error: 'Error al obtener comentarios de la base de datos' });
      }

      // Formatear resultados y enviar como respuesta
      const comentarios = result.map(row => ({
          id: row.id,
          publicacion_id: row.publicacion_id,
          texto: row.texto,
          usuarioCorreo: row.user_email
      }));

      res.json(comentarios);
  });
});

app.get('/obtenerCorreoPorPublicacion/:publicacionId', (req, res) => {
  const { publicacionId } = req.params;

  const sql = `
    SELECT u.correo
    FROM publicacion p
    JOIN usuarios u ON p.fk_usuario_correo = u.correo
    WHERE p.id = ?;
  `;

  db.query(sql, [publicacionId], (err, result) => {
    if (err) {
      console.error('Error al obtener el correo asociado a la publicación:', err);
      return res.status(500).json({ error: 'Error al obtener el correo asociado a la publicación' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const correo = result[0].correo;
    res.status(200).json({ correo });
  });
});


app.post('/guardarRespuesta', (req, res) => {
  const { comentarioId, respuesta } = req.body;

  // Verificar que los datos necesarios estén presentes
  if (!comentarioId || !respuesta) {
      return res.status(400).json({ error: 'Faltan datos requeridos para guardar la respuesta' });
  }

  // Verificar si ya existe una respuesta para el comentario
  const sqlCheck = 'SELECT COUNT(*) AS count FROM comentarios WHERE id = ? AND respuesta IS NOT NULL';

  db.query(sqlCheck, [comentarioId], (err, rows) => {
      if (err) {
          console.error('Error al verificar la existencia de respuestas:', err);
          return res.status(500).json({ error: 'Error al verificar la existencia de respuestas en la base de datos' });
      }

      const existingRespuestasCount = rows[0].count;

      if (existingRespuestasCount > 0) {
          return res.status(400).json({ error: 'Ya existe una respuesta para este comentario' });
      }

      // Insertar la respuesta en la base de datos
      const sqlInsert = 'UPDATE comentarios SET respuesta = ? WHERE id = ?';

      db.query(sqlInsert, [respuesta, comentarioId], (err, result) => {
          if (err) {
              console.error('Error al insertar la respuesta:', err);
              return res.status(500).json({ error: 'Error al guardar la respuesta en la base de datos' });
          }

          res.status(201).json({ success: true, message: 'Respuesta guardada correctamente' });
      });
  });
});
  app.get('/obtenerDetallesPublicacion/:id', (req, res) => {
    const { publicacionId } = req.params.id;

    const sql = `
        SELECT p.*, u.correo as fk_usuario_correo 
        FROM publicacion p 
        JOIN usuarios u ON p.fk_usuario_correo = u.correo 
        WHERE p.id = ?
    `;

    db.query(sql, [publicacionId], (err, result) => {
        if (err) {
            console.error('Error al obtener detalles de la publicación:', err);
            return res.status(500).json({ error: 'Error al obtener detalles de la publicación' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }
        res.status(200).json(result[0]);
    });
});


app.get('/obtenerRespuestas/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  db.query('SELECT * FROM comentarios WHERE id = ?', [commentId], (err, result) => {
    if (err) {
      console.error(`Error al obtener respuestas del comentario ${commentId}:`, err);
      return res.status(500).json({ error: `Error al obtener respuestas del comentario ${commentId}` });
    }
    res.json(result);
  });
});




app.post('/guardarComentario', (req, res) => {
  const { publicacionId, comentario } = req.body;
  const token = req.headers.authorization; // Obtener el token del encabezado
  const accessToken = token.split(' ')[1]; // Extraer el token del encabezado
  let decodedToken;

  try {
    decodedToken = jwt.verify(accessToken, 'codigo secreto');
  } catch (err) {
    console.error('Error al decodificar el token:', err);
    return res.status(403).json({ error: 'Token inválido' });
  }

  const usuarioCorreo = decodedToken.correo;

  // Verificar que los datos necesarios estén presentes
  if (!publicacionId || !comentario || !usuarioCorreo) {
    return res.status(400).json({ error: 'Faltan datos requeridos para guardar el comentario' });
  }  
  // Si no hay respuesta existente, proceder con la inserción del comentario
  const sqlInsert = 'INSERT INTO comentarios (publicacion_id, texto, user_email) VALUES (?, ?, ?)';
  db.query(sqlInsert, [publicacionId, comentario, usuarioCorreo], (err, result) => {
      if (err) {
          console.error('Error al insertar comentario:', err);
          return res.status(500).json({ error: 'Error al insertar comentario en la base de datos' });
      }
      // Comentario insertado correctamente
      res.status(201).json({ success: true, message: 'Comentario guardado correctamente' });
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

const horarioRoutes = require("../routes/horarioRoutes.js");
app.use("/horario", horarioRoutes);

const usuario_horarios_predeterminadosRoutes = require("../routes/usuario_horarios_predeterminadosRoutes.js");
app.use("/usuarios_horarios_predeterminados", usuario_horarios_predeterminadosRoutes);

const truequesRoutes = require("../routes/truequesRoutes");
app.use("/trueques", truequesRoutes);

const filialVoluntarioRoutes = require("../routes/filialVoluntarioRoutes.js");
const { Console } = require("console");
app.use("/filialVoluntario", filialVoluntarioRoutes);

