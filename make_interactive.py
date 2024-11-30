from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.pdfbase import pdfform
from reportlab.lib import colors
import io
import os

def create_interactive_catalog(input_pdf_path, output_pdf_path):
    try:
        # Abrir el PDF original
        existing_pdf = PdfReader(open(input_pdf_path, "rb"))
        output = PdfWriter()
        
        # Obtener el tamaño de la primera página para usar como referencia
        page = existing_pdf.pages[0]
        page_width = float(page.mediabox.width)
        page_height = float(page.mediabox.height)
        
        # Procesar cada página del PDF
        for page_num in range(len(existing_pdf.pages)):
            # Obtener la página original
            page = existing_pdf.pages[page_num]
            
            # Crear una nueva capa para los elementos interactivos
            packet = io.BytesIO()
            c = canvas.Canvas(packet, pagesize=(page_width, page_height))
            
            # Agregar elementos interactivos
            y_pos = page_height - 50  # Empezar desde arriba
            
            # Agregar campos para productos en esta página
            for i in range(3):  # 3 productos por página como ejemplo
                # Nombre del producto (texto estático)
                c.setFont("Helvetica", 8)
                c.drawString(50, y_pos, f"Producto {page_num + 1}-{i + 1}")
                
                # Campo de cantidad
                c.acroForm.textfield(
                    name=f'cantidad_p{page_num}_{i}',
                    tooltip='Ingrese cantidad',
                    x=150, y=y_pos,
                    width=40,
                    height=15,
                    fontSize=8,
                    borderStyle='solid',
                    borderWidth=1
                )
                
                # Botón de agregar al carrito (usando un campo de texto como botón)
                c.acroForm.textfield(
                    name=f'agregar_p{page_num}_{i}',
                    value='Agregar',
                    tooltip='Agregar al carrito',
                    x=200, y=y_pos,
                    width=60,
                    height=15,
                    fontSize=8,
                    borderStyle='solid',
                    borderWidth=1
                )
                
                y_pos -= 30
            
            # Si es la primera página, agregar campos para información del cliente
            if page_num == 0:
                # Campo para nombre
                c.drawString(50, 40, "Nombre:")
                c.acroForm.textfield(
                    name='nombre',
                    tooltip='Ingrese su nombre',
                    x=100, y=40,
                    width=150,
                    height=15,
                    fontSize=8,
                    borderStyle='solid',
                    borderWidth=1
                )
                
                # Campo para email
                c.drawString(260, 40, "Email:")
                c.acroForm.textfield(
                    name='email',
                    tooltip='Ingrese su email',
                    x=300, y=40,
                    width=150,
                    height=15,
                    fontSize=8,
                    borderStyle='solid',
                    borderWidth=1
                )
            
            # Si es la última página, agregar botón de finalizar compra
            if page_num == len(existing_pdf.pages) - 1:
                c.acroForm.textfield(
                    name='finalizar',
                    value='Finalizar Compra',
                    tooltip='Finalizar compra',
                    x=page_width - 120, y=20,
                    width=100,
                    height=20,
                    fontSize=10,
                    borderStyle='solid',
                    borderWidth=1,
                    textColor=colors.HexColor('#007700')
                )
            
            c.save()
            packet.seek(0)
            
            # Crear nueva página con elementos interactivos
            new_pdf = PdfReader(packet)
            new_page = new_pdf.pages[0]
            
            # Combinar página original con elementos interactivos
            page.merge_page(new_page)
            output.add_page(page)
        
        # Guardar el PDF interactivo
        with open(output_pdf_path, "wb") as outputStream:
            output.write(outputStream)
        
        print(f"PDF interactivo creado exitosamente: {output_pdf_path}")
        return True
        
    except Exception as e:
        print(f"Error al procesar el PDF: {str(e)}")
        return False

def process_catalog_folder(input_folder="catalogs", output_folder="interactive_catalogs"):
    """Procesa todos los PDFs en una carpeta y los hace interactivos"""
    
    # Crear carpeta de salida si no existe
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Procesar cada PDF en la carpeta de entrada
    success_count = 0
    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.pdf'):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, f"interactive_{filename}")
            
            print(f"\nProcesando: {filename}")
            if create_interactive_catalog(input_path, output_path):
                success_count += 1
    
    print(f"\nProceso completado: {success_count} catálogos procesados exitosamente")

if __name__ == "__main__":
    # Procesar todos los PDFs en la carpeta 'catalogs'
    process_catalog_folder()
