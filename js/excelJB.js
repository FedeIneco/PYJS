import {
  graficarBar,
  graficarLinear,
  graficarPie,
  graficarBarEspacios,
} from "./graficas.js";


/* 
* The above code is declaring a constant variable `filePath` and assigning it the value
* "../database/GESTION_PUESTOS.xlsx". */
const filePath = "../database/GESTION_PUESTOS.xlsx";
/*
* The above code is selecting an element with the id "bar-btn" and assigning it to the variable
* "barButton". */
const barButton = document.getElementById("bar-btn");
/* 
* The above code is written in JavaScript and it is selecting an HTML element with the id "pie-btn"
* and assigning it to the constant variable "pieButton". */
const pieButton = document.getElementById("pie-btn");
/* 
* The above code is written in JavaScript and it is selecting an HTML element with the id "line-btn"
* and assigning it to the variable "linearButton". */
const linearButton = document.getElementById("line-btn");
/* 
* The above code is selecting an HTML element with the id "floors" and assigning it to the variable
* "floorsSelect". */
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

/**
 * *The function reads an Excel file, extracts data from two sheets, and formats the data by converting
 * *certain numeric values to dates.
 */
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

//*The above code is filtering and extracting unique values from an array of objects. 
  let estadosFiltrados = obtenerEstados();
  estados = estadosFiltrados.map(function (objeto) {
    return objeto.estado;
  });
  estadosUnicos = [...new Set(estados)];

/*
* The above code is filtering objects based on their checkLevel property and pushing the filtered
* objects into an array called plantasFiltradas. The filtering is done for each unique level in the
* plantasUnicas array. */
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
/* 
* The above code is defining a constant variable called "contadorNotariado" and assigning it the
* result of calling the function "obtenerEspaciosUso" with the string "S.G. NOTARIADO Y DE LOS
* REGISTROS" as an argument. */
  const contadorNotariado = obtenerEspaciosUso(
    "S.G. NOTARIADO Y DE LOS REGISTROS"
  );
/* 
* The above code is defining a constant variable called "contadorJuridica" and assigning it the result
* of calling the function "obtenerEspaciosUso" with the string "D.G. SEG. JURIDICA Y FE PUBLICA" as an
* argument. */
  const contadorJuridica = obtenerEspaciosUso(
    "D.G. SEG. JURIDICA Y FE PUBLICA"
  );
/* 
* The above code is declaring a constant variable called "contadorNacionalidad" and assigning it the
* result of calling the function "obtenerEspaciosUso" with the string "S.G. NACIONALIDAD Y ESTADO
* CIVIL" as an argument. */
  const contadorNacionalidad = obtenerEspaciosUso(
    "S.G. NACIONALIDAD Y ESTADO CIVIL"
  );
/* 
* The above code is calling a function named "graficarBarEspacios" and passing four arguments to it.
* The function is being awaited, indicating that it is an asynchronous function. The arguments being
* passed are "espaciosUnicos", "contadorJuridica.length", "contadorNacionalidad.length", and
* "contadorNotariado.length". */
  await graficarBarEspacios(
    espaciosUnicos,
    contadorJuridica.length,
    contadorNacionalidad.length,
    contadorNotariado.length
  );

/* 
* The above code is filtering an array called "objetos" to only include objects that have a category
* property equal to "Ceilings". The filtered objects are then stored in a new array called "ceilings". */
  ceilings = objetos.filter(function (objeto) {
    return objeto.category === "Ceilings";
  });
  /* 
  * The above code is declaring a variable called "falsosTechosP1" and assigning it the value returned
  * by the function "obtenerFalsosTechos" with the argument "objetos". */
  falsosTechosP1 = obtenerFalsosTechos(objetos);
  /* 
  * The above code is defining a function called "sumatorioOcupacionPorEstado" that takes in an array
  * called "estadosFiltrados" as a parameter. The purpose of the function is not clear from the given
  * code snippet. */
  sumatorioOcupacionPorEstado(estadosFiltrados);
  await graficarPie(estadosUnicos, sumatorioEStados);

  // const contentPage2 = await readXlsxFile(excelInput.files[0], { sheet: 2 });
  /* 
  * The above code is using the `await` keyword to asynchronously call the `crearObjetosP2` function
  * with the `formattedData` parameter. It is assigning the result of the function call to the
  * `objetosP2` variable. */
  objetosP2 = await crearObjetosP2(formattedData);
  /* 
  * The above code is defining a function called "crearDesplegable" that takes two parameters:
  * "plantasUnicas" and "floorsSelect". It is not clear what the function does without seeing its
  * implementation. The code also includes a comment indicating that the code is written in
  * JavaScript. */
  crearDesplegable(plantasUnicas, floorsSelect);
  /* 
  * The above code is written in JavaScript. It is removing the "disabled" class from the element with
  * the class name "pieButton". This will enable the button and allow it to be interacted with. */
  pieButton.classList.remove("disabled");
  //* The above code is removing the "disabled" class from the element with the class "barButton".
  barButton.classList.remove("disabled");
  /* 
  * The above code is written in JavaScript. It is removing the "disabled" class from an element with
  * the class name "linearButton". This will enable the button for interaction. */
  linearButton.classList.remove("disabled");
  /* 
  * The above code is creating a new array called "fechas" by using the map function on the
  * "objetosP2" array. It is iterating over each object in the "objetosP2" array and extracting the
  * first 5 characters from the "date" property of each object. The extracted substring is then added
  * to the "fechas" array. */
  let fechas = objetosP2.map(function (objeto) {
    return objeto.date.substring(0, 5);
  });
  fechasUnicas = [...new Set(fechas)];
  fechasUnicas.sort();
/* 
* The above code is calling the functions `obtenerEstadosPorDia` to obtain the states for each unique
* date, and then calling the functions `graficarBar` and `graficarLinear` to create bar and linear
* graphs respectively using the obtained states. */
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

/**
 * * The function `crearObjetosP1` takes an Excel array as input and creates an array of objects with
 * * specific properties extracted from the Excel data.
 *   @param excel - The parameter "excel" is an array that represents the data from an Excel spreadsheet.
 * * Each element in the array represents a row in the spreadsheet, and each element within the row
 * * represents a cell value. The function "crearObjetosP1" creates objects based on the data in the
 * * "excel
 *   @returns an array of objects.
 */
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
/**
 * * The function `crearObjetosP2` takes an array of arrays as input and creates an array of objects with
 * * specific properties from the input array.
 *   @param page - The `page` parameter is an array of arrays. Each inner array represents a row of data,
 * * and each element within the inner array represents a column value.
 * * @returns an array of objects.
 */
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

/**
 * * The function "obtenerSpaces" filters an array of objects based on their category, checkLevel, and
 * * workset properties.
 *   @param floor - The "floor" parameter is an array of objects representing different spaces on a
 * * floor. Each object has properties such as "category" (indicating the type of space), "checkLevel"
 * * (indicating the level of the space), and "workset" (indicating the workset of the
 *   @param level - The "level" parameter represents the level of the spaces you want to obtain.
 *   @returns an array of objects that meet the specified conditions.
 */
function obtenerSpaces(floor, level) {
  return floor.filter(function (objeto) {
    return (
      objeto.category === "Spaces" &&
      objeto.checkLevel === level &&
      objeto.workset === "AR_HABITACIONES"
    );
  });
}

/**
 * * The function filters out objects with the category "Spaces" from the given array.
 *   @param floor - The parameter "floor" is an array of objects. Each object represents a floor and has
 * * a "category" property.
 *   @returns a new array that contains all the objects from the original array "floor" except for those
 * * objects whose category is "Spaces".
 */
function noObtenerSpaces(floor) {
  return floor.filter(function (objeto) {
    return objeto.category !== "Spaces";
  });
}

/**
 * * The function "obtenerFalsosTechos" filters an array of objects and returns only the objects with the
 * * "workset" property equal to "AR_FALSOS TECHOS".
 *   @param objetos - An array of objects. Each object represents a specific item or element.
 *   @returns an array of objects that have a property "workset" with the value "AR_FALSOS TECHOS".
 */
function obtenerFalsosTechos(objetos) {
  return objetos.filter(function (objeto) {
    return objeto.workset === "AR_FALSOS TECHOS";
  });
}

/**
 * * The function "obtenerEstados" filters an array of objects to remove any objects where the "estado"
 * * property is undefined.
 *   @returns an array of objects that have a defined value for the "estado" property.
 */
function obtenerEstados() {
  return objetos.filter(function (objeto) {
    return objeto.estado != "[Undefined Value]";
  });
}

/**
 * * The function calculates the sum of occupation for each unique state in a given array of filtered
 * * states.
 *   @param estadosFiltrados - The parameter `estadosFiltrados` is an array of objects. Each object
 * * represents a state and has a property called `estado` which represents the state name.
 */
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

/**
 * * The function "obtenerEstadosPorDia" takes in an array of unique dates and a state filter, and
 * * returns an array of counts for each date that matches the state filter.
 *   @param fechasUnicas - An array of unique dates.
 *   @param estadoFiltro - The estadoFiltro parameter is the state filter that you want to apply. It is
 * * used to filter the objects based on their estado (state) property.
 *   @returns an array containing the count of occurrences of a specific state (estadoFiltro) for each
 * * unique date (fechasUnicas) in the objetosP2 array.
 */
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

/**
 * * The function "obtenerEspaciosUso" filters an array of objects based on a specified "spaceUso"
 * * property value.
 *   @param tipo - The parameter "tipo" is a string that represents the type of space usage.
 *   @returns an array of objects that have a property "spaceUso" with a value equal to the input
 * * parameter "tipo".
 */
function obtenerEspaciosUso(tipo) {
  return objetos.filter(function (objeto) {
    return objeto.spaceUso === tipo;
  });
}

/**
 * * The function "obtenerUsoEspacios" filters an array of objects to return only the objects that have a
 * * non-null value for the property "spaceUso".
 *   @returns an array of objects that have a non-null value for the property "spaceUso".
 */
function obtenerUsoEspacios() {
  return objetos.filter(function (objeto) {
    return objeto.spaceUso != null;
  });
}

/**
 * * The function "obtenerOcupacion" filters an array of objects based on their "estado" property.
 *   @param tipo - The parameter "tipo" is a string that represents the type of occupation we want to
 * * filter the objects by.
 *   @returns an array of objects that have a matching "estado" property value to the input "tipo".
 */
function obtenerOcupacion(tipo) {
  return objetos.filter(function (objeto) {
    return objeto.estado === tipo;
  });
}
readExcelFile();

/**
 * * The function "crearDesplegable" creates a dropdown menu with options based on the provided data.
 *   @param datosDesplegable - An array of data that will be used to populate the dropdown options.
 *   @param select - The `select` parameter is the HTML select element to which the options will be
 * * added.
 */
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