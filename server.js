const express = require('express');
const path = requiere('path');
const cors = require('cors');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();
const upload = multer();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Tamo en vivo!'
    })
  })

app.post('/convert-to-xkt', upload.single('archivo'), (req, res) => {
  const texto = req.body.texto;
  const archivo = req.file;

console.log(texto);
  
// res.status(200).send({
//  message:datos.name
// })
console.log('Texto:', texto);
console.log('Archivo:', archivo);

// Aquí se puede hacer lo que se necesite con el archivo y el string recibidos

const command = `node createProject.js -p ${texto} -s ${archivo.originalname}` ;

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
