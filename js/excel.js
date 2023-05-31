import { graficarBar, graficarLinear, graficarPie } from "./graficas.js";

const excelInput = document.getElementById("fileInput");
const barButton = document.getElementById("bar-btn");
const pieButton = document.getElementById("pie-btn");
const linearButton = document.getElementById("line-btn");

let datosPrecios = [];
let ifcTypes = [];
let statesGrafica = [];
const sumatorioGrafica = [];
const costesFecha = [];
const labelFecha = [];
const fechasGrafica = [];
const contadorTipo1 = [];
const contadorTipo2 = [];
const contadorTipo3 = [];
const contadorTipo4 = [];

excelInput.addEventListener("change", async () => {
  barButton.classList.remove("disabled");
  pieButton.classList.remove("disabled");
  linearButton.classList.remove("disabled");
  const content = await readXlsxFile(excelInput.files[0]);
  for (let index = 1; index < content.length; index++) {
    const elemento = new Object();
    elemento.id = content[index][2];
    elemento.cost = content[index][3];
    elemento.type = content[index][4];
    elemento.state = content[index][5];
    const fecha = JSON.stringify(content[index][6]);
    elemento.dia = fecha.substring(9, 11);
    elemento.mes = fecha.substring(6, 8);
    elemento.annio = fecha.substring(1, 5);
    datosPrecios.push(elemento);
  }
  obtenerTypes();
  obtenerStates();
  fechaslabel();
  sumatorioCostesPortype();
  obtenerStatePorType();
  sumatioCostePorFecha();
  // await graficarPie(ifcTypes, sumatorioGrafica);
  // await graficarBar(
  //   ifcTypes,
  //   statesGrafica,
  //   contadorTipo1,
  //   contadorTipo2,
  //   contadorTipo3,
  //   contadorTipo4
  // );
  // await graficarLinear(costesFecha, labelFecha, fechasGrafica);
  filtrarIdsPorIfcType(datosPrecios, ifcTypes);
});

function obtenerTypes() {
  ifcTypes = eliminarDuplicadosPorPropiedad(datosPrecios, "type");
}

function obtenerStates() {
  statesGrafica = eliminarDuplicadosPorPropiedad(datosPrecios, "state");
}

function eliminarDuplicadosPorPropiedad(arr, propiedad) {
  return [...new Set(arr.map((element) => element[propiedad]))];
}

function fechaslabel() {
  const fechas = [
    ...new Set(
      datosPrecios.map((element) => element.mes + " " + element.annio)
    ),
  ].sort();
  eliminarLabelDuplicadas(fechas);
}

function eliminarLabelDuplicadas(fechasLabel) {
  fechasLabel.forEach((element) => {
    if (!labelFecha.includes(element)) {
      labelFecha.push(element);
    }
  });
}

function sumatorioCostesPortype() {
  for (let index = 0; index < ifcTypes.length; index++) {
    const element = ifcTypes[index];
    let suma = 0;
    for (let index2 = 0; index2 < datosPrecios.length; index2++) {
      const element2 = datosPrecios[index2];
      if (element2.type == element) {
        suma += element2.cost;
      }
    }
    sumatorioGrafica.push(suma);
  }
}

function obtenerStatePorType() {
  for (let index = 0; index < ifcTypes.length; index++) {
    const element = ifcTypes[index];
    let contador1 = 0;
    let contador2 = 0;
    let contador3 = 0;
    let contador4 = 0;
    for (let index2 = 0; index2 < datosPrecios.length; index2++) {
      const element2 = datosPrecios[index2];
      if (element2.state == 1 && element2.type == element) {
        contador1++;
      }
      if (element2.state == 2 && element2.type == element) {
        contador2++;
      }
      if (element2.state == 3 && element2.type == element) {
        contador3++;
      }
      if (element2.state == 4 && element2.type == element) {
        contador4++;
      }
    }
    contadorTipo1.push(contador1);
    contadorTipo2.push(contador2);
    contadorTipo3.push(contador3);
    contadorTipo4.push(contador4);
  }
}

function sumatioCostePorFecha() {
  for (let index = 0; index < fechasGrafica.length; index++) {
    const element = fechasGrafica[index];
    let suma = 0;
    for (let index2 = 0; index2 < datosPrecios.length; index2++) {
      const fecha =
        datosPrecios[index2].dia +
        " " +
        datosPrecios[index2].mes +
        " " +
        datosPrecios[index2].annio;
      const element2 = datosPrecios[index2];
      if (fecha == element) {
        suma += element2.cost;
      }
    }
    costesFecha.push(suma);
  }
}

function filtrarIdsPorIfcType(datosPrecios, ifcTypes) {
  let result = [];
  for (let i = 0; i < ifcTypes.length; i++) {
    const type = ifcTypes[i];
    let idsTypes = [];
    for (let j = 0; j < datosPrecios.length; j++) {
      const element = datosPrecios[j];
      if (element.type === type) {
        let id = { id: element.id };
        idsTypes.push(id);
      }
    }
    result.push({ type: type, ids: idsTypes });
  }
  return result;
}

// function obtenerFechas() {
//   let fechas = [];
//   for (let index = 0; index < datosPrecios.length; index++) {
//     const element = datosPrecios[index];
//     const fecha = element.dia +" " + element.mes + " " + element.annio;
//     fechas.push(fecha);
//   }
//   eliminarFechasDuplicadas(fechas);
// }

// function eliminarFechasDuplicadas(fechas) {
//     fechas.forEach((element) => {
//     if (!fechasGrafica.includes(element)) {
//       fechasGrafica.push(element);
//     }
//   });
// }

export { datosPrecios, ifcTypes, filtrarIdsPorIfcType, statesGrafica };
