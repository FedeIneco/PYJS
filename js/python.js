const spawn = require("child_process").spawn;

const pythonProcess = spawn("python", ["../python/index.py"]);

let pRes = "";

/* 
* The code `pythonProcess.stdout.on("data", function (data) { console.log("Recogiendo datos..."); pRes
* += data.toString(); });` is listening for the "data" event emitted by the stdout (standard output)
* stream of the `pythonProcess` child process. */
pythonProcess.stdout.on("data", function (data) {
  console.log("Recogiendo datos...");
  pRes += data.toString();
});

/* 
* The code `pythonProcess.stdout.on("end", function () { console.log("FINISHED"); });` is listening
* for the "end" event emitted by the stdout (standard output) stream of the `pythonProcess` child
* process. */
pythonProcess.stdout.on("end", function () {
  console.log("FINISHED");
});
