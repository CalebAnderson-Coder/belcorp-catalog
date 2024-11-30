from PyPDF2 import PdfFileWriter, PdfFileReader
from PyPDF2 import PdfFileWriter, PdfFileReader
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfform
from reportlab.lib import colors
import io

def create_interactive_layer():
    # Crear un nuevo PDF en memoria
    packet = io.BytesIO()
    c = canvas.Canvas(packet, pagesize=letter)
    
    # Agregar campos de formulario
    # Campo para nombre
    c.setFont("Helvetica", 12)
    c.drawString(50, 750, "Nombre:")
    form = c.acroForm
    form.textfield(name='nombre', 
                  tooltip='Ingrese su nombre',
                  x=120, y=750,
                  width=200,
                  height=20)

    # Campo para email
    c.drawString(50, 720, "Email:")
    form.textfield(name='email',
                  tooltip='Ingrese su email',
                  x=120, y=720,
                  width=200,
                  height=20)

    # Campos para productos
    y_pos = 650
    for i in range(1, 4):  # 3 productos como ejemplo
        # Nombre del producto
        c.drawString(50, y_pos, f"Producto {i}")
        
        # Campo de cantidad
        form.textfield(name=f'cantidad_{i}',
                      tooltip='Ingrese cantidad',
                      x=200, y=y_pos,
                      width=50,
                      height=20)
        
        # Botón de agregar al carrito
        form.button(name=f'agregar_{i}',
                   tooltip='Agregar al carrito',
                   x=300, y=y_pos,
                   width=100,
                   height=20,
                   borderStyle='beveled',
                   buttonStyle='push',
                   buttonValue='Agregar')
        
        y_pos -= 50

    # Botón de finalizar compra
    form.button(name='finalizar',
               tooltip='Finalizar compra',
               x=250, y=100,
               width=150,
               height=30,
               borderStyle='beveled',
               buttonStyle='push',
               buttonValue='Finalizar Compra')

    c.save()
    packet.seek(0)
    return PdfFileReader(packet)

def add_interactivity_to_pdf(input_pdf_path, output_pdf_path):
    try:
        # Abrir el PDF original
        existing_pdf = PdfFileReader(open(input_pdf_path, "rb"))
        output = PdfFileWriter()

        # Crear capa interactiva
        interactive_layer = create_interactive_layer()

        # Combinar páginas
        page = existing_pdf.getPage(0)
        page.mergePage(interactive_layer.getPage(0))
        output.addPage(page)

        # Guardar el resultado
        with open(output_pdf_path, "wb") as outputStream:
            output.write(outputStream)
            
        print(f"PDF interactivo creado exitosamente: {output_pdf_path}")
        
    except Exception as e:
        print(f"Error al procesar el PDF: {str(e)}")

if __name__ == "__main__":
    # Rutas de los archivos PDF
    input_pdf = "esika 1c.pdf"
    output_pdf = "esika_1c_interactivo.pdf"
    add_interactivity_to_pdf(input_pdf, output_pdf)
