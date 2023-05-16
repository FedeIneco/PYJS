import {
  Server,
  BIMViewer,
  LocaleService,
  addObserver,
  agregarObservador,
  array,
} from "../lib/xeokit-bim-viewer/xeokit-bim-viewer.es.js";

import{ datos } from './graficas.js'
import { datosPrecios, ifcTypes, filtrarIdsPorIfcType } from "./excel.js";
import { messages as localeMessages } from "../lib/xeokit-bim-viewer/messages.js";

let types = [];
const formData = new FormData();
const boton = document.getElementById("boton");
const form = document.getElementById("myForm");
const lista = document.getElementById("listado");
const datosInput = document.getElementById("fileInput");
const barButton = document.getElementById("bar-btn");
const pieButton = document.getElementById("pie-btn");
const linearButton = document.getElementById("line-btn");
const barChart = document.getElementById("bar");
const pieChart = document.getElementById("pie");
const linearChart = document.getElementById("linear");
const statesSelect = document.getElementById("states");
const ifcTypesSelect = document.getElementById("ifcTypes");
form.style.display =
  window.location.href === "http://localhost:3000/" ? "block" : "none";
lista.style.display =
  window.location.href === "http://localhost:3000/" ? "flex" : "none";

boton.addEventListener("click", enviar);
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
    })
    .catch((error) => {
      console.error(error);
    });
}

const listado = document.getElementById("menuListado");
function archivosCreados() {
  fetch("http://localhost:3000/api/projects")
    .then((response) => response.json())
    .then((data) => {
      const filenames = data.filenames;
      filenames.forEach((filename) => {
        // Crear un elemento li
        const li = document.createElement("li");

        // Configurar el texto del elemento li
        li.innerHTML = `<a href="http://localhost:3000/?projectId=${filename}">${filename}</a>`;

        // Agregar el elemento li a la lista
        listado.appendChild(li);
      });
    })
    .catch((error) => console.error(error));
}
archivosCreados();

let todasTablaseditadas = document.createElement("table");
const exportButton = document.getElementById("export-btn");
const saveButton = document.getElementById("save-btn");

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
          bimViewer.flyToObject(objectId, () => {
            // FIXME: Showing objects in tabs involves scrolling the HTML within the tabs - disable until we know how to scroll the correct DOM element. Otherwise, that function works OK
            // bimViewer.showObjectInObjectsTab(objectId);
            // bimViewer.showObjectInClassesTab(objectId);
            // bimViewer.showObjectInStoreysTab(objectId);
          });
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
          bimViewer.viewFitObjects(objectIdArray, () => {});
          break;
        case "clearFocusObjects":
          bimViewer.setAllObjectsSelected(false);
          bimViewer.viewFitAll();
          // TODO: view fit nothing?
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

  function mostrarChecks(checks) {
    const datos = mostrarSeleccion(array);
    for (let i = 0; i < checks.length; i++) {
      bimViewer.setAllObjectsSelected(false);
      checks[i].addEventListener("change", (event) => {
        if (event.target.checked && checks[i].id == datos[i].nombre) {
          //bimViewer.setAllObjectsSelected(false);
          bimViewer.setObjectsSelected(datos[i].ids, true);
          bimViewer.viewFitObjects(datos[i].ids);
        } else {
          bimViewer.setObjectsSelected(datos[i].ids, false);
        }
      });
    }
  }

  agregarObservador(mostrarChecks);

  barButton.addEventListener("click", () => {
    barChart.classList.toggle("ocultar");
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
  });
  pieButton.addEventListener("click", () => {
    pieChart.classList.toggle("ocultar");
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
  });
  linearButton.addEventListener("click", () => {
    linearChart.classList.toggle("ocultar");
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
  });
  statesSelect.addEventListener("change", () => {    
    const ids = [];
    const ids2 = [];
    const ids3 = [];
    const ids4 = [];
    switch (statesSelect.value) {
      case "default":
        bimViewer.setAllObjectsSelected(false);
        break;
      case "state1":
        const result = datosPrecios.filter((element) => element.state == 1);
        result.forEach((element) => {
          ids.push(element.id);
        });
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setObjectsSelected(ids, true);
        bimViewer.viewFitObjects(ids);

        break;
      case "state2":
        const result2 = datosPrecios.filter((element) => element.state == 2);
        result2.forEach((element) => {
          ids2.push(element.id);
        });
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setObjectsSelected(ids2, true);
        bimViewer.viewFitObjects(ids2);
        break;
      case "state3":
        bimViewer.setAllObjectsSelected(false);
        const result3 = datosPrecios.filter((element) => element.state == 3);
        result3.forEach((element) => {
          ids3.push(element.id);
        });
        bimViewer.setObjectsSelected(ids3, true);
        bimViewer.viewFitObjects(ids3);
        break;
      case "state4":
        bimViewer.setAllObjectsSelected(false);
        const result4 = datosPrecios.filter((element) => element.state == 4);
        result4.forEach((element) => {
          ids4.push(element.id);
        });
        bimViewer.setObjectsSelected(ids4, true);
        bimViewer.viewFitObjects(ids4);
        break;
      default:
        break;
    }
  });

  datosInput.addEventListener("change", async  () => {     
  const checkIfcTypes = setInterval(() => {    
    if (datosPrecios.length > 0) {      
      clearInterval(checkIfcTypes);
      console.log(datosPrecios.filter((element) => (element.type == 'IfcWall' && element.state == 1)));
      crearDesplegableIfcTypes(ifcTypes);
      types = filtrarIdsPorIfcType(datosPrecios, ifcTypes);
      console.log(types);
    } else {
      console.log("Cargando...");
    }
  }, 1000);
 });

   function crearDesplegableIfcTypes(ifcTypes) {
    ifcTypes.forEach((ifcType) => {      
      const option = document.createElement("option");
      option.value = ifcType;
      option.innerText = ifcType;
      ifcTypesSelect.appendChild(option);
    });
  }

  ifcTypesSelect.addEventListener('change', () =>{
    const elementoSeleccionado = ifcTypesSelect.value;      
    for(let i = 0; i < types.length; i++){
      if(types[i].type == elementoSeleccionado){        
        let ids = [];
        types[i].ids.forEach((id) => {
          ids.push(id.id);
        });        
        console.log(elementoSeleccionado);
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setObjectsSelected(Object.values(ids), true);
        bimViewer.viewFitObjects(Object.values(ids));
        break; 
      } else{
        bimViewer.setAllObjectsSelected(false);
        bimViewer.viewFitAll();
      }             
    } 
  });  

  function handleChartClick() {
    const idsClick = datos.map(dato => dato.id);
    bimViewer.setAllObjectsSelected(false);
    bimViewer.setObjectsSelected(idsClick, true);
    bimViewer.viewFitObjects(idsClick);
  }
  
  barChart.addEventListener("click", handleChartClick);
  pieChart.addEventListener("click", handleChartClick);
  

  window.bimViewer = bimViewer; // For debugging


};
