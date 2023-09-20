const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mimeType = require("mime-types");
const { exec } = require("child_process");
const fs = require("fs");
const spawn = require("child_process").spawn;
const pythonProcess = spawn("python", ["../python/index.py"]);
const app = express();
app.use(cors());

/* 
* The `multer.diskStorage` function is used to configure the disk storage engine for handling file
* uploads with Multer. */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

/* 
* The code `const upload = multer({ storage: storage }).array("archivo", 10);` is configuring Multer
* to handle file uploads. */
const upload = multer({
  storage: storage,
}).array("archivo", 10);

/* 
* The code `const uploadImg = multer({ storage: storage }).single("imagen");` is configuring Multer to
* handle a single file upload with the field name "imagen". It sets the storage engine to the one
* defined in the `storage` variable, which specifies the destination folder and filename for the
* uploaded file. */
const uploadImg = multer({
  storage: storage,
}).single("imagen");


/* 
* This code is defining a route handler for the GET request to "/captura". When this route is
* accessed, it sends the "captura.html" file as the response. The file is located in the current
* directory (__dirname) and is joined with the "./captura.html" path using the path.join() method. The
* response status is set to 200, indicating a successful request. */
app.get("/captura", async (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./captura.html"));
});

/* 
* This code is defining a route handler for the GET request to "/api/projects". When this route is
* accessed, it reads the contents of the "./data/projects" directory using the `fs.readdirSync()`
* method. It then filters out the "index.json" file from the list of projects. */
app.get("/api/projects", async (req, res) => {
  let projects = fs.readdirSync("./data/projects");
  const filteredProjects = projects.filter((item) => item !== "index.json");
  let filenames = [];
  for (let i = 0; i < filteredProjects.length; i++) {
    filenames.push(filteredProjects[i]);
  }

/* 
* The code `res.status(200).send({ filenames: filenames })` is sending a response with a status code
* of 200 (indicating a successful request) and a JSON object as the response body. The JSON object
* contains a property called "filenames" which holds the value of the "filenames" variable. This
* allows the server to send a list of filenames to the client as a response. */
  res.status(200).send({
    filenames: filenames,
  });
});

let files = fs.readdirSync("./uploads");

//* The code is defining a route handler for the GET request to "/api/files". 
app.get("/api/files", async (req, res) => {
  res.status(200).send({
    files,
  });
});

/* 
* The code `app.post("/api/convert-to-xkt", upload, (req, res) => { ... })` is defining a route
* handler for the POST request to "/api/convert-to-xkt".
* Ejecuta los comandos para la conversión de ifc a xkt y la extracción de datos de ifc a excel */
app.post("/api/convert-to-xkt", upload, (req, res) => {
  const texto = req.body.texto;

  // Comando para ejecutar createProject.js
  const createProjectCommand = `node createProject.js -p ${texto} -s ./uploads/*.ifc`;

  // Comando para ejecutar python.js
  const pythonCommand = "node python.js";

  // Ejecutar createProject.js
  exec(createProjectCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar createProject.js: ${error}`);
      return res
        .status(500)
        .json({ error: "Error al ejecutar createProject.js" });
    }

    console.log(`Salida de createProject.js: ${stdout}`);

    // Ejecutar python.js
    // exec(pythonCommand, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error al ejecutar python.js: ${error}`);
    //     return res.status(500).json({ error: "Error al ejecutar python.js" });
    //   }

    //   console.log(`Salida de python.js: ${stdout}`);
    //   return res
    //     .status(200)
    //     .json({ mensaje: "Comandos ejecutados correctamente" });
    // });
  });
});

/* 
* The code `app.post("/guardar-imagen", uploadImg, (req, res) => { ... })` is defining a route handler
* for the POST request to "/guardar-imagen".
* Guarda la captura realizada para la extracción del plano */
app.post("/guardar-imagen", uploadImg, (req, res) => {
  const imagenBase64 = req.body.imagen; // Obtener los datos de la imagen codificada en base64
  const nombreArchivo = "captura.png"; // Especificar el nombre de archivo deseado
  const rutaDestino = path.join(__dirname, "downloads", nombreArchivo);
  const imagenData = imagenBase64.replace(/^data:image\/png;base64,/, "");
  // Guardar la imagen en el servidor
  fs.writeFile(rutaDestino, imagenData, "base64", (error) => {
    if (error) {
      console.error("Error al guardar la imagen en el servidor:", error);
      res.sendStatus(500);
    } else {
      console.log("Imagen guardada en el servidor:", rutaDestino);
      res.sendStatus(200);
    }
  });
});

//* Inicia el servidor
app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado en el http://localhost:3000/");
});

/**
 * * The function `ejecutarPython()` executes a Python process and captures its output.
 */
function ejecutarPython() {
  let pRes = "";
  pythonProcess.stdout.on("data", function (data) {
    pRes += data.toString();
  });
  pythonProcess.stdout.on("end", function () {
    console.log("FINISHED");
  });
}
