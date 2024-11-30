import requests
import os
import json

def download_belcorp_catalogs():
    # URL de la API con los parámetros de la consultora
    api_url = "https://catalogodigital.somosbelcorp.com/api/co/catalogs?consultantId=OTkwNzQ5NzcyNg==_ArlethSarith"
    
    # Headers para simular un navegador
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
        "Origin": "https://catalogodigital.somosbelcorp.com",
        "Referer": "https://catalogodigital.somosbelcorp.com/co?consultora=OTkwNzQ5NzcyNg==_ArlethSarith"
    }

    try:
        print("Obteniendo lista de catálogos...")
        response = requests.get(api_url, headers=headers)
        
        if response.status_code == 200:
            catalogs = response.json()
            print(f"Se encontraron {len(catalogs)} catálogos")
            
            # Crear directorio para los catálogos si no existe
            if not os.path.exists("catalogs"):
                os.makedirs("catalogs")
            
            # Descargar cada catálogo
            for i, catalog in enumerate(catalogs, 1):
                try:
                    pdf_url = catalog.get("pdfUrl")
                    name = catalog.get("name", f"catalog_{i}")
                    
                    if pdf_url:
                        # Limpiar el nombre del archivo
                        safe_name = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
                        catalog_name = f"{safe_name}.pdf"
                        
                        print(f"\nDescargando {catalog_name}...")
                        print(f"URL: {pdf_url}")
                        
                        pdf_response = requests.get(pdf_url, headers={
                            "User-Agent": headers["User-Agent"],
                            "Referer": headers["Referer"]
                        })
                        
                        if pdf_response.status_code == 200:
                            # Verificar que el contenido sea un PDF
                            if pdf_response.headers.get('content-type', '').lower().startswith('application/pdf'):
                                # Guardar el PDF
                                file_path = os.path.join("catalogs", catalog_name)
                                with open(file_path, "wb") as f:
                                    f.write(pdf_response.content)
                                print(f" Catálogo {catalog_name} descargado exitosamente")
                                print(f"  Guardado en: {file_path}")
                            else:
                                print(f" Error: El contenido descargado no es un PDF válido")
                        else:
                            print(f" Error al descargar el catálogo {catalog_name}")
                            print(f"  Status: {pdf_response.status_code}")
                
                except Exception as e:
                    print(f" Error al procesar el catálogo {i}: {str(e)}")
        else:
            print(f" Error al obtener la lista de catálogos")
            print(f"  Status: {response.status_code}")
            print(f"  Respuesta: {response.text[:200]}")
            
    except Exception as e:
        print(f" Error general: {str(e)}")

if __name__ == "__main__":
    download_belcorp_catalogs()
