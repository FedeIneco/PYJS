const piechart = document.getElementById('pie-chart');
const linear = document.getElementById("linear-chart");
const barChart = document.getElementById("bar-chart");

async function graficarPie (elementosGrafica, sumatorioGrafica){
    new Chart(piechart,{
        type: 'pie',
        data:{
            labels : elementosGrafica,      
            datasets :[{
                // label: 'Cost by type',
                backgroundColor: [  "#FF0000", // rojo
                "#00FF00", // verde
                "#0000FF", // azul
                "#FFFF00", // amarillo
                "#FF00FF", // magenta
                "#00FFFF", // cian
                "#800080", // morado
                "#FFA500"],
                data: sumatorioGrafica
            }],
            options: {
                title: {
                  display: true,
                  text: 'Costes por IFCType'
                },
                responsive: true
              }
        }
    })
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
    labels : elementosGrafica,
    datasets: [
        {
            label: array[0],
            data: contadorTipo1,
            borderColor: "#00FFFF", 
            backgroundColor: "#00FFFF",        
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
            borderColor: "#FF00FF",   
            backgroundColor: "#FF00FF",         
            borderWidth: 1,
        },
        {
            label: array[3],
            data: contadorTipo4,
            borderColor: "#FFA500", 
            backgroundColor: "#FFA500",           
            borderWidth: 1,
        },
    ]
  };
  new Chart(barChart, {
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
}


async function graficarLinear(costesFecha, labelFecha, fechasGrafica) {
  const data = {
    labels: fechasGrafica,
    datasets: [
      {     
        label: "Costes"   ,
        data: costesFecha,
      },
    ],
  };
  new Chart(linear, {
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

export {graficarPie, graficarBar,graficarLinear };