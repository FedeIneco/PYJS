let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
$("#dia").html(`${day}/${month}/${year}`);
function crearIMG() {
  const container = document.getElementById("datosImprimir");
  html2canvas(container).then((canvas) => {
    const imageDataURL = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");
    link.href = imageDataURL;
    link.download = "Plano.jpg";
    link.click();
  });
  setTimeout(() => {
    window.location.href = "/?projectId=JBPS2";
  }, 3000);
}

$("#imagen").change(function () {
  if ($(this).is(":checked")) {
    $("#captura").show();
  } else {
    $("#captura").hide();
  }
});
$("#leyenda_espacios").change(function () {
  if ($(this).is(":checked")) {
    $("#espacios").show();
  } else {
    $("#espacios").hide();
  }
});

$("#leyenda_ocupacion").change(function () {
  if ($(this).is(":checked")) {
    $("#ocupacion").show();
  } else {
    $("#ocupacion").hide();
  }
});

$("#imprimir").click(function () {
  crearIMG();
});
