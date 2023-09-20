let date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
$("#dia").html(`${day}/${month}/${year}`);
/**
 * *The function `crearIMG()` creates an image from a specified container element, downloads it as a JPG
 * *file, and then redirects the user to a different page after a delay.
 */
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

/* *
* The code `$("#imagen").change(function () { ... })` is attaching an event listener to the element
* with the id "imagen". */
$("#imagen").change(function () {
  if ($(this).is(":checked")) {
    $("#captura").show();
  } else {
    $("#captura").hide();
  }
});
/* 
* The code `$("#leyenda_espacios").change(function () { ... })` is attaching an event listener to the
* element with the id "leyenda_espacios". */
$("#leyenda_espacios").change(function () {
  if ($(this).is(":checked")) {
    $("#espacios").show();
  } else {
    $("#espacios").hide();
  }
});

/*
* The code `$("#leyenda_ocupacion").change(function () { ... })` is attaching an event listener to the
* element with the id "leyenda_ocupacion". */
$("#leyenda_ocupacion").change(function () {
  if ($(this).is(":checked")) {
    $("#ocupacion").show();
  } else {
    $("#ocupacion").hide();
  }
});

/* 
* The code `$("#imprimir").click(function () { crearIMG(); });` is attaching a click event listener to
* the element with the id "imprimir". When the element is clicked, the function `crearIMG()` will be
* executed. */
$("#imprimir").click(function () {
  crearIMG();
});
