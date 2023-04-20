const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
      message: 'Tamo en vivo!'
    })
  })

app.post('/convert-to-xkt', (req, res) => {
// const nombre = req.body.nombre;
// const datos = req.body.datos;
console.log(req.body.datos);
//   const command = `mi_comando --parametro1=${parametro1} --parametro2=${parametro2}`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error al ejecutar el comando: ${error}`);
//       return res.status(500).json({ error: 'Error al ejecutar el comando' });
//     }
//     console.log(`Salida del comando: ${stdout}`);
//     return res.status(200).json({ mensaje: 'Comando ejecutado correctamente' });
  //});
});

app.listen(8080, () => {
  console.log('Servidor iniciado en el http://localhost:8080/');
});
