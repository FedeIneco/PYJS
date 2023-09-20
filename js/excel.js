/* 
* The line of code is importing three functions (`graficarBar`, `graficarLinear`, `graficarPie`) from
* a JavaScript module located in the file `graficas.js`. These functions can then be used in the
* current JavaScript file. */
import { graficarBar, graficarLinear, graficarPie } from "./graficas.js";

// * These lines of code are selecting HTML elements by their IDs and assigning them to variables.
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

/* 
* The code is adding an event listener to the `excelInput` element, which listens for a change event.
* When the change event is triggered (i.e., when a file is selected), the code inside the event
* listener is executed. */
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
/*  
* The code is calling several functions in order to obtain and process data from the `datosPrecios`
* array. */
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
  // filtrarIdsPorIfcType(datosPrecios, ifcTypes);
});

/**
 * * The function "obtenerTypes" retrieves unique values of the "type" property from the "datosPrecios"
 * * array.
 */
function obtenerTypes() {
  ifcTypes = eliminarDuplicadosPorPropiedad(datosPrecios, "type");
}

/**
 * * The function "obtenerStates" retrieves unique states from the "datosPrecios" array based on the
 * * "state" property.
 */
function obtenerStates() {
  statesGrafica = eliminarDuplicadosPorPropiedad(datosPrecios, "state");
}
/**
 * * The function eliminates duplicates in an array of objects based on a specified property.
 *   @param arr - The arr parameter is an array of objects. Each object in the array has properties.
 *   @param propiedad - The "propiedad" parameter is a string that represents the property name of the
 * * objects in the array.
 *   @returns an array with unique values of a specific property from the objects in the input array.
 */

function eliminarDuplicadosPorPropiedad(arr, propiedad) {
  return [...new Set(arr.map((element) => element[propiedad]))];
}

/**
 * * The function `fechaslabel` creates a sorted array of unique month and year labels from an array of
 * * price data.
 */
function fechaslabel() {
  const fechas = [
    ...new Set(
      datosPrecios.map((element) => element.mes + " " + element.annio)
    ),
  ].sort();
  eliminarLabelDuplicadas(fechas);
}

/**
 * * The function `eliminarLabelDuplicadas` removes duplicate elements from the `fechasLabel` array and
 * * adds them to the `labelFecha` array.
 *   @param fechasLabel - The parameter `fechasLabel` is an array of labels (strings) that you want to
 * * remove duplicates from.
 */
function eliminarLabelDuplicadas(fechasLabel) {
  fechasLabel.forEach((element) => {
    if (!labelFecha.includes(element)) {
      labelFecha.push(element);
    }
  });
}

/**
 * * The function calculates the sum of costs for each type of ifc.
 */
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

/**
 * * The function "obtenerStatePorType" counts the occurrences of different states for each type in the
 * * "datosPrecios" array.
 */
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

/**
 * * The function calculates the sum of costs for each date in the fechasGrafica array based on matching
 * * dates in the datosPrecios array.
 */
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

/**
 * * The function `filtrarIdsPorIfcType` filters an array of objects based on a given array of `ifcTypes`
 * * and returns an array of objects containing the filtered `ids` for each `type`.
 *   @param datosPrecios - An array of objects representing data with properties "id" and "type".
 *   @param ifcTypes - An array of strings representing the types of data to filter by.
 *   @returns The function `filtrarIdsPorIfcType` returns an array of objects. Each object in the array
 * * represents a type from the `ifcTypes` array and contains two properties: `type` and `ids`. The
 * * `type` property represents the type from `ifcTypes`, and the `ids` property is an array of objects
 * * that contain the `id` property from the `
 */
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
