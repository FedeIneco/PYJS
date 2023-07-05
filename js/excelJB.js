import {
  graficarBar,
  graficarLinear,
  graficarPie,
  graficarBarEspacios,
} from "./graficas.js";

const filePath = "../database/GESTION_PUESTOS.xlsx";
const barButton = document.getElementById("bar-btn");
const pieButton = document.getElementById("pie-btn");
const linearButton = document.getElementById("line-btn");
const floorsSelect = document.getElementById("floors");
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
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const content = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  const sheetName2 = workbook.SheetNames[1];
  const worksheet2 = workbook.Sheets[sheetName2];
  const content2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
  const formattedData = content2.map((row) => {
    return row.map((cell) => {
      if (typeof cell === "number" && cell >= 10 && cell <= 2958465) {
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
  crearDesplegable(plantasUnicas, floorsSelect);
  pieButton.classList.remove("disabled");
  barButton.classList.remove("disabled");
  linearButton.classList.remove("disabled");
  let fechas = objetosP2.map(function (objeto) {
    return objeto.date.substring(0, 5);
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
    // elemento.globalID = excel[index][0];
    elemento.globalID = excel[index][11];
    elemento.workset = excel[index][13];
    elemento.spaceUso = excel[index][14];
    objetos.push(elemento);
  }
  return objetos;  
}

// function agruparObjetos() {
//   const transformedData = content.map((line) => {
//     const obj = {};
//     obj.id = line[0];
//     obj.name = line[1];
//     obj.psetName = line[2];
//     obj.propertyName = line[3];
//     obj.value = line[4];
//     return obj;
//   });
//   const groupedData = transformedData.reduce((groups, obj) => {
//     const id = obj.id;
//     const name = obj.name;
//     const psetName = obj.psetName;

//     if (!groups[id]) {
//       groups[id] = {
//         id: id,
//         name: name,
//       };
//     }

//     if (!groups[id][psetName]) {
//       groups[id][psetName] = {
//         data: [],
//       };
//     }

//     groups[id][psetName].data.push({
//       propertyName: obj.propertyName,
//       value: obj.value,
//     });

//     return groups;
//   });

//   const end = performance.now();
//   const duration = end - start;
//   console.log(groupedData);
//   console.log(
//     `El proceso tardó ${duration / 1000} milisegundos en completarse.`
//   );
// }
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
      const diaMes = fechaObjeto.substring(0, 5);

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

async function crearDesplegable(datosDesplegable, select) {
  await datosDesplegable.forEach((elementoDesplegable) => {
    const option = document.createElement("option");
    option.value = elementoDesplegable;
    option.innerText = elementoDesplegable;
    select.appendChild(option);
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
  usoEspacios,
  obtenerEspaciosUso,
  obtenerOcupacion,
};

//import{graficarBar as e,graficarLinear as t,graficarPie as s,graficarBarEspacios as o}from"./graficas.js";let filePath="../database/GESTION_PUESTOS.xlsx",barButton=document.getElementById("bar-btn"),pieButton=document.getElementById("pie-btn"),linearButton=document.getElementById("line-btn"),floorsSelect=document.getElementById("floors"),objetos=[],plantasUnicas=[],plantasFiltradas=[],ceilings=[],estados=[],estadosUnicos=[],sumatorioEStados=[],objetosP2=[],fechasUnicas=[],falsosTechosP1=[],usoEspacios=[],espaciosUnicos=[],readExcelFile=async()=>{let a=await fetch("../database/GESTION_PUESTOS.xlsx"),n=await a.arrayBuffer(),r=new Uint8Array(n),c=XLSX.read(r,{type:"array"}),i=c.SheetNames[0],l=c.Sheets[i],u=XLSX.utils.sheet_to_json(l,{header:1}),p=c.SheetNames[1],f=c.Sheets[p],b=XLSX.utils.sheet_to_json(f,{header:1}),d=b.map(e=>e.map(e=>{if("number"==typeof e&&e>=10&&e<=2958465){let t=new Date((e-1)*864e5),s=t.getDate(),o=t.getMonth()+1,a=t.getFullYear();return`${s}/${o}/${a}`}return e}));objetos=await crearObjetosP1(u);let E=objetos.map(function(e){return e.checkLevel});plantasUnicas=[...new Set(E)],plantasUnicas.sort(),plantasUnicas.pop();let h=obtenerEstados();estados=h.map(function(e){return e.estado}),estadosUnicos=[...new Set(estados)],plantasUnicas.forEach(function(e){let t=objetos.filter(function(t){return t.checkLevel===e});plantasFiltradas.push(t)}),usoEspacios=obtenerUsoEspacios();let U=usoEspacios.map(function(e){return e.spaceUso});espaciosUnicos=[...new Set(U)];let S=obtenerEspaciosUso("S.G. NOTARIADO Y DE LOS REGISTROS"),g=obtenerEspaciosUso("D.G. SEG. JURIDICA Y FE PUBLICA"),P=obtenerEspaciosUso("S.G. NACIONALIDAD Y ESTADO CIVIL");await o(espaciosUnicos,g.length,P.length,S.length),ceilings=objetos.filter(function(e){return"Ceilings"===e.category}),falsosTechosP1=obtenerFalsosTechos(objetos),sumatorioOcupacionPorEstado(h),await s(estadosUnicos,sumatorioEStados),objetosP2=await crearObjetosP2(d),crearDesplegable(plantasUnicas,floorsSelect),pieButton.classList.remove("disabled"),barButton.classList.remove("disabled"),linearButton.classList.remove("disabled");let O=objetosP2.map(function(e){return e.date.substring(0,5)});(fechasUnicas=[...new Set(O)]).sort();let j=obtenerEstadosPorDia(fechasUnicas,"VACANTE"),m=obtenerEstadosPorDia(fechasUnicas,"OCUPADO"),I=obtenerEstadosPorDia(fechasUnicas,"RESERVADO");await e(fechasUnicas,estadosUnicos,m,I,j),await t(fechasUnicas,estadosUnicos,m,I,j)};async function crearObjetosP1(e){let t=[];for(let s=1;s<e.length;s++){let o={};o.idInterno=e[s][0],o.category=e[s][2],o.checkLevel=e[s][3],o.spaceCheck=e[s][4],o.codEspacio=e[s][5],o.codPuesto=e[s][6],o.estado=e[s][8],o.globalID=e[s][11],o.workset=e[s][13],o.spaceUso=e[s][14],t.push(o)}return t}async function crearObjetosP2(e){let t=[];for(let s=1;s<e.length;s++){let o={};o.date=e[s][1],o.codEspacio=e[s][2],o.codPuesto=e[s][3],o.estado=e[s][4],o.globalID=e[s][5],t.push(o)}return t}function obtenerSpaces(e,t){return e.filter(function(e){return"Spaces"===e.category&&e.checkLevel===t&&"AR_HABITACIONES"===e.workset})}function noObtenerSpaces(e){return e.filter(function(e){return"Spaces"!==e.category})}function obtenerFalsosTechos(e){return e.filter(function(e){return"AR_FALSOS TECHOS"===e.workset})}function obtenerEstados(){return objetos.filter(function(e){return"[Undefined Value]"!=e.estado})}function sumatorioOcupacionPorEstado(e){for(let t=0;t<estadosUnicos.length;t++){let s=0;for(let o=0;o<e.length;o++)e[o].estado==estadosUnicos[t]&&s++;sumatorioEStados.push(s)}}function obtenerEstadosPorDia(e,t){let s=[];for(let o=0;o<e.length;o++){let a=0;for(let n=0;n<objetosP2.length;n++){let r=objetosP2[n].date,c=r.substring(0,5);e[o]===c&&objetosP2[n].estado===t&&a++}s.push(a)}return s}function obtenerEspaciosUso(e){return objetos.filter(function(t){return t.spaceUso===e})}function obtenerUsoEspacios(){return objetos.filter(function(e){return null!=e.spaceUso})}function obtenerOcupacion(e){return objetos.filter(function(t){return t.estado===e})}async function crearDesplegable(e,t){await e.forEach(e=>{let s=document.createElement("option");s.value=e,s.innerText=e,t.appendChild(s)})}readExcelFile();export{objetos,plantasUnicas,plantasFiltradas,obtenerSpaces,noObtenerSpaces,ceilings,obtenerEstados,estadosUnicos,falsosTechosP1,objetosP2,usoEspacios,obtenerEspaciosUso,obtenerOcupacion};
