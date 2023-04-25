const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mimeType = require('mime-types');
const { exec } = require('child_process');
const fs = require('fs');

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


let projects = fs.readdirSync('./data/projects');
const filteredProjects = projects.filter((item) => item !== 'index.json')
console.log(filteredProjects);

app.get('/', async (req, res) => {
  res.status(200).send('<h2>Servidor iniciado</h2>');
});

app.get('/api/projects', async (req, res) => {
  let html = '';
  let filenames = [];
  for (let i = 0; i < filteredProjects.length; i++) {
    html += `<h3>${filteredProjects[i]}</h3>`;
    filenames.push(filteredProjects[i]);
  }

    res.status(200).send({    
    filenames: filenames
  });
});

app.get('/api/convert-to-xkt', async (req, res) => {
  res.status(200).send('<h2>Servidor iniciado aquí también</h2>');
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

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor iniciado en el http://localhost:3000/');
});
