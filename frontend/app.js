// Configurar PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';

let currentPDF = null;
let currentPage = 1;
let cart = [];

// Cargar los catálogos
async function loadCatalogs() {
    try {
        const response = await fetch('http://localhost:5000/api/catalogs');
        const catalogs = await response.json();
        
        const catalogList = document.getElementById('catalogList');
        catalogList.innerHTML = '';
        
        catalogs.forEach(catalog => {
            const col = document.createElement('div');
            col.className = 'col-md-4 mb-4';
            col.innerHTML = `
                <div class="card catalog-card" onclick="openPDF('${catalog.url}', '${catalog.name}')">
                    <div class="card-body">
                        <h5 class="card-title">${catalog.name}</h5>
                        <p class="card-text">Click para ver el catálogo</p>
                    </div>
                </div>
            `;
            catalogList.appendChild(col);
        });
    } catch (error) {
        console.error('Error loading catalogs:', error);
    }
}

// Abrir PDF en el visor
async function openPDF(url, title) {
    const modal = new bootstrap.Modal(document.getElementById('pdfModal'));
    modal.show();
    
    document.querySelector('.modal-title').textContent = title;
    
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        currentPDF = await loadingTask.promise;
        
        renderPage(1);
    } catch (error) {
        console.error('Error loading PDF:', error);
    }
}

// Renderizar página del PDF
async function renderPage(pageNumber) {
    try {
        const page = await currentPDF.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        const pdfViewer = document.getElementById('pdfViewer');
        pdfViewer.innerHTML = '';
        canvas.className = 'pdf-page';
        pdfViewer.appendChild(canvas);
        
        // Agregar controles de navegación
        addNavigationControls(pageNumber, currentPDF.numPages);
        
    } catch (error) {
        console.error('Error rendering page:', error);
    }
}

// Agregar controles de navegación
function addNavigationControls(currentPage, totalPages) {
    const controls = document.createElement('div');
    controls.className = 'navigation-controls text-center mt-3';
    controls.innerHTML = `
        <button onclick="changePage(-1)" class="btn btn-primary" ${currentPage <= 1 ? 'disabled' : ''}>
            Anterior
        </button>
        <span class="mx-3">Página ${currentPage} de ${totalPages}</span>
        <button onclick="changePage(1)" class="btn btn-primary" ${currentPage >= totalPages ? 'disabled' : ''}>
            Siguiente
        </button>
    `;
    document.getElementById('pdfViewer').appendChild(controls);
}

// Cambiar página
function changePage(delta) {
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= currentPDF.numPages) {
        currentPage = newPage;
        renderPage(currentPage);
    }
}

// Cargar los catálogos cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadCatalogs);
