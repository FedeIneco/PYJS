import { datosPrecios } from "./excel.js";

const piechart = document.getElementById("pie-chart");
const linear = document.getElementById("linear-chart");
const barChart = document.getElementById("bar-chart");
let datos;
let colorGrafica;

async function graficarPie(elementosGrafica, sumatorioGrafica) {
 let pie =  new Chart(piechart, {
    type: "pie",
    data: {
      labels: elementosGrafica,
      datasets: [
        {
          // label: 'Cost by type',
          backgroundColor: [
            "#FF0000", // rojo
            "#00FF00", // verde
            "#0000FF", // azul
            "#FFFF00", // amarillo
            "#FF00FF", // magenta
            "#00FFFF", // cian
            "#800080", // morado
            "#FFA500",
          ],
          data: sumatorioGrafica,
        },
      ],
      options: {
        title: {
          display: true,
          text: "Costes por IFCType",
        },
        responsive: true,
      },
    },
  });
  piechart.addEventListener("click", async function (event) {
    var element = await pie.getElementAtEvent(event)[0];      
    datos = idsElementosClickados(element._view.label);
    colorGrafica = element._view.backgroundColor;
  });
}

async function graficarBar(
  elementosGrafica,
  statesGrafica,
  contadorTipo1,
  contadorTipo2,
  contadorTipo3,
  contadorTipo4
) {
  const array = statesGrafica.sort();
  const data = {
    labels: elementosGrafica,
    datasets: [
      {
        label: array[0],
        data: contadorTipo1,
        borderColor: "#FF0000",
        backgroundColor: "#FF0000",
        borderWidth: 1,
      },
      {
        label: array[1],
        data: contadorTipo2,
        borderColor: "#00FF00",
        backgroundColor: "#00FF00",
        borderWidth: 1,
      },
      {
        label: array[2],
        data: contadorTipo3,
        borderColor: "#E4FF00",
        backgroundColor: "#E4FF00",
        borderWidth: 1,
      },
      {
        label: array[3],
        data: contadorTipo4,
        borderColor: "#00FFDC",
        backgroundColor: "#00FFDC",
        borderWidth: 1,
      },
    ],
  };
   let bar = await new Chart(barChart, {
    type: "bar",
    data: data,
    options: {
      title: {
        display: true,
        text: "Estados por IFCType",
      },
      responsive: true,
    },
  });
  console.log(bar);
  barChart.addEventListener("click", async function (event) {
    var element = await bar.getElementAtEvent(event)[0];        
    datos = idsElementosClickados(element._view.label, element._view.datasetLabel);        
    colorGrafica = element._view.backgroundColor;
  });
 
}


async function graficarLinear(costesFecha, labelFecha, fechasGrafica) {
  const data = {
    labels: labelFecha,
    datasets: [
      {
        label: "Costes",
        data: costesFecha,
      },
    ],
  };
  let line = new Chart(linear, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Costes por fecha",
        },
      },
    },
  });
}


function idsElementosClickados (label, datasetLabel){  
  if (datasetLabel) {
    return datosPrecios.filter((element) => (element.type === label && element.state === datasetLabel));
  } else {
    return datosPrecios.filter((element) => (element.type === label));
  }
}

export { graficarPie, graficarBar, graficarLinear, datos, colorGrafica };