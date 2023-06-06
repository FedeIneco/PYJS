import { graficarBar, graficarLinear, graficarPie, graficarBarEspacios } from "./graficas.js";
const excelInput = document.getElementById("fileInput");
let objetos = [];
let plantasUnicas = [];
let plantasFiltradas = [];
let ceilings = [];
let estados = [];
let estadosUnicos = [];
let sumatorioEStados = [];
let objetosP2 = [];
let fechasUnicas = [];
let falsosTechosP1 = [];
let usoEspacios = [];
let espaciosUnicos = [];

excelInput.addEventListener("change", async () => {
  const content = await readXlsxFile(excelInput.files[0]);

  objetos = await crearObjetosP1(content);
  let plantas = objetos.map(function (objeto) {
    return objeto.checkLevel;
  });


  plantasUnicas = [...new Set(plantas)];
  plantasUnicas.sort();
  plantasUnicas.pop();

  let estadosFiltrados = obtenerEstados();
  estados = estadosFiltrados.map(function (objeto) {
    return objeto.estado;
  });
  estadosUnicos = [...new Set(estados)];

  plantasUnicas.forEach(function (nivel) {
    const objetosFiltrados = objetos.filter(function (objeto) {
      return objeto.checkLevel === nivel;
    });
    plantasFiltradas.push(objetosFiltrados);
  });
  usoEspacios = obtenerUsoEspacios();
  let espacios = usoEspacios.map(function (objeto) {
    return objeto.spaceUso;
  })

  espaciosUnicos = [... new Set(espacios)];
  const contadorNotariado = obtenerEspaciosUso("S.G. NOTARIADO Y DE LOS REGISTROS");
  const contadorJuridica = obtenerEspaciosUso("D.G. SEG. JURIDICA Y FE PUBLICA");
  const contadorNacionalidad = obtenerEspaciosUso("S.G. NACIONALIDAD Y ESTADO CIVIL");  
  await graficarBarEspacios(espaciosUnicos, contadorJuridica.length, contadorNacionalidad.length, contadorNotariado.length);

  ceilings = objetos.filter(function (objeto) {
    return objeto.category === "Ceilings";
  });
  falsosTechosP1 = obtenerFalsosTechos(objetos);
  sumatorioOcupacionPorEstado(estadosFiltrados);
  await graficarPie(estadosUnicos, sumatorioEStados);

  const contentPage2 = await readXlsxFile(excelInput.files[0], { sheet: 2 });
  objetosP2 = await crearObjetosP2(contentPage2);
  let fechas = objetosP2.map(function (objeto) {
    return objeto.date.getDate() + "/" + (objeto.date.getMonth() + 1);
  });
  fechasUnicas = [...new Set(fechas)];
  fechasUnicas.sort();
  const vacante = obtenerEstadosPorDia(fechasUnicas, "VACANTE");
  const ocupado = obtenerEstadosPorDia(fechasUnicas, "OCUPADO");
  const reservado = obtenerEstadosPorDia(fechasUnicas, "RESERVADO");
  await graficarBar(fechasUnicas, estadosUnicos, ocupado, reservado, vacante);
  await graficarLinear(
    fechasUnicas,
    estadosUnicos,
    ocupado,
    reservado,
    vacante
  );
});

async function crearObjetosP1(excel) {
  let objetos = [];
  for (let index = 1; index < excel.length; index++) {
    const elemento = {};
    elemento.idInterno = excel[index][0];
    elemento.category = excel[index][2];
    elemento.checkLevel = excel[index][3];
    elemento.spaceCheck = excel[index][4];
    elemento.codEspacio = excel[index][5];
    elemento.codPuesto = excel[index][6];
    elemento.estado = excel[index][8];
    elemento.globalID = excel[index][11];
    elemento.workset = excel[index][13];
    elemento.spaceUso = excel[index][14];
    objetos.push(elemento);    
  }  
  return objetos;
}

async function crearObjetosP2(page) {
  let objetos = [];
  for (let index = 1; index < page.length; index++) {
    const elemento = {};
    elemento.date = page[index][1];
    elemento.codEspacio = page[index][2];
    elemento.codPuesto = page[index][3];
    elemento.estado = page[index][4];
    elemento.globalID = page[index][5];
    objetos.push(elemento);
  }
  return objetos;
}

function obtenerSpaces(floor, level) {
  return floor.filter(function (objeto) {
    return (
      objeto.category === "Spaces" &&
      objeto.checkLevel === level &&
      objeto.workset === "AR_HABITACIONES"
    );
  });
}

function noObtenerSpaces(floor) {
  return floor.filter(function (objeto) {
    return objeto.category !== "Spaces";
  });
}

function obtenerFalsosTechos(objetos) {
  return objetos.filter(function (objeto) {
    return objeto.workset === "AR_FALSOS TECHOS";
  });
}

function obtenerEstados() {
  return objetos.filter(function (objeto) {
    return objeto.estado != "[Undefined Value]";
  });
}

function sumatorioOcupacionPorEstado(estadosFiltrados) {
  for (let i = 0; i < estadosUnicos.length; i++) {
    let sumatorio = 0;
    for (let j = 0; j < estadosFiltrados.length; j++) {
      if (estadosFiltrados[j].estado == estadosUnicos[i]) {
        sumatorio++;
      }
    }
    sumatorioEStados.push(sumatorio);
  }
}

function obtenerEstadosPorDia(fechasUnicas, estadoFiltro) {
  let arrayContador = [];
  for (let i = 0; i < fechasUnicas.length; i++) {
    let contador = 0;
    for (let j = 0; j < objetosP2.length; j++) {
      const fechaObjeto = objetosP2[j].date;
      const diaMes = fechaObjeto.getDate() + "/" + (fechaObjeto.getMonth() + 1);

      if (fechasUnicas[i] === diaMes && objetosP2[j].estado === estadoFiltro) {
        contador++;
      }
    }
    arrayContador.push(contador);
  }
  return arrayContador;
}

function obtenerEspaciosUso(tipo){
  return objetos.filter(function (objeto) {
    return objeto.spaceUso === tipo;
  });
}

function obtenerUsoEspacios(){
  return objetos.filter(function (objeto) {
    return objeto.spaceUso != null;
  });
}

export {
  objetos,
  plantasUnicas,
  plantasFiltradas,
  obtenerSpaces,
  noObtenerSpaces,
  ceilings,
  obtenerEstados,
  estadosUnicos,
  falsosTechosP1,
  objetosP2,
  usoEspacios
};
