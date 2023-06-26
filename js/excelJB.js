import {
  graficarBar,
  graficarLinear,
  graficarPie,
  graficarBarEspacios,
} from "./graficas.js";
//const excelInput = document.getElementById("fileInput");

const filePath = "../database/GESTION_PUESTOS.xlsx";
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

const readExcelFile = async () => {  
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const content = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const sheetName2 = workbook.SheetNames[1];
  const worksheet2 = workbook.Sheets[sheetName2];
  const content2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
  const formattedData = content2.map(row => {
    return row.map(cell => {
      if (typeof cell === 'number' && cell >= 10 && cell <= 2958465) {
        const excelDate = new Date((cell - 1) * 24 * 60 * 60 * 1000);
        const day = excelDate.getDate();
        const month = excelDate.getMonth() + 1;
        const year = excelDate.getFullYear();
        return `${day}/${month}/${year}`;
      }
      return cell;
    });
  });


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
  });

  espaciosUnicos = [...new Set(espacios)];
  const contadorNotariado = obtenerEspaciosUso(
    "S.G. NOTARIADO Y DE LOS REGISTROS"
  );
  const contadorJuridica = obtenerEspaciosUso(
    "D.G. SEG. JURIDICA Y FE PUBLICA"
  );
  const contadorNacionalidad = obtenerEspaciosUso(
    "S.G. NACIONALIDAD Y ESTADO CIVIL"
  );
  await graficarBarEspacios(
    espaciosUnicos,
    contadorJuridica.length,
    contadorNacionalidad.length,
    contadorNotariado.length
  );

  ceilings = objetos.filter(function (objeto) {
    return objeto.category === "Ceilings";
  });
  falsosTechosP1 = obtenerFalsosTechos(objetos);
  sumatorioOcupacionPorEstado(estadosFiltrados);
  await graficarPie(estadosUnicos, sumatorioEStados);

  // const contentPage2 = await readXlsxFile(excelInput.files[0], { sheet: 2 });
  objetosP2 = await crearObjetosP2(formattedData);
  let fechas = objetosP2.map(function (objeto) {    
    return objeto.date.substring(0,5);
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
};

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
      const diaMes = fechaObjeto.substring(0,5);

      if (fechasUnicas[i] === diaMes && objetosP2[j].estado === estadoFiltro) {
        contador++;
      }
    }
    arrayContador.push(contador);
  }
  return arrayContador;
}

function obtenerEspaciosUso(tipo) {
  return objetos.filter(function (objeto) {
    return objeto.spaceUso === tipo;
  });
}

function obtenerUsoEspacios() {
  return objetos.filter(function (objeto) {
    return objeto.spaceUso != null;
  });
}

function obtenerOcupacion(tipo) {
  return objetos.filter(function (objeto) {
    return objeto.estado === tipo;
  });
}
readExcelFile();

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
  usoEspacios,
  obtenerEspaciosUso,
  obtenerOcupacion,
};
