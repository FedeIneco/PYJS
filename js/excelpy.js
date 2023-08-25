const ifcType = document.getElementById("ifcType");
const resultado = document.getElementById("resultado");
const porcentaje = document.getElementById("porcentaje");
const ifcTypeText = document.getElementById("ifcTypeText");
const filePath =
  "../database/BEXEL Property Checker Sample Spreadsheet BASIC.xlsx";
let namePattern;
let propertyPattern;
let dataTerm;
let dataBeams;
let objs;
let arrayObjetos;
let ids = [];
let objBien;
let objMal;
let idsBien;
let idsMal;
const readExcelFile = async () => {
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[2];
  const worksheet = workbook.Sheets[sheetName];
  const projectNamingContent = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  });
  const sheetName2 = workbook.SheetNames[3];
  const worksheet2 = workbook.Sheets[sheetName2];
  const propertyNamingContent = XLSX.utils.sheet_to_json(worksheet2, {
    header: 1,
  });
  const sheetName3 = workbook.SheetNames[5];
  const worksheet3 = workbook.Sheets[sheetName3];
  const airTerminalContent = XLSX.utils.sheet_to_json(worksheet3, {
    header: 1,
  });
  const sheetName4 = workbook.SheetNames[6];
  const worksheet4 = workbook.Sheets[sheetName4];
  const beamsContent = XLSX.utils.sheet_to_json(worksheet4, { header: 1 });
  namePattern = pNaming(projectNamingContent);
  propertyPattern = propertyPat(propertyNamingContent);
  dataTerm = airTerm(airTerminalContent);
  dataBeams = beams(beamsContent);
};

function pNaming(data) {
  let namingPatterns = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.domain = data[index][0];
    elemento.property = data[index][1];
    elemento.namingPattern = data[index][2];
    elemento.test = data[index][3];
    namingPatterns.push(elemento);
  }
  return namingPatterns;
}

function propertyPat(data) {
  let pPatterns = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.category = data[index][0];
    elemento.propertyNamePattern = data[index][1];
    elemento.test = data[index][2];
    pPatterns.push(elemento);
  }
  return pPatterns;
}

function airTerm(data) {
  let dataTerm = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    dataTerm.push(elemento);
  }
  return dataTerm;
}

function beams(data) {
  let databeams = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    databeams.push(elemento);
  }
  return databeams;
}

function ceilings(data) {
  let ceilings = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    ceilings.push(elemento);
  }
  return ceilings;
}

function curtainPanels(data) {
  let panels = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    panels.push(elemento);
  }
  return panels;
}

function curtainWalls(data) {
  let walls = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    walls.push(elemento);
  }
  return walls;
}

function doors(data) {
  let doors = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    doors.push(elemento);
  }
  return doors;
}

function furniture(data) {
  let furniture = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    furniture.push(elemento);
  }
  return furniture;
}

// function furniture(data)
// {
//     let furniture = [];
//     for (let index = 1; index < data.length; index++) {
//         const elemento = {};
//         elemento.parameterName = data[index][0];
//         elemento.pset = data[index][1];
//         elemento.valueType = data[index][2];
//         elemento.phase = data[index][3];
//         elemento.condition = data[index][4];
//         elemento.key = data[index][5];
//         furniture.push(elemento);
//       }
//       return furniture;
// }

function pipes(data) {
  let pipes = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    pipes.push(elemento);
  }
  return pipes;
}

function railings(data) {
  let railings = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    railings.push(elemento);
  }
  return railings;
}

function roofs(data) {
  let roofs = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    roofs.push(elemento);
  }
  return roofs;
}

function site(data) {
  let site = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    site.push(elemento);
  }
  return site;
}

function slabs(data) {
  let slabs = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    slabs.push(elemento);
  }
  return slabs;
}

function stairs(data) {
  let stairs = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    stairs.push(elemento);
  }
  return stairs;
}

function walls(data) {
  let walls = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    walls.push(elemento);
  }
  return walls;
}

function windows(data) {
  let windows = [];
  for (let index = 1; index < data.length; index++) {
    const elemento = {};
    elemento.parameterName = data[index][0];
    elemento.pset = data[index][1];
    elemento.valueType = data[index][2];
    elemento.phase = data[index][3];
    elemento.condition = data[index][4];
    elemento.key = data[index][5];
    windows.push(elemento);
  }
  return windows;
}

async function readExcel2File() {
  const response = await fetch("../database/pruebas3.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const content = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  objs = await agruparObjetos(content);
  console.log(arrayObjetos);
  testName(namePattern, arrayObjetos);
  crearSelect();
}

async function agruparObjetos(content) {
  const start = performance.now();
  const transformedData = content.map((line) => {
    const obj = {};
    obj.id = line[0];
    obj.name = line[1];
    obj.psetName = line[2];
    obj.propertyName = line[3];
    obj.value = line[4];
    obj.type = line[5];
    return obj;
  });

  const groupedData = transformedData.reduce((groups, obj) => {
    const id = obj.id;
    const name = obj.name;
    const type = obj.type;
    const psetName = obj.psetName;

    if (!groups[id]) {
      groups[id] = {
        id: id,
        name: name,
        type: type,
      };
    }

    if (!groups[id][psetName]) {
      groups[id][psetName] = {
        data: [],
      };
    }

    groups[id][psetName].data.push({
      propertyName: obj.propertyName,
      value: obj.value,
    });

    return groups;
  }, {});

  const end = performance.now();
  const duration = end - start;
  console.log(`El proceso tardó ${duration} milisegundos en completarse.`);

  arrayObjetos = groupedData;
}

function obtenerTypes(arrayObjetos) {
  let typesSet = new Set();
  for (let objeto of Object.values(arrayObjetos)) {
    typesSet.add(objeto.type);
  }
  const ordenar = Array.from(typesSet).sort();
  const arrayFinal = ordenar.slice(2);
  return arrayFinal;
}

// function testName(regName, arrayObjetos) {
//   let contadorTotal = 0;
//   let contadorBien = 0;
//   let regex = new RegExp(/^BMP_.*$/);
//   console.log(regex);

//   for (let objeto of Object.values(arrayObjetos)) {
//     //if (objeto.type == "IfcBuildingElementProxy") {
//     if (!regex.test(objeto.name)) {
//       // console.log("No han pasado el test: ");
//       // //console.log(objeto);
//       // console.log("------------------------ ");
//       contadorTotal++;
//       ids.push(objeto.id); //
//     } else {
//       if (regex.test(objeto.name)) {
//         //   console.log("Han pasado el test: ");
//         //   //console.log(objeto);
//         //   console.log("------------------------ ");
//         contadorBien++;
//         contadorTotal++;
//         //}
//       }
//     }
//   }
//   console.log(contadorTotal);
//   console.log(
//     `Han pasado la prueba el ${(contadorBien / contadorTotal) * 100} %`
//   );
// }

function crearSelect() {
  let types = obtenerTypes(arrayObjetos);
  types.forEach((elementoDesplegable) => {
    const option = document.createElement("option");
    option.value = elementoDesplegable;
    option.innerText = elementoDesplegable;
    ifcType.appendChild(option);
  });
}

ifcType.addEventListener("change", (e) => {
  let objetos = [];
  const selectedValue = e.target.value;
  objetos = obtenerIdsxIfc(selectedValue);
  const regex = /^0550_ARQ.*$/;
  console.log(objetos);
  testName(regex, objetos, selectedValue);
});

function testName(regExp, objetos, type) {
  let cont = 0;
  let contBien = 0;
  objBien = [];
  objMal = [];
  idsBien = [];
  idsMal = [];
  for (let i = 0; i < objetos.length; i++) {
    if (regExp.test(objetos[i].name)) {
      idsBien.push(objetos[i].id);
      objBien.push(objetos[i]);
      contBien++;
      cont++;
    } else {
      idsMal.push(objetos[i].id);
      objMal.push(objetos[i]);
      cont++;
    }
  }
  let percent = (contBien / cont) * 100;
  const porcentajeTruncado = percent.toFixed(0);
  ifcTypeText.innerHTML = type;
  porcentaje.innerHTML = porcentajeTruncado;
  if (porcentajeTruncado == 100) {
    resultado.style.color = "green";
  } else if (porcentajeTruncado== 0) {
    resultado.style.color = "red";
  } else {
    resultado.style.color = "orange";
  }
}

function obtenerIdsxIfc(selectedValue) {
  let ids = [];
  for (let objeto of Object.values(arrayObjetos)) {
    if (objeto.type == selectedValue) {
      ids.push(objeto);
    }
  }
  return ids;
}

readExcelFile();
readExcel2File();

export { ids, objBien, objMal, idsBien, idsMal };
