import {
  Server,
  BIMViewer,
  LocaleService,
  addObserver,
  agregarObservador,
  array,
} from "../lib/xeokit-bim-viewer/xeokit-bim-viewer.es.js";

import { datos, colorGrafica } from "./graficas.js";
import { messages as localeMessages } from "../lib/xeokit-bim-viewer/messages.js";
import {
  objetos,
  plantasUnicas,
  plantasFiltradas,
  obtenerSpaces,
  noObtenerSpaces,
  ceilings,
  falsosTechosP1,
  obtenerEspaciosUso,
  usoEspacios,
  obtenerOcupacion,
} from "./excelJB.js";

import { objBien, objMal, idsBien, idsMal } from "./excelpy.js";

import { ids } from "./excelpy.js";
let types = [];

const formData = new FormData();
const boton = document.getElementById("boton");
const form = document.getElementById("myForm");
const lista = document.getElementById("listado");
const filtros = document.getElementById("filtros");
const datosInput = document.getElementById("fileInput");
const graficsButton = document.getElementById("charts-container");
const barButton = document.getElementById("bar-btn");
const pieButton = document.getElementById("pie-btn");
const linearButton = document.getElementById("line-btn");
const barChart = document.getElementById("bar");
const pieChart = document.getElementById("pie");
const linearChart = document.getElementById("linear");
const floorsSelect = document.getElementById("floors");
const espaciosButton = document.getElementById("espacios");
const plantasButton = document.getElementById("plantas");
const justiciaContainer = document.getElementById("pset");
const barEspacios = document.getElementById("bar-espacios");
const capturas = document.getElementById("capturas");
const canvas = document.getElementById("myCanvas");
const ocupacionesButton = document.getElementById("ocupacion");
const checkBtn = document.getElementById("check-btn");
const correctos = document.getElementById("correctos");
const incorrectos = document.getElementById("incorrectos");
const checkContainer = document.getElementById("checkContainer");
const exportWrong = document.getElementById("exportWrong");
const checkName = document.getElementById("checkName");
const checkAllNamesButton = document.getElementById("checkAllNames");
const namesDiv = document.getElementsByClassName("xeokit-form-check");

/* 
* The above code is written in JavaScript and it is manipulating the display property of certain
* elements based on the current URL of the webpage. */
form.style.display =
  window.location.href === "http://127.0.0.1:5501/index.html" ? "block" : "none";
lista.style.display =
  window.location.href === "http://127.0.0.1:5501/index.html" ? "flex" : "none";
filtros.style.display =
  window.location.href !== "http://127.0.0.1:5501/index.html" ? "flex" : "none";
graficsButton.style.display =
  window.location.href !== "http://127.0.0.1:5501/index.html" ? "flex" : "none";
boton.addEventListener("click", enviar);

//* Función que envía el nombre del proyecto y los archivos que quiere convertir a xkt al servidor

/**
 * * The function "enviar" sends a POST request to a specified API endpoint with a text and file data,
 * * and then logs the response data to the console.
 */
function enviar() {
  const texto = document.getElementById("texto").value;
  const archivos = document.getElementById("archivo").files;
  for (let i = 0; i < archivos.length; i++) {
    formData.append("archivo", archivos[i]);
  }
  formData.append("texto", texto);
  fetch("http://localhost:3000/api/convert-to-xkt", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      archivosCreados();
    })
    .catch((error) => {
      console.error(error);
    });
}

const listado = document.getElementById("menuListado");

//*Actualiza el listado de proyectos creaados una vez se ha convertido a xkt
/**
 * * The function "archivosCreados" fetches a list of filenames from a server and dynamically creates a
 * * list of links to those filenames.
 */
function archivosCreados() {
  fetch("http://localhost:3000/api/projects")
    .then((response) => response.json())
    .then((data) => {
      listado.innerHTML = "";
      const filenames = data.filenames;
      let cont = 0;
      filenames.forEach((filename) => {
        cont++;
        // Crear un elemento li
        const li = document.createElement("li");

        // Configurar el texto del elemento li
        li.innerHTML = `<a href="http://127.0.0.1:5501/?projectId=${filename}">${cont} - ${filename}</a>`;

        // Agregar el elemento li a la lista
        listado.appendChild(li);
      });
    })
    .catch((error) => console.error(error));
}
archivosCreados();

/* 
* The above code is creating a new HTML table element using JavaScript and assigning it to the
* variable "todasTablaseditadas". It also selects the HTML elements with the IDs "export-btn" and
* "save-btn" and assigns them to the variables "exportButton" and "saveButton" respectively. */
let todasTablaseditadas = document.createElement("table");
const exportButton = document.getElementById("export-btn");
const saveButton = document.getElementById("save-btn");

/* 
* The above code is adding a click event listener to a button with the id "saveButton". When the
* button is clicked, it will display an alert message saying "Propiedad guardada con éxito" (Property
* saved successfully). */
saveButton.onclick = () => {
  alert("Propiedad guardada con éxito");
  const tables = document.querySelectorAll(".xeokit-table");
  for (let i = 0; i < tables.length; i++) {
    todasTablaseditadas.insertAdjacentHTML(
      "beforeend",
      tables[i].children[0].innerHTML
    );
  }
};
/* 
* The above code is adding a click event listener to an export button. When the button is clicked, it
* converts a table (todasTablaseditadas) into an Excel workbook using the XLSX.utils.table_to_book()
* function. It then saves the workbook as a file named "PropiedadesEditadas.xlsx" using the
* XLSX.writeFile() function. */
exportButton.onclick = () => {
  const book = XLSX.utils.table_to_book(todasTablaseditadas);
  XLSX.writeFile(book, "PropiedadesEditadas.xlsx");
};
window.onload = function () {
  const requestParams = getRequestParams();
  const locale = requestParams.locale || "en";
  const projectId = requestParams.projectId;

  if (!projectId) {
    return;
  }

  const openExplorer = requestParams.openExplorer;
  setExplorerOpen(openExplorer === "true");

  const enableEditModels = requestParams.enableEditModels === "true";

  const server = new Server({
    dataDir: "./data",
  });

  const bimViewer = new BIMViewer(server, {
    localeService: new LocaleService({
      messages: localeMessages,
      locale: locale,
    }),
    canvasElement: document.getElementById("myCanvas"), // WebGL canvas
    explorerElement: document.getElementById("myExplorer"), // Left panel
    toolbarElement: document.getElementById("myToolbar"), // Toolbar
    inspectorElement: document.getElementById("myInspector"), // Right panel
    navCubeCanvasElement: document.getElementById("myNavCubeCanvas"),
    busyModelBackdropElement: document.getElementById("myViewer"),
    enableEditModels: enableEditModels,
  });

  bimViewer.localeService.on("updated", () => {
    const localizedElements = document.querySelectorAll(".xeokit-i18n");
    localizedElements.forEach((localizedElement) => {
      if (localizedElement.dataset.xeokitI18n) {
        localizedElement.innerText = bimViewer.localeService.translate(
          localizedElement.dataset.xeokitI18n
        );
      }
      if (localizedElement.dataset.xeokitI18ntip) {
        const translation = bimViewer.localeService.translate(
          localizedElement.dataset.xeokitI18ntip
        );
        if (translation) {
          localizedElement.dataset.tippyContent =
            bimViewer.localeService.translate(
              localizedElement.dataset.xeokitI18ntip
            );
        }
      }
      if (localizedElement.dataset.tippyContent) {
        if (localizedElement._tippy) {
          localizedElement._tippy.setContent(
            localizedElement.dataset.tippyContent
          );
        } else {
          tippy(localizedElement, {
            appendTo: "parent",
            zIndex: 1000000,
            allowHTML: true,
          });
        }
      }
    });
  });

  bimViewer.setConfigs({});

  bimViewer.on("openExplorer", () => {
    setExplorerOpen(true);
  });

  bimViewer.on("openInspector", () => {
    setInspectorOpen(true);
  });

  bimViewer.on("addModel", (event) => {
    // "Add" selected in Models tab's context menu
    console.log("addModel: " + JSON.stringify(event, null, "\t"));
  });

  bimViewer.on("editModel", (event) => {
    // "Edit" selected in Models tab's context menu
    console.log("editModel: " + JSON.stringify(event, null, "\t"));
  });

  bimViewer.on("deleteModel", (event) => {
    // "Delete" selected in Models tab's context menu
    console.log("deleteModel: " + JSON.stringify(event, null, "\t"));
  });

  const viewerConfigs = requestParams.configs;
  if (viewerConfigs) {
    const configNameVals = viewerConfigs.split(",");
    for (let i = 0, len = configNameVals.length; i < len; i++) {
      const configNameValStr = configNameVals[i];
      const configNameVal = configNameValStr.split(":");
      const configName = configNameVal[0];
      const configVal = configNameVal[1];
      bimViewer.setConfig(configName, configVal);
    }
  }

  bimViewer.loadProject(
    projectId,
    () => {
      const modelId = requestParams.modelId;
      if (modelId) {
        bimViewer.loadModel(modelId);
      }
      const tab = requestParams.tab;
      if (tab) {
        bimViewer.openTab(tab);
      }
      watchHashParams();
    },
    (errorMsg) => {
      console.error(errorMsg);
    }
  );

  function watchHashParams() {
    let lastHash = "";
    window.setInterval(() => {
      const currentHash = window.location.hash;
      if (currentHash !== lastHash) {
        parseHashParams();
        lastHash = currentHash;
      }
    }, 400);
  }

  function parseHashParams() {
    const params = getHashParams();
    const actionsStr = params.actions;
    if (!actionsStr) {
      return;
    }
    const actions = actionsStr.split(",");
    if (actions.length === 0) {
      return;
    }
    for (let i = 0, len = actions.length; i < len; i++) {
      const action = actions[i];
      switch (action) {
        case "focusObject":
          const objectId = params.objectId;
          if (!objectId) {
            console.error(
              "Param expected for `focusObject` action: 'objectId'"
            );
            break;
          }
          bimViewer.setAllObjectsSelected(false);
          bimViewer.setObjectsSelected([objectId], true);
          bimViewer.flyToObject(objectId, () => { });
          break;
        case "focusObjects":
          const objectIds = params.objectIds;
          if (!objectIds) {
            console.error(
              "Param expected for `focusObjects` action: 'objectIds'"
            );
            break;
          }
          const objectIdArray = objectIds.split(",");
          bimViewer.setAllObjectsSelected(false);
          bimViewer.setObjectsSelected(objectIdArray, true);
          bimViewer.viewFitObjects(objectIdArray, () => { });
          break;
        case "clearFocusObjects":
          bimViewer.setAllObjectsSelected(false);
          bimViewer.viewFitAll();
          break;
        case "openTab":
          const tabId = params.tabId;
          if (!tabId) {
            console.error("Param expected for `openTab` action: 'tabId'");
            break;
          }
          bimViewer.openTab(tabId);
          break;
        default:
          console.error("Action not supported: '" + action + "'");
          break;
      }
    }
  }

  function setExplorerOpen(explorerOpen) {
    const toggle = document.getElementById("explorer_toggle");
    if (toggle) {
      toggle.checked = explorerOpen;
    }
  }

  function setInspectorOpen(inspectorOpen) {
    const toggle = document.getElementById("inspector_toggle");
    if (toggle) {
      toggle.checked = inspectorOpen;
    }
  }

  function getRequestParams() {
    const vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
      vars[key] = value;
    });
    return vars;
  }

  function getHashParams() {
    const hashParams = {};
    let e;
    const a = /\+/g; // Regex for replacing addition symbol with a space
    const r = /([^&;=]+)=?([^&;]*)/g;
    const d = function (s) {
      return decodeURIComponent(s.replace(a, " "));
    };
    const q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[d(e[1])] = d(e[2]);
    }
    return hashParams;
  }

  let mostrarSeleccion = (datos) => {
    return datos;
  };

  addObserver(mostrarSeleccion);

  /**
   * * The function "mostrarChecks" takes an array of checkboxes as input and updates the selection of
   * * objects in a BIM viewer based on the checked checkboxes.
   *   @param checks - The "checks" parameter is an array of HTML input elements with type "checkbox".
   * * These checkboxes are used to select or deselect certain objects in a BIM viewer.
   */
  function mostrarChecks(checks) {
    const datos = mostrarSeleccion(array);
    for (let i = 0; i < checks.length; i++) {
      bimViewer.setAllObjectsSelected(false);
      checks[i].addEventListener("change", (event) => {
        if (event.target.checked && checks[i].id == datos[i].nombre) {
          bimViewer.setObjectsSelected(datos[i].ids, true);
          bimViewer.viewFitObjects(datos[i].ids);
        } else {
          bimViewer.setObjectsSelected(datos[i].ids, false);
        }
      });
    }
  }

  agregarObservador(mostrarChecks);

  /* 
  * The above code is adding an event listener to a button with the id "barButton". When the button is
  * clicked, it toggles the "ocultar" class on the element with the id "barChart". It also checks if the
  * elements with the ids "pieChart", "linearChart", and "justiciaContainer" have the "ocultar" class,
  * and if they don't, it toggles the class on those elements as well. */
  barButton.addEventListener("click", () => {
    barChart.classList.toggle("ocultar");
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
    }
  });

  /* 
  * The above code is adding an event listener to a button with the id "pieButton". When the button is
  * clicked, it toggles the visibility of a chart with the class "pieChart". It also checks if other
  * charts and a container with the class "justiciaContainer" are visible, and toggles their visibility
  * as well. */
  pieButton.addEventListener("click", () => {
    pieChart.classList.toggle("ocultar");
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
    }
  });

  /* 
  * The above code is adding a click event listener to the "linearButton" element. When the button is
  * clicked, it toggles the "ocultar" class on the "linearChart" element. It also checks if the
  * "barChart", "pieChart", and "justiciaContainer" elements have the "ocultar" class, and toggles it if
  * they do not. */
  linearButton.addEventListener("click", () => {
    linearChart.classList.toggle("ocultar");
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
    }
  });

  /* 
  * The above code is declaring and initializing four variables: `cerrarEspacios`, `cerrarOcupaciones`,
  * `cerraEstados`, and `cerrarEstadosPlanta`. These variables are assigned the values of the
  * corresponding elements with the specified IDs in the HTML document. */
  const cerrarEspacios = document.getElementById("cerrarEspacios");
  const cerrarOcupaciones = document.getElementById("cerrarOcupaciones");
  const cerraEstados = document.getElementById("cerraEstados");
  const cerrarEstadosPlanta = document.getElementById("cerrarEstadosPlanta");



  const espaciosContainer = document.getElementById("bar-espacios");
  /* 
  * The above code is adding an event listener to the "cerrarEspacios" element. When the element is
  * clicked, it checks if the "espaciosContainer" element does not have the class "ocultar". If it does
  * not have the class, it toggles the "ocultar" class on the "espaciosContainer" element. */
  cerrarEspacios.addEventListener("click", () => {
    if (!espaciosContainer.classList.contains("ocultar")) {
      espaciosContainer.classList.toggle("ocultar");
    }
  });

  /* 
  * The above code is adding an event listener to the "cerrarOcupaciones" element. When the element is
  * clicked, it checks if the "pieChart" element does not have the class "ocultar". If it does not have
  * the class, it toggles the "ocultar" class on the "pieChart" element. */
  cerrarOcupaciones.addEventListener("click", () => {
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
  });
  /* 
  * The above code is adding an event listener to the "cerraEstados" element. When the element is
  * clicked, it checks if the "barChart" element does not have the class "ocultar". If it does not have
  * the class, it toggles the "ocultar" class on the "barChart" element. */
  cerraEstados.addEventListener("click", () => {
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
  });
  /* 
  * The above code is adding an event listener to the "cerrarEstadosPlanta" element. When the element is
  * clicked, it checks if the "linearChart" element does not have the class "ocultar". If it does not
  * have the class, it toggles the "ocultar" class on the "linearChart" element. */
  cerrarEstadosPlanta.addEventListener("click", () => {
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
  });

  /* 
  * The above code is adding an event listener to the "change" event of the "floorsSelect" element.
  * When the value of the select element changes, it retrieves the selected value and performs some
  * operations based on that value. It filters the "plantasUnicas" array to find the corresponding
  * "planta" array. It then retrieves the "globalID" values from the "planta" array and sets the
  * visibility of those objects in the "bimViewer" to true. It also fits the view to the selected
  * objects. Additionally, it adds a click event listener to the " */
  floorsSelect.addEventListener("change", () => {
    const elementoSeleccionado = floorsSelect.value;
    let planta = "";
    for (let i = 0; i < plantasUnicas.length; i++) {
      if (plantasUnicas[i] == elementoSeleccionado) {
        planta = plantasFiltradas[i];
        let ids = [];
        plantasFiltradas[i].forEach((elemento) => {
          ids.push(elemento.globalID);
        });
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setAllObjectsVisible(false);
        bimViewer.setObjectsVisible(ids, true);
        bimViewer.viewFitObjects(ids);
        let spaces = [];
        let noSpaces = [];
        espaciosButton.addEventListener("click", function () {
          const contadorNotariado = obtenerEspaciosUso(
            "S.G. NOTARIADO Y DE LOS REGISTROS"
          );
          const contadorJuridica = obtenerEspaciosUso(
            "D.G. SEG. JURIDICA Y FE PUBLICA"
          );
          const contadorNacionalidad = obtenerEspaciosUso(
            "S.G. NACIONALIDAD Y ESTADO CIVIL"
          );
          barEspacios.classList.remove("ocultar");
          let spacesids = [];
          let noSpacesids = [];
          spaces = obtenerSpaces(planta, elementoSeleccionado);
          noSpaces = noObtenerSpaces(planta, elementoSeleccionado);
          noSpaces.forEach((elemento) => {
            noSpacesids.push(elemento.globalID);
          });
          spaces.forEach((elemento) => {
            spacesids.push(elemento.globalID);
          });
          const color = convertHexToEdgeColor("#37375C");
          const color2 = convertHexToEdgeColor("#8844B5");
          const color3 = convertHexToEdgeColor("#6B84E4");

          bimViewer.setSpacesShown(true);
          bimViewer.setAllObjectsSelected(false);
          bimViewer.setAllObjectsVisible(false);
          bimViewer.setObjectsVisible(spacesids, true);
          bimViewer.setObjectsVisible(noSpacesids, false);
          contadorNotariado.forEach((elemento) => {
            const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
            objetoSeleccionado.colorize = color3;
          });
          contadorJuridica.forEach((elemento) => {
            const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
            objetoSeleccionado.colorize = color2;
          });
          contadorNacionalidad.forEach((elemento) => {
            const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
            objetoSeleccionado.colorize = color;
          });
        });
        break;
      } else {
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setAllObjectsVisible(true);
        bimViewer.viewFitAll();
      }
    }
  });

  /* 
  * The above code is adding an event listener to a button with the id "plantasButton". When the button
  * is clicked, the code performs the following actions: */
  plantasButton.addEventListener("click", function () {
    let ids = [];
    let techosIds = [];
    falsosTechosP1.forEach((elemento) => {
      techosIds.push(elemento.globalID);
    });
    ceilings.forEach((elemento) => {
      ids.push(elemento.globalID);
    });
    bimViewer.setObjectsVisible(ids, false);
    bimViewer.setObjectsVisible(techosIds, false);
    bimViewer.set3DEnabled(false);
    for (let i = 0; i < ids.length; i++) {
      bimViewer.setObjectsSelected(ids, true);
      bimViewer.setObjectsVisible(ids, false);
    }
  });

  // const checkIfcTypes = setInterval(() => {
  //   if (objetos.length > 0) {
  //     clearInterval(checkIfcTypes);
  //     crearDesplegable(plantasUnicas, floorsSelect);
  //     pieButton.classList.remove("disabled");
  //     barButton.classList.remove("disabled");
  //     linearButton.classList.remove("disabled");
  //     // types = filtrarIdsPorIfcType(datosPrecios, ifcTypes);
  //   } else {
  //     console.log("Cargando...");
  //   }
  // }, 1000);

  // async function crearDesplegable(datosDesplegable, select) {
  //  await datosDesplegable.forEach((elementoDesplegable) => {
  //     const option = document.createElement("option");
  //     option.value = elementoDesplegable;
  //     option.innerText = elementoDesplegable;
  //     select.appendChild(option);
  //   });
  // }

  /**
   * * The function `handleChartClick` selects and highlights objects in a BIM viewer based on the clicked
   * * chart data.
   */
  function handleChartClick() {
    const idsClick = datos.map((dato) => dato.globalID);
    const color = convertHexToEdgeColor(colorGrafica);
    bimViewer.viewer.scene.selectedMaterial.edgeColor = color;
    bimViewer.viewer.scene.selectedMaterial.fillColor = color;
    bimViewer.setAllObjectsSelected(false);
    bimViewer.setObjectsSelected(idsClick, true);
    bimViewer.viewFitObjects(idsClick);
  }

  /**
   * * The function "mostrarColoresOcupacion" takes an array of elements and a color as parameters, and
   * * changes the color of each element in the array to the specified color.
   *   @param elementos - An array of elements that need to be colorized.
   *   @param color - The color parameter is the color that you want to apply to the selected elements.
   */
  function mostrarColoresOcupacion(elementos, color) {
    const colorOcupacion = convertHexToEdgeColor(color);
    elementos.forEach((elemento) => {
      const objetoSeleccionado =
        bimViewer.viewer.scene.objects[elemento.globalID];
      objetoSeleccionado.colorize = colorOcupacion;
    });
  }
  /* 
  * The above code is adding an event listener to the "ocupacionesButton" element. When the button is
  * clicked, it calls the "obtenerOcupacion" function with different parameters ("OCUPADO", "RESERVADO",
  * "VACANTE") to get the occupation status. Then, it calls the "mostrarColoresOcupacion" function with
  * the occupation status and a corresponding color code to display the colors for each occupation
  * status. */
  ocupacionesButton.addEventListener("click", () => {
    const ocupado = obtenerOcupacion("OCUPADO");
    const reservado = obtenerOcupacion("RESERVADO");
    const vacante = obtenerOcupacion("VACANTE");
    mostrarColoresOcupacion(ocupado, "#ff4d4d");
    mostrarColoresOcupacion(reservado, "#ffff4d");
    mostrarColoresOcupacion(vacante, "#70db70");
  });
  /*
  * The above code is adding event listeners to the "barChart" and "pieChart" elements. When either of
  * these elements is clicked, the "handleChartClick" function will be executed. */
  barChart.addEventListener("click", handleChartClick);
  pieChart.addEventListener("click", handleChartClick);

  /**
   * * The function `convertRgbToEdgeColor` takes an RGB color string and returns an array of normalized
   * * values for the red, green, and blue components.
   *   @param rgbColor - The `rgbColor` parameter is a string representing an RGB color in the format
   * * "rgb(x, y, z)", where x, y, and z are integers between 0 and 255 representing the red, green, and
   * * blue components of the color, respectively.
   *   @returns The function `convertRgbToEdgeColor` returns an array of three values representing the red,
   * * green, and blue components of the input RGB color. If the input is not a valid RGB color (i.e., does
   * * not have three components), the function returns `null`.
   */
  function convertRgbToEdgeColor(rgbColor) {
    const components = rgbColor.match(/\d+/g);

    if (components && components.length === 3) {
      const red = parseInt(components[0], 10) / 255;
      const green = parseInt(components[1], 10) / 255;
      const blue = parseInt(components[2], 10) / 255;

      return [red, green, blue];
    } else {
      return null;
    }
  }

  /**
   * * The function "convertHexToEdgeColor" converts a hexadecimal color value to an array of decimal
   * * values representing the red, green, and blue components of the color.
   *   @param hexColor - The hexColor parameter is a string representing a hexadecimal color value.
   *   @returns an array containing the decimal values of the red, green, and blue components of the input
   * * hexadecimal color.
   */
  function convertHexToEdgeColor(hexColor) {
    // Convierte el valor hexadecimal a decimales
    const red = parseInt(hexColor.slice(1, 3), 16) / 255;
    const green = parseInt(hexColor.slice(3, 5), 16) / 255;
    const blue = parseInt(hexColor.slice(5, 7), 16) / 255;

    // Retorna el edgeColor en el formato adecuado
    return [red, green, blue];
  }
  /* 
  * The above code is adding an event listener to the "capturas" element. When the element is clicked,
  * it will execute an asynchronous function. Inside the function, it captures a snapshot of the
  * "bimViewer" viewer. The snapshot is in PNG format and has the same width and height as the "canvas"
  * element. It also includes gizmos in the snapshot. */
  capturas.addEventListener("click", async (event) => {
    const imagen = bimViewer.viewer.getSnapshot({
      format: "png",
      width: canvas.width,
      height: canvas.height,
      includeGizmos: true,
    });
    /* 
    * The above code is sending an image file to a server using a POST request. It creates a new FormData
    * object and appends the image file to it. Then, it sends the FormData object as the body of the fetch
    * request to the "http://localhost:3000/guardar-imagen" endpoint. If the response from the server is
    * successful (status code 200), it logs a success message to the console and redirects the user to the
    * "captura" page. If there is an error in sending the request or the response from the server is not
    * successful, it logs an error message */
    const formData = new FormData();
    formData.append("imagen", imagen);

    try {
      const response = await fetch("http://localhost:3000/guardar-imagen", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Imagen guardada en el servidor");
        window.location.href = "captura";
      } else {
        console.error("Error al guardar la imagen en el servidor");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud al servidor:", error);
    }
  });

  /* 
  * The above code is adding an event listener to a button with the id "checkBtn". When the button is
  * clicked, it toggles the class "ocultar" on an element with the class "checkContainer". */
  checkBtn.addEventListener("click", () => {
    checkContainer.classList.toggle("ocultar");
  });

  /* 
  * The above code is adding an event listener to the "correctos" element. When the element is clicked,
  * it hides the "checkContainer" element, changes the edge color and fill color of the selected
  * material in the BIM viewer scene to green, deselects all objects in the BIM viewer, selects the
  * objects with the IDs specified in the "idsBien" array, and fits the view to the selected objects. */
  correctos.addEventListener("click", () => {
    checkContainer.classList.add("ocultar");
    bimViewer.viewer.scene.selectedMaterial.edgeColor = [0, 1, 0];
    bimViewer.viewer.scene.selectedMaterial.fillColor = [0, 1, 0];
    bimViewer.setAllObjectsSelected(false);
    bimViewer.setObjectsSelected(idsBien, true);
    bimViewer.viewFitObjects(idsBien);
  });

  /* 
  * The above code is adding an event listener to the "incorrectos" element. When the element is
  * clicked, it hides the "checkContainer" element, changes the edge and fill color of the selected
  * material in the "bimViewer" object, sets all objects in the "bimViewer" object as not selected, sets
  * specific objects with the IDs in the "idsMal" array as selected, and fits the view to the selected
  * objects. */
  incorrectos.addEventListener("click", () => {
    checkContainer.classList.add("ocultar");
    bimViewer.viewer.scene.selectedMaterial.edgeColor = [1, 0, 0];
    bimViewer.viewer.scene.selectedMaterial.fillColor = [1, 0, 0];
    bimViewer.setAllObjectsSelected(false);
    bimViewer.setObjectsSelected(idsMal, true);
    bimViewer.viewFitObjects(idsMal);
  });

  /* 
  * The above code is adding an event listener to the "exportWrong" element. When the element is
  * clicked, the code performs the following steps: */
  exportWrong.addEventListener("click", () => {
    const allKeys = new Set();
    objMal.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });
    const dataArray = objMal.map((item) => {
      const row = [];
      allKeys.forEach((key) => {
        if (typeof item[key] === "object" && item[key] !== null) {
          row.push(JSON.stringify(item[key]));
        } else {
          row.push(item[key]);
        }
      });
      return row;
    });

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.aoa_to_sheet([[...allKeys], ...dataArray]);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const excelBuffer = XLSX.write(workbook, {
      type: "array",
      bookType: "xlsx",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    /* 
    * The above code is creating a downloadable link for a file (in this case, an Excel file with the name
    * "datos.xlsx") and triggering a click event on that link to initiate the download. After the download
    * is complete, the link is removed from the document. Additionally, a success message is displayed
    * using the Swal.fire function from the SweetAlert library. */
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "datos.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    Swal.fire({
      title: "Éxito",
      text: "Datos exportados correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  });

  /* 
  * The above code is adding an event listener to a button with the id "checkAllNamesButton". When the
  * button is clicked, it will display a success message using the Swal.fire function from the
  * SweetAlert library. The success message will have a title, text, icon, and a confirm button. */
  checkAllNamesButton.addEventListener("click", () => {
    Swal.fire({
      title: "Éxito",
      text: "Datos exportados correctamente",
      icon: "success",
      confirmButtonText: "Aceptar",
    });
  })
  checkName.addEventListener("click", checkProjectName);

  /**
   * * The function `checkProjectName` checks if the names of projects in a given array match a given
   * * regular expression, and displays a warning message if any of the names do not meet the standards.
   *   @param nameProjects - An array of project names.
   *   @param regExp - The `regExp` parameter is a regular expression that is used to check if a project
   * * name meets certain standards.
   */
  function checkProjectName(nameProjects, regExp) {
    let check = true;
    for (let i = 0; i < namesDiv.length; i++) {
      const labelElements = namesDiv[i].querySelectorAll('label');
      console.log(namesDiv[i]);
      console.log(labelElements[0].innerHTML);
      if (!(regExp.test(labelElements[0].innerHTML))) {
        check = false;
      }
      if (!check) {
        Swal.fire({
          title: "Atención",
          text: "Alguno de los nombres no ha cumplido con los estándares",
          icon: "warning",
          confirmButtonText: "Aceptar",
        });
      }
    }
    Swal.fire({
      title: "Información",
      text: "Checkeo completado",
      icon: "info",
      confirmButtonText: "Aceptar",
    });
  }
  window.bimViewer = bimViewer;
};
