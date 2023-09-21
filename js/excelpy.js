//*Leer xlsx en las que se muestran las regExp para validar elementos

/* 
* The above code is written in JavaScript and it is defining variables and selecting elements from the
* HTML document using their respective IDs. */
const ifcType = document.getElementById("ifcType");
const resultado = document.getElementById("resultado");
const porcentaje = document.getElementById("porcentaje");
const ifcTypeText = document.getElementById("ifcTypeText");
/* 
* The above code is declaring a constant variable `filePath` and assigning it a string value
* representing the file path to a spreadsheet file named "BEXEL Property Checker Sample Spreadsheet
* BASIC.xlsx" located in the "../database" directory. */
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
let idsMal;/**
 * The function `readExcelFile` reads data from an Excel file and converts specific sheets
 * into JSON format.
 */

/**
 * *The function `readExcelFile` reads data from an Excel file and converts specific sheets into JSON
 * *format.
 */
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

/**
 * *The function `pNaming` takes in an array of data and extracts specific elements to create an array
 * *of naming patterns.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data
 * *and contains four elements: the domain, the property, the naming pattern, and the test.
 * @returns an array of objects that represent naming patterns.
 */
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

/**
 * *The function `propertyPat` takes in an array of data and creates an array of objects with properties
 * *based on the data.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *where each element in the inner array represents a column value. The first element in each inner
 * *array represents the category, the second element represents the property name pattern, and the
 * *third element represents the test.
 * @returns an array of objects, where each object has the properties "category",
 * *"propertyNamePattern", and "test".
 */
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

/**
 * *The function "airTerm" takes in a 2D array of data and converts it into an array of objects with
 * *specific properties.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns The function `airTerm` returns an array `dataTerm` containing objects with properties
 * *`parameterName`, `pset`, `valueType`, `phase`, and `condition`.
 */
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

/**
 * *The function "beams" takes in a 2D array of data and converts it into an array of objects with
 * *specific properties.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a set of data
 * *for a beam. The inner arrays have the following structure:
 * @returns The function `beams` returns an array `databeams` containing objects with properties
 * *`parameterName`, `pset`, `valueType`, `phase`, `condition`, and `key`.
 */
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

/**
 * *The function "ceilings" takes in a 2D array of data and returns an array of objects with specific
 * *properties extracted from the data.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns an array of objects called "ceilings".
 */
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

/**
 * *The function `curtainPanels` takes in an array of data and returns an array of objects representing
 * *curtain panels.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns The function `curtainPanels` returns an array of objects representing curtain panels.
 */
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

/**
 * *The function "curtainWalls" takes in a 2D array of data and returns an array of objects representing
 * *curtain walls.
 * @param data - An array of arrays containing the data for each curtain wall. Each inner array
 * *represents a curtain wall and contains the following elements:
 * @returns The function `curtainWalls` returns an array of objects representing curtain walls.
 */
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

/**
 * *The function "doors" takes in a 2D array of data and returns an array of objects representing doors.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns an array of objects representing doors.
 */
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

/**
 * *The function "furniture" takes in an array of data and returns an array of objects representing
 * *furniture items.
 * @param data - An array of arrays, where each inner array represents a row of data. Each inner array
 * *should have 6 elements, representing the values for the following properties of a furniture item:
 * *parameterName, pset, valueType, phase, condition, and key.
 * @returns an array of objects representing furniture items.
 */
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

/**
 * *The function "pipes" takes in a 2D array of data and converts it into an array of objects with
 * *specific properties.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a pipe and
 * *contains the following elements:
 * @returns an array of objects representing pipes.
 */
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

/**
 * *The railings function takes in a 2D array of data and converts it into an array of objects with
 * *specific properties.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a set of data
 * *for a railing. The inner arrays have the following structure:
 * @returns an array of objects called "railings".
 */
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

/**
 * *The function "roofs" takes in a 2D array of data and returns an array of objects representing roofs.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns an array of objects representing roofs.
 */
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

/**
 * *The function "site" takes in an array of data and returns a new array of objects with specific
 * *properties assigned from the input data.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *where each element in the inner array represents a column value.
 * @returns an array called "site" which contains objects.
 */
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

/**
 * *The function "slabs" takes in a 2D array of data and returns an array of objects with specific
 * *properties extracted from the data.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns an array of objects called "slabs".
 */
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

/**
 * *The `stairs` function takes in an array of data and returns an array of objects representing stairs.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a set of
 * *parameters for a stair. The inner arrays have the following structure:
 * @returns an array called "stairs" which contains objects.
 */
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

/**
 * *The function "walls" takes in an array of data and returns an array of objects representing walls.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a wall and
 * *contains the following elements:
 * @returns an array of objects representing walls.
 */
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
/**
 * *The function "windows" takes in an array of data and returns an array of objects representing
 * *windows.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a row of data,
 * *and each element within the inner array represents a column value.
 * @returns The function `windows` returns an array of objects representing windows.
 */

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

/**
 * *The function reads an Excel file, converts it to an array, and then converts the array to JSON
 * *format.
 * *Lee los datos del IFC extraidos de manera automática con el script .py
 */

async function readExcel2File() {
  const response = await fetch("../database/pruebas3.xlsx");
  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const content = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  objs = await agruparObjetos(content);
  testName(namePattern, arrayObjetos);
  crearSelect();
}

async function agruparObjetos(content) {
  const start = performance.now();
  /* 
  * The above code is transforming an array of arrays called "content" into an array of objects called
  * "transformedData". Each object in the "transformedData" array has properties "id", "name",
  * "psetName", "propertyName", "value", and "type". The values of these properties are extracted from
  * the corresponding elements in each subarray of "content". */
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

  /* 
  * The above code is grouping data based on the "id" property of each object in the "transformedData"
  * array. It creates a new object called "groupedData" which will store the grouped data. */
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
  // console.log(`El proceso tardó ${duration} milisegundos en completarse.`);

  arrayObjetos = groupedData;
}

/**
 * *The function "obtenerTypes" takes an array of objects and returns an array of unique "type" values
 * *from those objects, sorted in alphabetical order, excluding the first two values.
 * @param arrayObjetos - The parameter `arrayObjetos` is an array of objects. Each object in the array
 * *has a property called `type`.
 * @returns an array containing the unique "type" values from the objects in the input array, sorted in
 * *alphabetical order, starting from the third element.
 */
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

/**
 * *The function "crearSelect" creates a select element and populates it with options based on the types
 * *obtained from an array of objects.
 */
function crearSelect() {
  let types = obtenerTypes(arrayObjetos);
  types.forEach((elementoDesplegable) => {
    const option = document.createElement("option");
    option.value = elementoDesplegable;
    option.innerText = elementoDesplegable;
    ifcType.appendChild(option);
  });
}

/* 
* The above code is adding an event listener to the "change" event of the `ifcType` element. When the
* value of `ifcType` changes, the code will execute the callback function. */
ifcType.addEventListener("change", (e) => {
  let objetos = [];
  const selectedValue = e.target.value;
  objetos = obtenerIdsxIfc(selectedValue);
  const regex = /^0550_ARQ.*$/;
  // console.log(objetos);
  testName(regex, objetos, selectedValue);
});

/**
 * *The function `testName` takes in a regular expression, an array of objects, and a type, and checks
 * *if the `name` property of each object matches the regular expression, keeping track of the number of
 * *matches and non-matches, and calculating the percentage of matches.
 * @param regExp - The `regExp` parameter is a regular expression that is used to test the `name`
 * *property of each object in the `objetos` array. It is used to determine whether the `name` property
 * *matches a certain pattern or criteria.
 * @param objetos - The "objetos" parameter is an array of objects. Each object in the array has
 * *properties such as "id" and "name".
 * @param type - The type parameter is a string that represents the type of objects being tested.
 */
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
  } else if (porcentajeTruncado == 0) {
    resultado.style.color = "red";
  } else {
    resultado.style.color = "orange";
  }
}

/**
 * *The function "obtenerIdsxIfc" takes a selected value as input and returns an array of objects that
 * *have a matching type property.
 * @param selectedValue - The selectedValue parameter is the value that you want to filter the array of
 * *objects by.
 * @returns an array of objects that have a property "type" equal to the selectedValue.
 */
function obtenerIdsxIfc(selectedValue) {
  let ids = [];
  for (let objeto of Object.values(arrayObjetos)) {
    if (objeto.type == selectedValue) {
      ids.push(objeto);
    }
  }
  return ids;
}

/* 
* The above code is written in JavaScript and it is calling two functions: readExcelFile() and
* readExcel2File(). */
readExcelFile();
readExcel2File();

export { ids, objBien, objMal, idsBien, idsMal };
