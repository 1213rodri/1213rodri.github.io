// Efecto Matrix en el fondo
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテト';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

// Capturar información del usuario
async function captureUserInfo() {
    const dataContainer = document.getElementById('data-container');
    let html = '';

    // Información básica del navegador
    const info = {
        'User Agent': navigator.userAgent,
        'Plataforma': navigator.platform,
        'Idioma': navigator.language,
        'Resolución de Pantalla': `${screen.width}x${screen.height}`,
        'Zona Horaria': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Cookies Habilitadas': navigator.cookieEnabled ? 'Sí' : 'No',
        'Conexión': navigator.connection ? navigator.connection.effectiveType : 'Desconocida'
    };

    // Obtener IP y geolocalización
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        info['Dirección IP'] = ipData.ip;

        // Obtener geolocalización basada en IP
        const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
        const geoData = await geoResponse.json();
        
        if (geoData) {
            info['País'] = geoData.country_name || 'No disponible';
            info['Región'] = geoData.region || 'No disponible';
            info['Ciudad'] = geoData.city || 'No disponible';
            info['Código Postal'] = geoData.postal || 'No disponible';
            info['ISP'] = geoData.org || 'No disponible';
            info['Latitud'] = geoData.latitude || 'No disponible';
            info['Longitud'] = geoData.longitude || 'No disponible';

            // Mostrar mapa si tenemos coordenadas
            if (geoData.latitude && geoData.longitude) {
                showMap(geoData.latitude, geoData.longitude);
            }
        }
    } catch (error) {
        info['IP/Geolocalización'] = 'No se pudo obtener (puede estar bloqueado)';
    }

    // Construir HTML con la información
    html = '<div style="margin: 20px 0;">';
    for (const [label, value] of Object.entries(info)) {
        html += `
            <div class="info-item">
                <span class="info-label">${label}:</span>
                <span class="info-value">${value}</span>
            </div>
        `;
    }
    html += '</div>';

    dataContainer.innerHTML = html;
}

function showMap(lat, lon) {
    const mapSection = document.getElementById('map-section');
    const mapDiv = document.getElementById('map');
    mapSection.style.display = 'block';
    
    // Crear mapa usando OpenStreetMap
    mapDiv.innerHTML = `
        <iframe 
            width="100%" 
            height="300" 
            frameborder="0" 
            scrolling="no" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.1},${lat-0.1},${lon+0.1},${lat+0.1}&layer=mapnik&marker=${lat},${lon}"
            style="border-radius: 5px;">
        </iframe>
    `;
}

// Ejecutar al cargar la página
window.addEventListener('load', captureUserInfo);

// Ajustar canvas al cambiar tamaño de ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});