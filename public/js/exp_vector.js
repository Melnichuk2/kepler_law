const canvas = document.getElementById('orbitCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let planets = {}; 
let selectedPlanet = "Земля"; 
let angle = 0;
let isAnimating = false;
let animationId;

async function fetchPlanets() {
    try {
        const response = await fetch('/api/planets');
        const data = await response.json();
        planets = data; 
        return data;
    } catch (error) {
        console.error('Ошибка загрузки данных о планетах:', error);
    }
}

function getBaseScale(planetName) {
    const smallOrbit = ['Меркурій', 'Венера', 'Земля', 'Марс'];
    const averageOrbit = ['Юпітер'];
    const mediumLargeOrbit = ['Сатурн'];
    const largeOrbit = ['Уран'];
    const lalargeOrbit = ['Нептун'];

    if (smallOrbit.includes(planetName)) {
        return 15; 
    } else if (averageOrbit.includes(planetName)) {
        return 5;
    } else if (mediumLargeOrbit.includes(planetName)) {
        return 2.8;
    } else if (largeOrbit.includes(planetName)) {
        return 1.5; 
    } else if (lalargeOrbit.includes(planetName)) {
        return 1;
    }
    return 1; 
}

function drawOrbit(semiMajorAxis, eccentricity) {
    ctx.clearRect(0, 0, width, height);

    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName);
    const scale = 10 * baseScale;
    
    const cx = width / 2;
    const cy = height / 2;
    const focusX = cx + semiMajorAxis * eccentricity * scale;

    ctx.beginPath();
    ctx.ellipse(cx, cy, semiMajorAxis * scale, semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#0077ff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(focusX, cy, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.fillText('Сонце', focusX + 10, cy);
}

function drawPlanet(semiMajorAxis, eccentricity) {
    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName);
    const scale = 10 * baseScale;

    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(planetX, planetY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
}

// Заглушка для drawLinesAndFocus, если она не определена в других файлах
function drawLinesAndFocus(semiMajorAxis, eccentricity, angle) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale;
    const cx = width / 2;
    const cy = height / 2;
    const focusX = cx + semiMajorAxis * eccentricity * scale;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(focusX, cy);
    ctx.lineTo(planetX, planetY);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
}

function updateOrbit() {
    if (!planets[selectedPlanet]) return; 
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    drawOrbit(semiMajorAxis, eccentricity);
    drawPlanet(semiMajorAxis, eccentricity);
    drawLinesAndFocus(semiMajorAxis, eccentricity, angle);
}

function animate() {
    if (!planets[selectedPlanet]) return; 
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName);
    const scale = 10 * baseScale;
    
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;

    const planetX = cx + orbitRadiusX * Math.cos(angle);
    const planetY = cy + orbitRadiusY * Math.sin(angle);

    const focusX = cx + semiMajorAxis * eccentricity * scale;
    const dx = planetX - focusX;
    const dy = planetY - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const speedFactor = parseFloat(document.getElementById('speedFactor').value) || 1;
    const angularSpeed = speedFactor * 5000 / Math.pow(distance, 1.5);

    angle += angularSpeed * 0.01;

    ctx.clearRect(0, 0, width, height);
    drawOrbit(semiMajorAxis, eccentricity);
    drawPlanet(semiMajorAxis, eccentricity);
    drawLinesAndFocus(semiMajorAxis, eccentricity, angle);

    animationId = requestAnimationFrame(animate);
}

function toggleAnimation() {
    const button = document.getElementById('toggleButton'); 
    
    if (isAnimating) {
        cancelAnimationFrame(animationId);
        button.textContent = "Старт";
    } else {
        animate();
        button.textContent = "Пауза"; 
    }
    
    isAnimating = !isAnimating;
}


function selectPlanet(event) {
    selectedPlanet = event.target.value;
    angle = 0;
    document.getElementById('semiMajorAxis').value = planets[selectedPlanet].semiMajorAxis;
    document.getElementById('eccentricity').value = planets[selectedPlanet].eccentricity;
    updateOrbit();
}

async function init() {
    await fetchPlanets(); 

    if (!Object.keys(planets).length) {
        console.error('Данные о планетах не загружены!');
        return;
    }

    const planetSelect = document.getElementById('planetSelect');
    planetSelect.innerHTML = '';
    Object.keys(planets).forEach(planet => {
        const option = document.createElement('option');
        option.value = planet;
        option.textContent = planet;
        planetSelect.appendChild(option);
    });

    selectedPlanet = planetSelect.value;
    syncInputs(); 
    updateOrbit(); 

    planetSelect.addEventListener('change', selectPlanet);
    document.getElementById('semiMajorAxis').addEventListener('input', updateOrbit);
    document.getElementById('eccentricity').addEventListener('input', updateOrbit);
    document.getElementById('speedFactor').addEventListener('input', updateOrbit); // Исправлено scaleFactor на speedFactor
}

function syncInputs() {
    if (!planets[selectedPlanet]) return; 
    const planet = planets[selectedPlanet];
    document.getElementById('semiMajorAxis').value = planet.semiMajorAxis;
    document.getElementById('eccentricity').value = planet.eccentricity;
    document.getElementById('speedFactor').value = 0.5; 
}

function resetAnimation() {
    cancelAnimationFrame(animationId);
    angle = 0;
    isAnimating = false;
    updateOrbit();
}

document.getElementById('planetSelect')?.addEventListener('change', () => {
    syncInputs();
    resetAnimation();
});

document.addEventListener('DOMContentLoaded', init);