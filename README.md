# Belcorp Catálogo Digital

Una aplicación web moderna para visualizar catálogos de Belcorp de manera interactiva, similar a la plataforma oficial de Belcorp.

## Características

- Interfaz moderna y responsiva
- Visor de PDF integrado con controles de navegación
- Funcionalidad de carrito de compras
- Diseño adaptable a dispositivos móviles
- Carga rápida de catálogos

## Tecnologías Utilizadas

- Backend: Python con Flask
- Frontend: HTML5, CSS3, JavaScript
- PDF Rendering: PDF.js
- UI Framework: Bootstrap 5
- CORS: Flask-CORS

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/CalebAnderson-Coder/belcorp-catalog.git
cd belcorp-catalog
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Colocar los catálogos PDF en la carpeta `catalogs/`

4. Ejecutar la aplicación:
```bash
python app.py
```

5. Abrir el navegador en `http://localhost:5001`

## Estructura del Proyecto

```
belcorp-catalog/
├── app.py              # Servidor Flask
├── requirements.txt    # Dependencias Python
├── catalogs/          # Carpeta para PDFs de catálogos
├── frontend/
│   ├── index.html     # Página principal
│   ├── styles.css     # Estilos CSS
│   └── app.js         # Lógica JavaScript
└── README.md
```

## Uso

1. Coloca los archivos PDF de los catálogos en la carpeta `catalogs/`
2. Inicia el servidor Flask
3. Abre la aplicación en tu navegador
4. Navega por los catálogos usando los controles de navegación
5. Utiliza el zoom para ver los detalles de los productos

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.
