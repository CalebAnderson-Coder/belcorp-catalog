from PIL import Image, ImageDraw, ImageFont
import os

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def create_sample_image(output_path, text, size=(300, 300), bg_color=(231, 84, 128)):
    # Crear imagen con fondo rosa (color Belcorp)
    image = Image.new('RGB', size, bg_color)
    draw = ImageDraw.Draw(image)
    
    # Intentar usar una fuente del sistema, si no está disponible usar la default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 30)
    except:
        font = ImageFont.load_default()
    
    # Calcular posición del texto para centrarlo
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2
    
    # Dibujar texto en blanco
    draw.text((x, y), text, fill='white', font=font)
    
    # Guardar imagen
    image.save(output_path)

def main():
    # Crear directorios necesarios
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    images_dir = os.path.join(base_dir, 'images')
    
    # Directorios para imágenes
    dirs = {
        'products': ['lbel', 'esika', 'cyzone'],
        'icons': [],
        'brands': []
    }
    
    # Crear estructura de directorios
    for main_dir, subdirs in dirs.items():
        dir_path = os.path.join(images_dir, main_dir)
        create_directory(dir_path)
        for subdir in subdirs:
            create_directory(os.path.join(dir_path, subdir))
    
    # Crear imágenes de productos
    products = {
        'lbel': ['aqua-complex.jpg', 'magnifique.jpg', 'serum-chronos.jpg'],
        'esika': ['labial-mate.jpg', 'base-hd.jpg', 'crema-corporal.jpg'],
        'cyzone': ['mascara-volume.jpg', 'esmalte.jpg']
    }
    
    for brand, images in products.items():
        for image_name in images:
            output_path = os.path.join(images_dir, 'products', brand, image_name)
            create_sample_image(output_path, f'{brand}\n{image_name}')
    
    # Crear logos de marcas
    brands = ['esika', 'lbel', 'cyzone']
    for brand in brands:
        output_path = os.path.join(images_dir, 'brands', f'{brand}.png')
        create_sample_image(output_path, brand.upper(), size=(200, 100))
    
    # Crear logo principal y banner
    create_sample_image(os.path.join(images_dir, 'logo.png'), 'BELCORP', size=(200, 100))
    create_sample_image(os.path.join(images_dir, 'banner.jpg'), 'BELCORP BANNER', size=(800, 400))
    
    # Crear íconos para notificaciones
    icons = {
        'checkmark': '✓',
        'xmark': '✗'
    }
    
    for name, symbol in icons.items():
        output_path = os.path.join(images_dir, f'{name}.png')
        create_sample_image(output_path, symbol, size=(32, 32))

if __name__ == '__main__':
    main()
    print("¡Imágenes de ejemplo generadas exitosamente!")
