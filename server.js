const express = require("express");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const mimeType = require("mime-types");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use("/css", express.static(__dirname + "/css"));
app.use(
  "/lib/fontawesome-free-5.11.2-web/css",
  express.static(__dirname + "/lib/fontawesome-free-5.11.2-web/css")
);
app.use(
  "/lib/xeokit-bim-viewer/",
  express.static(__dirname + "/lib/xeokit-bim-viewer/")
);
app.use("/img", express.static(__dirname + "/img"));
app.use(
  "/lib/fontawesome-free-5.11.2-web/webfonts",
  express.static(__dirname + "/lib/fontawesome-free-5.11.2-web/webfonts")
);
app.use("/lib", express.static(__dirname + "/lib"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/data/projects", express.static(__dirname + "/data/projects"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).array("archivo", 10);

let projects = fs.readdirSync("./data/projects");
const filteredProjects = projects.filter((item) => item !== "index.json");

app.get("/", async (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./index.html"));
});

app.get("/api/projects", async (req, res) => {
  let filenames = [];
  for (let i = 0; i < filteredProjects.length; i++) {
    filenames.push(filteredProjects[i]);
  }

  res.status(200).send({
    filenames: filenames,
  });
});

let files = fs.readdirSync("./uploads");

app.get("/api/files", async (req, res) => {
  res.status(200).send({
    files,
  });
});

app.post("/api/convert-to-xkt", upload, (req, res) => {
  const texto = req.body.texto;

  const command = `node createProject.js -p ${texto} -s ./uploads/*.ifc`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return res.status(500).json({ error: "Error al ejecutar el comando" });
    }
    console.log(`Salida del comando: ${stdout}`);
    return res.status(200).json({ mensaje: "Comando ejecutado correctamente" });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado en el http://localhost:3000/");
});
