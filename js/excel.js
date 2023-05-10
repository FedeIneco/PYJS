let datosPrecios = [];
const excelInput = document.getElementById("fileInput");

excelInput.addEventListener("change", async () => {
    const content = await readXlsxFile(excelInput.files[0]);   
    for (let index = 1; index < content.length; index++) {
        const elemento = new Object();
        elemento.id = content[index][2];
        elemento.cost = content[index][3];
        datosPrecios.push(elemento);        
    }
    
});

