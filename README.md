# Belcorp Digital Catalog

Catálogo digital móvil para consultoras de Belcorp, desarrollado como una Progressive Web App (PWA) para facilitar la navegación y venta de productos.

## Características

- 📱 Diseño responsivo y móvil-first
- 🛍️ Catálogo de productos con búsqueda y filtros
- 🛒 Carrito de compras con conversión USD/COP
- 📲 Instalable como PWA
- 🔄 Funcionalidad offline
- 📱 Compartir pedidos por WhatsApp
- 🌐 Multi-idioma (próximamente)

## Requisitos Previos

- Node.js (v18 o superior)
- npm (incluido con Node.js)

## Instalación

1. Instalar Node.js:
   - Visita [nodejs.org](https://nodejs.org)
   - Descarga e instala la versión LTS

2. Clonar el repositorio:
   ```bash
   git clone https://github.com/CalebAnderson-Coder/belcorp-catalog.git
   cd belcorp-catalog
   ```

3. Instalar dependencias:
   ```bash
   npm install
   ```

4. Generar íconos para PWA:
   ```bash
   npm run generate-icons
   ```

5. Iniciar el servidor:
   ```bash
   npm start
   ```

## Desarrollo

Para desarrollo local con recarga automática:
```bash
npm run dev
```

## Estructura del Proyecto

```
belcorp-catalog/
├── css/
│   └── style.css          # Estilos principales
├── js/
│   ├── app.js            # Lógica principal
│   ├── cart.js           # Funcionalidad del carrito
│   └── products.json     # Datos de productos
├── images/
│   ├── icons/            # Íconos PWA
│   ├── products/         # Imágenes de productos
│   └── screenshots/      # Capturas para PWA
├── scripts/
│   └── generate-icons.js # Generador de íconos
├── config.js             # Configuración global
├── index.html           # Página principal
├── manifest.json        # Configuración PWA
├── sw.js               # Service Worker
└── package.json        # Dependencias y scripts
```

## Configuración

El archivo `config.js` contiene todas las configuraciones globales:

- API endpoints
- Tasa de cambio USD/COP
- Margen de ganancia
- Categorías de productos
- Configuración de caché
- Temas y colores

## PWA

La aplicación es una Progressive Web App (PWA) que ofrece:

- ⚡ Instalación en dispositivos
- 🔄 Funcionamiento offline
- 📲 Notificaciones push
- 🔄 Sincronización en segundo plano
- 🚀 Carga rápida

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## Contacto

Caleb Anderson - [@CalebAnderson](https://github.com/CalebAnderson-Coder)

Link del proyecto: [https://github.com/CalebAnderson-Coder/belcorp-catalog](https://github.com/CalebAnderson-Coder/belcorp-catalog)
