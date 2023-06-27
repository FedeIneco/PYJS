// import { objetosP2, estadosUnicos, objetos } from "./excelJB.js";

// const piechart = document.getElementById("pie-chart");
// const linear = document.getElementById("linear-chart");
// const barChart = document.getElementById("bar-chart");
// const barChartEspacio = document.getElementById("bar-chart-espacios");
// let datos;
// let colorGrafica;

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

// function idsElementosClickadosP1(datasetLabel) {
//   return objetos.filter((element) => element.estado === datasetLabel);
// }

// function elementosSpacio(datasetLabel){
//   return objetos.filter((element) => element.spaceUso === datasetLabel);
// }
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

import{objetosP2 as a,estadosUnicos as e,objetos as t}from"./excelJB.js";let piechart=document.getElementById("pie-chart"),linear=document.getElementById("linear-chart"),barChart=document.getElementById("bar-chart"),barChartEspacio=document.getElementById("bar-chart-espacios"),datos,colorGrafica;async function graficarPie(a,e){let t=new Chart(piechart,{type:"pie",data:{labels:a,datasets:[{backgroundColor:["#ff4d4d","#ffff4d","#70db70"],data:e},],options:{title:{display:!0,text:"Ocuapci\xf3n"},responsive:!0}}});piechart.addEventListener("click",async function(a){let e=t.getElementsAtEventForMode(a,"nearest",{intersect:!0},!1);if(e.length>0){let r=e[0],o=r.index,d=t.data.labels[o];colorGrafica=t.data.datasets[0].backgroundColor[o],datos=idsElementosClickadosP1(d)}})}async function graficarBar(a,e,t,r,o){let d={labels:a,datasets:[{label:e[0],data:t,borderColor:"#ff4d4d",backgroundColor:"#ff4d4d",borderWidth:1},{label:e[1],data:r,borderColor:"#ffff4d",backgroundColor:"#ffff4d",borderWidth:1},{label:e[2],data:o,borderColor:"#70db70",backgroundColor:"#70db70",borderWidth:1},]},l=await new Chart(barChart,{type:"bar",data:d,options:{title:{display:!0,text:"Estados por fecha"},responsive:!0}});barChart.addEventListener("click",async function(a){let e=l.getElementsAtEventForMode(a,"nearest",{intersect:!0},!1);e.length>0&&e.forEach(a=>{let e=a.datasetIndex,t=a.index,r=l.data.labels[t],o=l.data.datasets[e].label;datos=idsElementosClickadosP2(r,o),colorGrafica=l.data.datasets[e].backgroundColor})})}async function graficarLinear(a,e,t,r,o){let d={labels:a,datasets:[{label:e[0],data:t,borderColor:"#ff4d4d",backgroundColor:"#ff4d4d"},{label:e[1],data:r,borderColor:"#ffff4d",backgroundColor:"#ffff4d"},{label:e[2],data:o,borderColor:"#70db70",backgroundColor:"#70db70"},]};new Chart(linear,{type:"line",data:d,options:{responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:"Costes por fecha"}}}})}async function graficarBarEspacios(a,e,t,r){let o=await new Chart(barChartEspacio,{type:"pie",data:{labels:a,datasets:[{backgroundColor:["#8844B5","#B9B9DD","#6B84E4",],data:[e,t,r]}]},options:{title:{display:!0,text:"Tipos Espacios"},responsive:!0}});barChartEspacio.addEventListener("click",async function(a){let e=o.getElementsAtEventForMode(a,"nearest",{intersect:!0},!1);if(console.log(e),e.length>0){let t=e[0],r=t.index,d=o.data.labels[r];colorGrafica=o.data.datasets[0].backgroundColor[r],datos=elementosSpacio(d),console.log(datos)}})}function idsElementosClickadosP1(a){return t.filter(e=>e.estado===a)}function elementosSpacio(a){return t.filter(e=>e.spaceUso===a)}function idsElementosClickadosP2(e,t){return e?a.filter(a=>a.date.substring(0,5)===e&&a.estado===t):a.filter(a=>a.estado===t)}export{graficarPie,graficarBar,graficarLinear,graficarBarEspacios,datos,colorGrafica};
