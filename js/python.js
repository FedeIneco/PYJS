const spawn = require("child_process").spawn;

const pythonProcess = spawn("python", ["../python/index.py"]);

let pRes = "";

pythonProcess.stdout.on("data", function (data) {
  console.log("Recogiendo datos...");
  pRes += data.toString();
});

pythonProcess.stdout.on("end", function () {
  console.log("FINISHED");
});
