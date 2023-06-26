# import os
# import ifcopenshell
# import pandas as pd
# from tkinter import Tk
# from tkinter.filedialog import askopenfilename


# def seleccionar_archivo():
#     Tk().withdraw()  # Ocultar la ventana principal de Tkinter
#     archivo = askopenfilename(filetypes=[("Archivos IFC", "*.ifc")])
#     if archivo:
#         print("Archivo seleccionado:", archivo)
#         procesar_archivo(archivo)
#     else:
#         print("No se seleccionó ningún archivo.")


# def procesar_archivo(archivo):
#     # Cargar el archivo IFC
#     modelo = ifcopenshell.open(archivo)
#     # ****
#     print("OK")
#     # Obtener todos los elementos del modelo
#     elementos = modelo.by_type("IfcProduct")
#     # ****
#     print(elementos[:10])

#     # Crear una lista para almacenar los datos de la tabla
#     tabla = []

#     # Recorrer cada elemento y extraer la información deseada
#     for elemento in elementos:
#         ifc_guid = elemento.GlobalId
#         name = elemento.Name if hasattr(elemento, "Name") else ""
#         psets = elemento.IsDefinedBy
#         for pset in psets:
#             if pset.is_a("IfcRelDefinesByProperties"):
#                 propiedades = pset.RelatingPropertyDefinition.HasProperties
#                 for propiedad in propiedades:
#                     pset_name = pset.RelatingPropertyDefinition.Name
#                     prop_name = propiedad.Name
#                     value = getattr(propiedad.NominalValue, "wrappedValue", None)
#                     value = str(value) if value is not None else ""
#                     tabla.append([ifc_guid, name, pset_name, prop_name, value])

#     # Convertir la lista en un DataFrame de pandas
#     df = pd.DataFrame(tabla, columns=["ID", "Name", "PsetName", "PropertyName", "Value"])

#     # Exportar el DataFrame a un archivo CSV
#     archivo_csv = "../database/tabla_propiedades.csv"
#     df.to_csv(archivo_csv, index=False)
#     print("Tabla generada y exportada como 'tabla_propiedades.csv'")

#     # Exportar el DataFrame a un archivo Excel (xlsx)
#     archivo_xlsx = "../database/tabla_propiedades.xlsx"
#     df.to_excel(archivo_xlsx, index=False)
#     print("Tabla generada y exportada como 'tabla_propiedades.xlsx'")

#     # Eliminar el archivo CSV generado
#     if os.path.exists(archivo_csv):
#         os.remove(archivo_csv)
#         print("Archivo CSV eliminado:", archivo_csv)
#     else:
#         print("El archivo CSV no existe:", archivo_csv)


# if __name__ == "__main__":
#     seleccionar_archivo()



import os
import ifcopenshell
import pandas as pd

def procesar_archivos_en_carpeta(carpeta):
    # Obtener la lista de archivos en la carpeta
    archivos = os.listdir(carpeta)
    
    for archivo in archivos:
        if archivo.endswith(".ifc"):
            ruta_archivo = os.path.join(carpeta, archivo)
            
            # Cargar el archivo IFC
            modelo = ifcopenshell.open(ruta_archivo)
            
            # Resto del código para procesar el archivo
            # Obtener todos los elementos del modelo
            elementos = modelo.by_type("IfcProduct")
            
            # Crear una lista para almacenar los datos de la tabla
            tabla = []
            
            # Recorrer cada elemento y extraer la información deseada
            for elemento in elementos:
                ifc_guid = elemento.GlobalId
                name = elemento.Name if hasattr(elemento, "Name") else ""
                psets = elemento.IsDefinedBy
                for pset in psets:
                    if pset.is_a("IfcRelDefinesByProperties"):
                        propiedades = pset.RelatingPropertyDefinition.HasProperties
                        for propiedad in propiedades:
                            pset_name = pset.RelatingPropertyDefinition.Name
                            prop_name = propiedad.Name
                            value = getattr(propiedad.NominalValue, "wrappedValue", None)
                            value = str(value) if value is not None else ""
                            tabla.append([ifc_guid, name, pset_name, prop_name, value])
    
            # Convertir la lista en un DataFrame de pandas
            df = pd.DataFrame(tabla, columns=["ID", "Name", "PsetName", "PropertyName", "Value"])
    
            # Exportar el DataFrame a un archivo CSV
            archivo_csv = "../database/tabla_propiedades.csv"
            df.to_csv(archivo_csv, index=False)
            print(f"Tabla generada y exportada para el archivo '{archivo}'")
    
            # Exportar el DataFrame a un archivo Excel (xlsx)
            archivo_xlsx = "../database/tabla_propiedades.xlsx"
            df.to_excel(archivo_xlsx, index=False)
            print(f"Tabla generada y exportada para el archivo '{archivo}'")
    
            # Eliminar el archivo CSV generado
            if os.path.exists(archivo_csv):
                os.remove(archivo_csv)
                print("Archivo CSV eliminado:", archivo_csv)
            else:
                print("El archivo CSV no existe:", archivo_csv)


if __name__ == "__main__":
    carpeta = "../uploads/"
    procesar_archivos_en_carpeta(carpeta)
