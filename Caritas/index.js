const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
// const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;

const publicacionRoutes = require("./routes/publicacionRoutes.js");

//convertimos los datos en json
app.use(express.json());
//para problemas con políticas de cors
app.use(cors());

app.get('/', (req, res) => {
  res.send('Andando');
})

app.listen(PORT, () => {
  console.log('Servidor activo');
});


app.use("/publicacion", publicacionRoutes);