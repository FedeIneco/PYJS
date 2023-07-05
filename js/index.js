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

form.style.display =
  window.location.href === "https://xkt.onrender.com/" ? "block" : "none";
lista.style.display =
  window.location.href === "https://xkt.onrender.com/" ? "flex" : "none";
filtros.style.display =
  window.location.href !== "https://xkt.onrender.com/" ? "flex" : "none";
  graficsButton.style.display =
  window.location.href !== "https://xkt.onrender.com/" ? "flex" : "none";
boton.addEventListener("click", enviar);

//Función que envía el nombre del proyecto y los archivos que quiere convertir a xkt al servidor
function enviar() {
  const texto = document.getElementById("texto").value;
  const archivos = document.getElementById("archivo").files;
  for (let i = 0; i < archivos.length; i++) {
    formData.append("archivo", archivos[i]);
  }
  formData.append("texto", texto);
  fetch("https://xkt.onrender.com/api/convert-to-xkt", {
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

//Actualiza el listado de proyectos creaados una vez se ha convertido a xkt
function archivosCreados() {
  fetch("https://xkt.onrender.com/api/projects")
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
        li.innerHTML = `<a href="https://xkt.onrender.com/?projectId=${filename}">${cont} - ${filename}</a>`;

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
          bimViewer.flyToObject(objectId, () => {});
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
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
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
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
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
    if (!justiciaContainer.classList.contains("ocultar")) {
      justiciaContainer.classList.toggle("ocultar");
    }
  });
  const cerrarEspacios = document.getElementById("cerrarEspacios");
  const cerrarOcupaciones = document.getElementById("cerrarOcupaciones");
  const cerraEstados = document.getElementById("cerraEstados");
  const cerrarEstadosPlanta = document.getElementById("cerrarEstadosPlanta");
 
  const espaciosContainer = document.getElementById("bar-espacios");
  cerrarEspacios.addEventListener("click", () => {
    if (!espaciosContainer.classList.contains("ocultar")) {
      espaciosContainer.classList.toggle("ocultar");
    }
  });
  
  cerrarOcupaciones.addEventListener("click", () => {
    if (!pieChart.classList.contains("ocultar")) {
      pieChart.classList.toggle("ocultar");
    }
  });
  cerraEstados.addEventListener("click", () => {
    if (!barChart.classList.contains("ocultar")) {
      barChart.classList.toggle("ocultar");
    }
  });
  cerrarEstadosPlanta.addEventListener("click", () => {
    if (!linearChart.classList.contains("ocultar")) {
      linearChart.classList.toggle("ocultar");
    }
  });
  
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
          // contadorNotariado.forEach((elemento) => {
          //   const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
          //   objetoSeleccionado.colorize = color3;
          // });
          // contadorJuridica.forEach((elemento) => {
          //   const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
          //   objetoSeleccionado.colorize = color2;
          // });
          // contadorNacionalidad.forEach((elemento) => {
          //   const objetoSeleccionado = bimViewer.viewer.scene.objects[elemento.globalID];
          //   objetoSeleccionado.colorize = color;
          // });
        });
        break;
      } else {
        bimViewer.setAllObjectsSelected(false);
        bimViewer.setAllObjectsVisible(true);
        bimViewer.viewFitAll();
      }
    }
  });

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

  function handleChartClick() {
    const idsClick = datos.map((dato) => dato.globalID);
    const color = convertHexToEdgeColor(colorGrafica);
    bimViewer.viewer.scene.selectedMaterial.edgeColor = color;
    bimViewer.viewer.scene.selectedMaterial.fillColor = color;
    bimViewer.setAllObjectsSelected(false);
    bimViewer.setObjectsSelected(idsClick, true);
    bimViewer.viewFitObjects(idsClick);
  }

  function mostrarColoresOcupacion(elementos, color) {
    const colorOcupacion = convertHexToEdgeColor(color);
    elementos.forEach((elemento) => {
      const objetoSeleccionado =
        bimViewer.viewer.scene.objects[elemento.globalID];
      objetoSeleccionado.colorize = colorOcupacion;
    });
  }
  ocupacionesButton.addEventListener("click", () => {
    const ocupado = obtenerOcupacion("OCUPADO");
    const reservado = obtenerOcupacion("RESERVADO");
    const vacante = obtenerOcupacion("VACANTE");
    mostrarColoresOcupacion(ocupado, "#ff4d4d");
    mostrarColoresOcupacion(reservado, "#ffff4d");
    mostrarColoresOcupacion(vacante, "#70db70");
  });
  barChart.addEventListener("click", handleChartClick);
  pieChart.addEventListener("click", handleChartClick);

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

  function convertHexToEdgeColor(hexColor) {
    // Convierte el valor hexadecimal a decimales
    const red = parseInt(hexColor.slice(1, 3), 16) / 255;
    const green = parseInt(hexColor.slice(3, 5), 16) / 255;
    const blue = parseInt(hexColor.slice(5, 7), 16) / 255;

    // Retorna el edgeColor en el formato adecuado
    return [red, green, blue];
  }
  capturas.addEventListener("click", async (event) => {
    const imagen = bimViewer.viewer.getSnapshot({
      format: "png",
      width: canvas.width,
      height: canvas.height,
      includeGizmos: true,
    });
    const formData = new FormData();
    formData.append("imagen", imagen);

    try {
      const response = await fetch("https://xkt.onrender.com/guardar-imagen", {
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

  window.bimViewer = bimViewer; // For debugging
};

// import{Server as e,BIMViewer as t,LocaleService as l,addObserver as a,agregarObservador as o,array as s}from"../lib/xeokit-bim-viewer/xeokit-bim-viewer.es.js";import{datos as n,colorGrafica as i}from"./graficas.js";import{messages as r}from"../lib/xeokit-bim-viewer/messages.js";import{objetos as c,plantasUnicas as d,plantasFiltradas as b,obtenerSpaces as p,noObtenerSpaces as u,ceilings as g,falsosTechosP1 as h,obtenerEspaciosUso as f,usoEspacios as m,obtenerOcupacion as E}from"./excelJB.js";let types=[],formData=new FormData,boton=document.getElementById("boton"),form=document.getElementById("myForm"),lista=document.getElementById("listado"),datosInput=document.getElementById("fileInput"),barButton=document.getElementById("bar-btn"),pieButton=document.getElementById("pie-btn"),linearButton=document.getElementById("line-btn"),barChart=document.getElementById("bar"),pieChart=document.getElementById("pie"),linearChart=document.getElementById("linear"),floorsSelect=document.getElementById("floors"),espaciosButton=document.getElementById("espacios"),plantasButton=document.getElementById("plantas"),justiciaContainer=document.getElementById("pset"),barEspacios=document.getElementById("bar-espacios"),capturas=document.getElementById("capturas"),canvas=document.getElementById("myCanvas"),ocupacionesButton=document.getElementById("ocupacion");function enviar(){let e=document.getElementById("texto").value,t=document.getElementById("archivo").files;for(let l=0;l<t.length;l++)formData.append("archivo",t[l]);formData.append("texto",e),fetch("https://xkt.onrender.com/api/convert-to-xkt",{method:"POST",body:formData}).then(e=>{if(!e.ok)throw Error("Error en la petici\xf3n");return e.json()}).then(e=>{console.log(e),archivosCreados()}).catch(e=>{console.error(e)})}form.style.display="https://xkt.onrender.com/"===window.location.href?"block":"none",lista.style.display="https://xkt.onrender.com/"===window.location.href?"flex":"none",boton.addEventListener("click",enviar);let listado=document.getElementById("menuListado");function archivosCreados(){fetch("https://xkt.onrender.com/api/projects").then(e=>e.json()).then(e=>{listado.innerHTML="";let t=e.filenames;t.forEach(e=>{let t=document.createElement("li");t.innerHTML=`<a href="https://xkt.onrender.com/?projectId=${e}">${e}</a>`,listado.appendChild(t)})}).catch(e=>console.error(e))}archivosCreados();let todasTablaseditadas=document.createElement("table"),exportButton=document.getElementById("export-btn"),saveButton=document.getElementById("save-btn");saveButton.onclick=()=>{alert("Propiedad guardada con \xe9xito");let e=document.querySelectorAll(".xeokit-table");for(let t=0;t<e.length;t++)todasTablaseditadas.insertAdjacentHTML("beforeend",e[t].children[0].innerHTML)},exportButton.onclick=()=>{let e=XLSX.utils.table_to_book(todasTablaseditadas);XLSX.writeFile(e,"PropiedadesEditadas.xlsx")},window.onload=function(){let c=function e(){let t={};return window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,(e,l,a)=>{t[l]=a}),t}(),m=c.locale||"en",I=c.projectId;if(!I)return;let y=c.openExplorer;A("true"===y);let v="true"===c.enableEditModels,j=new e({dataDir:"./data"}),B=new t(j,{localeService:new l({messages:r,locale:m}),canvasElement:document.getElementById("myCanvas"),explorerElement:document.getElementById("myExplorer"),toolbarElement:document.getElementById("myToolbar"),inspectorElement:document.getElementById("myInspector"),navCubeCanvasElement:document.getElementById("myNavCubeCanvas"),busyModelBackdropElement:document.getElementById("myViewer"),enableEditModels:v});B.localeService.on("updated",()=>{let e=document.querySelectorAll(".xeokit-i18n");e.forEach(e=>{if(e.dataset.xeokitI18n&&(e.innerText=B.localeService.translate(e.dataset.xeokitI18n)),e.dataset.xeokitI18ntip){let t=B.localeService.translate(e.dataset.xeokitI18ntip);t&&(e.dataset.tippyContent=B.localeService.translate(e.dataset.xeokitI18ntip))}e.dataset.tippyContent&&(e._tippy?e._tippy.setContent(e.dataset.tippyContent):tippy(e,{appendTo:"parent",zIndex:1e6,allowHTML:!0}))})}),B.setConfigs({}),B.on("openExplorer",()=>{A(!0)}),B.on("openInspector",()=>{(function e(t){let l=document.getElementById("inspector_toggle");l&&(l.checked=t)})(!0)}),B.on("addModel",e=>{console.log("addModel: "+JSON.stringify(e,null,"	"))}),B.on("editModel",e=>{console.log("editModel: "+JSON.stringify(e,null,"	"))}),B.on("deleteModel",e=>{console.log("deleteModel: "+JSON.stringify(e,null,"	"))});let $=c.configs;if($){let C=$.split(",");for(let L=0,O=C.length;L<O;L++){let k=C[L],S=k.split(":"),_=S[0],x=S[1];B.setConfig(_,x)}}function A(e){let t=document.getElementById("explorer_toggle");t&&(t.checked=e)}B.loadProject(I,()=>{let e=c.modelId;e&&B.loadModel(e);let t=c.tab,l;t&&B.openTab(t),l="",window.setInterval(()=>{let e=window.location.hash;e!==l&&(function e(){let t=function e(){let t={},l,a=/\+/g,o=/([^&;=]+)=?([^&;]*)/g,s=function(e){return decodeURIComponent(e.replace(a," "))},n=window.location.hash.substring(1);for(;l=o.exec(n);)t[s(l[1])]=s(l[2]);return t}(),l=t.actions;if(!l)return;let a=l.split(",");if(0!==a.length)for(let o=0,s=a.length;o<s;o++){let n=a[o];switch(n){case"focusObject":let i=t.objectId;if(!i){console.error("Param expected for `focusObject` action: 'objectId'");break}B.setAllObjectsSelected(!1),B.setObjectsSelected([i],!0),B.flyToObject(i,()=>{});break;case"focusObjects":let r=t.objectIds;if(!r){console.error("Param expected for `focusObjects` action: 'objectIds'");break}let c=r.split(",");B.setAllObjectsSelected(!1),B.setObjectsSelected(c,!0),B.viewFitObjects(c,()=>{});break;case"clearFocusObjects":B.setAllObjectsSelected(!1),B.viewFitAll();break;case"openTab":let d=t.tabId;if(!d){console.error("Param expected for `openTab` action: 'tabId'");break}B.openTab(d);break;default:console.error("Action not supported: '"+n+"'")}}}(),l=e)},400)},e=>{console.error(e)});let w=e=>e;a(w),o(function e(t){let l=w(s);for(let a=0;a<t.length;a++)B.setAllObjectsSelected(!1),t[a].addEventListener("change",e=>{e.target.checked&&t[a].id==l[a].nombre?(B.setObjectsSelected(l[a].ids,!0),B.viewFitObjects(l[a].ids)):B.setObjectsSelected(l[a].ids,!1)})}),barButton.addEventListener("click",()=>{barChart.classList.toggle("ocultar"),pieChart.classList.contains("ocultar")||pieChart.classList.toggle("ocultar"),linearChart.classList.contains("ocultar")||linearChart.classList.toggle("ocultar"),justiciaContainer.classList.contains("ocultar")||justiciaContainer.classList.toggle("ocultar")}),pieButton.addEventListener("click",()=>{pieChart.classList.toggle("ocultar"),linearChart.classList.contains("ocultar")||linearChart.classList.toggle("ocultar"),barChart.classList.contains("ocultar")||barChart.classList.toggle("ocultar"),justiciaContainer.classList.contains("ocultar")||justiciaContainer.classList.toggle("ocultar")}),linearButton.addEventListener("click",()=>{linearChart.classList.toggle("ocultar"),barChart.classList.contains("ocultar")||barChart.classList.toggle("ocultar"),pieChart.classList.contains("ocultar")||pieChart.classList.toggle("ocultar"),justiciaContainer.classList.contains("ocultar")||justiciaContainer.classList.toggle("ocultar")});let D=document.getElementById("cerrar"),T=document.getElementById("bar-espacios");function M(){let e=n.map(e=>e.globalID),t=P(i);B.viewer.scene.selectedMaterial.edgeColor=t,B.viewer.scene.selectedMaterial.fillColor=t,B.setAllObjectsSelected(!1),B.setObjectsSelected(e,!0),B.viewFitObjects(e)}function V(e,t){let l=P(t);e.forEach(e=>{let t=B.viewer.scene.objects[e.globalID];t.colorize=l})}function F(e){let t=e.match(/\d+/g);if(!t||3!==t.length)return null;{let l=parseInt(t[0],10)/255,a=parseInt(t[1],10)/255,o=parseInt(t[2],10)/255;return[l,a,o]}}function P(e){let t=parseInt(e.slice(1,3),16)/255,l=parseInt(e.slice(3,5),16)/255,a=parseInt(e.slice(5,7),16)/255;return[t,l,a]}D.addEventListener("click",()=>{T.classList.contains("ocultar")||T.classList.toggle("ocultar")}),D.addEventListener("click",()=>{}),floorsSelect.addEventListener("change",()=>{let e=floorsSelect.value,t="";for(let l=0;l<d.length;l++){if(d[l]==e){t=b[l];let a=[];b[l].forEach(e=>{a.push(e.globalID)}),B.setAllObjectsSelected(!1),B.setAllObjectsVisible(!1),B.setObjectsVisible(a,!0),B.viewFitObjects(a);let o=[],s=[];espaciosButton.addEventListener("click",function(){f("S.G. NOTARIADO Y DE LOS REGISTROS"),f("D.G. SEG. JURIDICA Y FE PUBLICA"),f("S.G. NACIONALIDAD Y ESTADO CIVIL"),barEspacios.classList.remove("ocultar");let l=[],a=[];o=p(t,e),(s=u(t,e)).forEach(e=>{a.push(e.globalID)}),o.forEach(e=>{l.push(e.globalID)}),P("#37375C"),P("#8844B5"),P("#6B84E4"),B.setSpacesShown(!0),B.setAllObjectsSelected(!1),B.setAllObjectsVisible(!1),B.setObjectsVisible(l,!0),B.setObjectsVisible(a,!1)});break}B.setAllObjectsSelected(!1),B.setAllObjectsVisible(!0),B.viewFitAll()}}),plantasButton.addEventListener("click",function(){let e=[],t=[];h.forEach(e=>{t.push(e.globalID)}),g.forEach(t=>{e.push(t.globalID)}),B.setObjectsVisible(e,!1),B.setObjectsVisible(t,!1),B.set3DEnabled(!1)}),ocupacionesButton.addEventListener("click",()=>{let e=E("OCUPADO"),t=E("RESERVADO"),l=E("VACANTE");V(e,"#ff4d4d"),V(t,"#ffff4d"),V(l,"#70db70")}),barChart.addEventListener("click",M),pieChart.addEventListener("click",M),capturas.addEventListener("click",async e=>{let t=B.viewer.getSnapshot({format:"png",width:canvas.width,height:canvas.height,includeGizmos:!0}),l=new FormData;l.append("imagen",t);try{let a=await fetch("https://xkt.onrender.com/guardar-imagen",{method:"POST",body:l});a.ok?(console.log("Imagen guardada en el servidor"),window.location.href="captura"):console.error("Error al guardar la imagen en el servidor")}catch(o){console.error("Error al enviar la solicitud al servidor:",o)}}),window.bimViewer=B};
