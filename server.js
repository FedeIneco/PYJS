const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mimeType = require('mime-types');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();

app.get('/css/style.css', function(req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'css/style.css'));
});
app.get('/lib/fontawesome-free-5.11.2-web/css/all.min.css', function(req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'lib/fontawesome-free-5.11.2-web/css/all.min.css'));
});
app.get('/lib/xeokit-bim-viewer/xeokit-bim-viewer.es.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'lib/xeokit-bim-viewer/xeokit-bim-viewer.es.js'));
});
app.get('/lib/xeokit-bim-viewer/xeokit-bim-viewer.css', function(req, res) {
  res.set('Content-Type', 'text/css');
  res.sendFile(path.join(__dirname, 'lib/xeokit-bim-viewer/xeokit-bim-viewer.css'));
});
app.get('/img/icono-Ineco.ico', function(req, res) {
  res.set('Content-Type', 'image/ico');
  res.sendFile(path.join(__dirname, 'img/icono-Ineco.ico'));
});
app.get('/img/logo_ineco_blanco.png', function(req, res) {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.join(__dirname, 'img/logo_ineco_blanco.png'));
});
app.get('/img/PanelLogo.png ', function(req, res) {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.join(__dirname, 'img/PanelLogo.png'));
});
app.get('/img/fondo.png', function(req, res) {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.join(__dirname, 'img/fondo.png'));
});
app.get('/img/PanelJerarquia.png', function(req, res) {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.join(__dirname, 'img/PanelJerarquia.png'));
});
app.get('/img/PanelJerarquiaProp.png', function(req, res) {
  res.set('Content-Type', 'image/png');
  res.sendFile(path.join(__dirname, 'img/PanelJerarquiaProp.png'));
});
app.get('/lib/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.woff2', function(req, res) {
  res.set('Content-Type', 'font/woff2');
  res.sendFile(path.join(__dirname, 'lib/fontawesome-free-5.11.2-web/webfonts/fa-solid-900.woff2'));
});
app.get('/lib/tippy.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'lib/tippy.js'));
});
app.get('/lib/popper.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'lib/popper.js'));
});
app.get('/lib/xeokit-bim-viewer/messages.js', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, 'lib/xeokit-bim-viewer/messages.js'));
});




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
  res.status(200).sendFile(path.join( __dirname,'./index.html'));
});

app.get('/api/projects', async (req, res) => {  
  let filenames = [];
  for (let i = 0; i < filteredProjects.length; i++) {    
    filenames.push(filteredProjects[i]);
  }

    res.status(200).send({    
    filenames: filenames
  });
});

let files = fs.readdirSync('./uploads');
console.log(files);

app.get('/api/files', async (req, res) => {    
    res.status(200).send({    
    files
  });
});


app.get('/api/convert-to-xkt', async (req, res) => {
  res.status(200).send('<h2>Servidor iniciado aquí también</h2>');
});

app.post('/api/convert-to-xkt', upload, (req, res) => {
  const texto = req.body.texto;  

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
