// import { objetosP2, estadosUnicos, objetos } from "./excelJB.js";

//Extensión Better Comments para ver mejor los comentarios de las funciones
/*
* * These lines of code are selecting HTML elements with specific IDs and assigning them to variables.
* *The selected elements are used later in the code to create charts and add event listeners to them. */
// const piechart = document.getElementById("pie-chart");
// const linear = document.getElementById("linear-chart");
// const barChart = document.getElementById("bar-chart");
// const barChartEspacio = document.getElementById("bar-chart-espacios");
// let datos;
// let colorGrafica;

/*
* *The code is defining an asynchronous function called `graficarPie` that takes two parameters:
* *`elementosGrafica` and `datosGraica`. */
// async function graficarPie(elementosGrafica, datosGraica) {
//   let pie = new Chart(piechart, {
//     type: "pie",
//     data: {
//       labels: elementosGrafica,
//       datasets: [
//         {
//           // label: 'Cost by type',
//           backgroundColor: [
//             "#ff4d4d", // rojo
//             "#ffff4d", // amarillo
//             "#70db70", // verde
//           ],
//           data: datosGraica,
//         },
//       ],
//       options: {
//         title: {
//           display: true,
//           text: "Ocuapción",
//         },
//         responsive: true,
//       },
//     },
//   });

/*
* * The code is adding an event listener to the `piechart` element. When the user clicks on the chart,
* *the function inside the event listener is executed. */
//   piechart.addEventListener("click", async function (event) {
//     const elements = pie.getElementsAtEventForMode(
//       event,
//       "nearest",
//       { intersect: true },
//       false
//     );

//     // Verificar si se han encontrado elementos
//     if (elements.length > 0) {
//       // Obtener el primer elemento clicado
//       const element = elements[0];

//       const index = element.index;

//       const label = pie.data.labels[index];

//       colorGrafica = pie.data.datasets[0].backgroundColor[index];
//       datos = idsElementosClickadosP1(label);
//     }
//   });
// }

/*
* * The code is defining an asynchronous function called `graficarBar` that takes several parameters:
* *`elementos`, `statesGrafica`, `contadorTipo1`, `contadorTipo2`, and `contadorTipo3`. */
// async function graficarBar(
//   elementos,
//   statesGrafica,
//   contadorTipo1,
//   contadorTipo2,
//   contadorTipo3
// ) {
//   const data = {
//     labels: elementos,
//     datasets: [
//       {
//         label: statesGrafica[0],
//         data: contadorTipo1,
//         borderColor: "#ff4d4d",
//         backgroundColor: "#ff4d4d",
//         borderWidth: 1,
//       },
//       {
//         label: statesGrafica[1],
//         data: contadorTipo2,
//         borderColor: "#ffff4d",
//         backgroundColor: "#ffff4d",
//         borderWidth: 1,
//       },
//       {
//         label: statesGrafica[2],
//         data: contadorTipo3,
//         borderColor: "#70db70",
//         backgroundColor: "#70db70",
//         borderWidth: 1,
//       },
//     ],
//   };
//   let bar = await new Chart(barChart, {
//     type: "bar",
//     data: data,
//     options: {
//       title: {
//         display: true,
//         text: "Estados por fecha",
//       },
//       responsive: true,
//     },
//   });
//   barChart.addEventListener("click", async function (event) {
//     const elements = bar.getElementsAtEventForMode(
//       event,
//       "nearest",
//       { intersect: true },
//       false
//     );
//     if (elements.length > 0) {
//       // Recorrer los elementos obtenidos
//       elements.forEach((element) => {
//         // Obtener el índice del elemento dentro del conjunto de datos
//         const datasetIndex = element.datasetIndex;
//         const index = element.index;

//         // Obtener el valor y la etiqueta del elemento
//         const fecha = bar.data.labels[index];
//         const estado = bar.data.datasets[datasetIndex].label;
//         datos = idsElementosClickadosP2(fecha, estado);
//         colorGrafica = bar.data.datasets[datasetIndex].backgroundColor;
//       });
//     }
//   });
// }

/*
* * The code defines an asynchronous function called `graficarLinear` that takes several parameters:
* *`fechas`, `estados`, `contador1`, `contador2`, and `contador3`. */
// async function graficarLinear(
//   fechas,
//   estados,
//   contador1,
//   contador2,
//   contador3
// ) {
//   const data = {
//     labels: fechas,
//     datasets: [
//       {
//         label: estados[0],
//         data: contador1,
//         borderColor: "#ff4d4d",
//         backgroundColor: "#ff4d4d",
//       },
//       {
//         label: estados[1],
//         data: contador2,
//         borderColor: "#ffff4d",
//         backgroundColor: "#ffff4d",
//       },
//       {
//         label: estados[2],
//         data: contador3,
//         borderColor: "#70db70",
//         backgroundColor: "#70db70",
//       },
//     ],
//   };
//   let line = new Chart(linear, {
//     type: "line",
//     data: data,
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "top",
//         },
//         title: {
//           display: true,
//           text: "Costes por fecha",
//         },
//       },
//     },
//   });
// }



/*
* * The code defines an asynchronous function called `graficarBarEspacios` that creates a pie chart
* *using the Chart.js library. */
// async function graficarBarEspacios(
//   elementos,
//   espaciosContador1,
//   espaciosContador2,
//   espaciosContador3
// ) {
//   const array = [espaciosContador1, espaciosContador2, espaciosContador3];
//   let barEs = await new Chart(barChartEspacio, {
//     type: "pie",
//     data: {
//       labels: elementos,
//       datasets:[
//         {
//           backgroundColor: [
//           "#8844B5",
//           "#B9B9DD",
//           "#6B84E4",
//         ],
//         data: array}
//       ]
//     },
//     options: {
//       title: {
//         display: true,
//         text: "Tipos Espacios",
//       },
//       responsive: true,
//     },
//   });
//   barChartEspacio.addEventListener("click", async function (event) {
//     const elements = barEs.getElementsAtEventForMode(
//       event,
//       "nearest",
//       { intersect: true },
//       false
//     );
//     console.log(elements);
//     // Verificar si se han encontrado elementos
//     if (elements.length > 0) {
//       // Obtener el primer elemento clicado
//       const element = elements[0];

//       const index = element.index;

//       const label = barEs.data.labels[index];
//       colorGrafica = barEs.data.datasets[0].backgroundColor[index];
//       datos = elementosSpacio(label);
//       console.log(datos);
//     }
//   });
// }

/*
* The commented code is defining a function called `idsElementosClickadosP1` that takes a parameter
*`datasetLabel`. This function filters an array called `objetos` and returns only the elements that
*have a property `estado` equal to the `datasetLabel` parameter. */
// function idsElementosClickadosP1(datasetLabel) {
//   return objetos.filter((element) => element.estado === datasetLabel);
// }

/*
* The function `elementosSpacio` is filtering an array called `objetos` and returning only the
* elements that have a property `spaceUso` equal to the `datasetLabel` parameter. */
//function elementosSpacio(datasetLabel){
//   return objetos.filter((element) => element.spaceUso === datasetLabel);
// }

/*
* The commented code defines a function called `idsElementosClickadosP2` that takes two parameters:
* `fecha` and `datasetLabel`. */
// function idsElementosClickadosP2(fecha, datasetLabel) {
//   if (fecha) {
//     return objetosP2.filter(
//       (element) =>
//         element.date.substring(0,5) ===
//           fecha && element.estado === datasetLabel
//     );
//   } else {
//     return objetosP2.filter((element) => element.estado === datasetLabel);
//   }
// }

// export { graficarPie, graficarBar, graficarLinear,graficarBarEspacios, datos, colorGrafica };

