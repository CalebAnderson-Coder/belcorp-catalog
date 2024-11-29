const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
const SOURCE_ICON = path.join(__dirname, '../images/logo.png');
const OUTPUT_DIR = path.join(__dirname, '../images/icons');

// Asegurarse de que el directorio de salida existe
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generar íconos para cada tamaño
async function generateIcons() {
    try {
        for (const size of ICON_SIZES) {
            const outputFile = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
            
            await sharp(SOURCE_ICON)
                .resize(size, size)
                .png()
                .toFile(outputFile);
            
            console.log(`✓ Generado ícono ${size}x${size}`);
        }

        // Generar ícono para notificaciones (badge)
        await sharp(SOURCE_ICON)
            .resize(72, 72)
            .png()
            .toFile(path.join(OUTPUT_DIR, 'badge-72x72.png'));
        
        console.log('✓ Generado badge para notificaciones');

        // Generar íconos para acciones de notificaciones
        await sharp(path.join(__dirname, '../images/checkmark.png'))
            .resize(32, 32)
            .png()
            .toFile(path.join(OUTPUT_DIR, 'checkmark.png'));
        
        await sharp(path.join(__dirname, '../images/xmark.png'))
            .resize(32, 32)
            .png()
            .toFile(path.join(OUTPUT_DIR, 'xmark.png'));
        
        console.log('✓ Generados íconos para acciones de notificaciones');

        console.log('\n¡Todos los íconos han sido generados exitosamente! 🎉');
    } catch (error) {
        console.error('Error generando íconos:', error);
        process.exit(1);
    }
}

generateIcons();
