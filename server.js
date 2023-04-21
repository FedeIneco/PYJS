const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mimeType = require('mime-types');
const { exec } = require('child_process');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage
}).array('archivo', 10);

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Tamo en vivo!'
  });
});

app.get('/convert-to-xkt', async (req, res) => {
  res.status(200).send({
    message: 'HOLA!'
  });
});

app.post('/convert-to-xkt', upload, (req, res) => {
  const texto = req.body.texto;  

  // Aquí se puede hacer lo que se necesite con el archivo y el string recibidos

  const command = `node createProject.js -p ${texto} -s ./uploads/*.ifc`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return res.status(500).json({ error: 'Error al ejecutar el comando' });
    }
    console.log(`Salida del comando: ${stdout}`);
    return res.status(200).json({ mensaje: 'Comando ejecutado correctamente' });
  });
});

app.listen(8080, () => {
  console.log('Servidor iniciado en el http://localhost:8080/');
});
