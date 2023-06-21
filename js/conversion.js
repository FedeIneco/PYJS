import { IFCLoader } from "web-ifc-three";
import { IFCFURNISHINGELEMENT } from "web-ifc";
const formData = new FormData();
const form = document.getElementById("myForm");
const boton = document.getElementById("boton");
const input = document.getElementById("archivo");
const lista = document.getElementById("listado");
const ifcLoader = new IFCLoader();

form.style.display =
  window.location.href === "https://xkt.onrender.com/" ? "block" : "none";
lista.style.display =
  window.location.href === "https://xkt.onrender.com/" ? "flex" : "none";

boton.addEventListener("click", enviar);

//Función que envía el nombre del proyecto y los archivos que quiere convertir a xkt al servidor
async function enviar() {
  const ifcURL = URL.createObjectURL(input.files[0]);
  const model = await ifcLoader.loadAsync(ifcURL);
  logAllFurniture();
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
      filenames.forEach((filename) => {
        // Crear un elemento li
        const li = document.createElement("li");

        // Configurar el texto del elemento li
        li.innerHTML = `<a href="https://xkt.onrender.com/?projectId=${filename}">${filename}</a>`;

        // Agregar el elemento li a la lista
        listado.appendChild(li);
      });
    })
    .catch((error) => console.error(error));
}
archivosCreados();

const objetosPset = [];
const ifc = ifcLoader.ifcManager;
const modelID = 0;
async function logAllFurniture() {
  const startTime = performance.now();
  const furnituresID = await ifc.getAllItemsOfType(
    modelID,
    IFCFURNISHINGELEMENT
  );
  const idsAgregar = [];
  for (let i = 0; i <= furnituresID.length; i++) {
    const furnitureID = furnituresID[i];
    const furnitureProperties = await ifc.getItemProperties(0, furnitureID);
    const furniturePropertiesPSet = await ifc.getPropertySets(
      0,
      furnitureID,
      true
    );
    // console.log(furnitureProperties?.GlobalId.value);
    function logOtherPropertySets(pset, id) {
      pset.forEach((item) => {
        if (item.Name.value === "Other") {
          if (item.HasProperties.length > 6) {
            const puesto = item.HasProperties[5].NominalValue.value;
            if (puesto.startsWith("JB03")) {
              const objeto = {};
              objeto.id = id?.GlobalId.value;
              objeto.puesto = puesto;
              objetosPset.push(objeto);
            }
          }
        }
      });
    }

    logOtherPropertySets(furniturePropertiesPSet, furnitureProperties);
  }
  const endTime = performance.now(); // Registrar el tiempo de finalización
  const elapsedTime = endTime - startTime; // Calcular la diferencia de tiempo
  console.log(`Tiempo transcurrido: ${elapsedTime / 60000} minutoss`);
  console.log(objetosPset);
}

//? 10 properties -> 5


