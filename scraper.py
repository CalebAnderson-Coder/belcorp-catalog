import requests
from bs4 import BeautifulSoup
import json
import time
import re

def get_products():
    # URL del catálogo
    url = "https://catalogodigital.somosbelcorp.com/CO?consultant=OTkwNzQ5NzcyNg=="
    
    print("Accediendo al catálogo...")
    
    try:
        # Headers para simular un navegador
        headers = {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        }
        
        # Hacer la petición
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parsear el HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        products = []
        # Encontrar todos los productos
        product_cards = soup.find_all('div', class_='product-card')
        
        print(f"Encontrados {len(product_cards)} productos")
        
        for card in product_cards:
            try:
                # Extraer información del producto
                name = card.find('div', class_='product-name').text.strip()
                price_text = card.find('div', class_='product-price').text.strip()
                price = float(re.sub(r'[^\d.]', '', price_text))
                image = card.find('img')['src']
                
                # Determinar categoría basado en el nombre
                category = "Otros"
                if any(keyword in name.lower() for keyword in ["labial", "sombra", "base", "máscara", "delineador"]):
                    category = "Maquillaje"
                elif any(keyword in name.lower() for keyword in ["perfume", "fragancia", "colonia", "eau"]):
                    category = "Fragancias"
                elif any(keyword in name.lower() for keyword in ["crema", "loción", "jabón", "shampoo", "acondicionador"]):
                    category = "Cuidado Personal"
                
                products.append({
                    "id": len(products) + 1,
                    "name": name,
                    "price": price,
                    "image": image,
                    "category": category
                })
                print(f"Procesado: {name}")
                
            except Exception as e:
                print(f"Error al procesar producto: {e}")
                continue
        
        # Crear directorio si no existe
        import os
        os.makedirs('public/js', exist_ok=True)
        
        # Guardar productos en un archivo JSON
        with open('public/js/products.json', 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
            
        print(f"Se guardaron {len(products)} productos en products.json")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_products()
