
const canvas = document.getElementById('orbitCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let planets = {}; 
async function planetSelect() {
    try {
        const response = await fetch('/api/planets');
        planets = await response.json(); 
        updatePlanetSelect();
    } catch (error) {
        console.error('Ошибка загрузки данных о планетах:', error);
    }
}

let selectedPlanet = "Земля"; 
let angle = 0;
let isAnimating = false;
let animationId;

function drawOrbit(semiMajorAxis, eccentricity) {
    ctx.clearRect(0, 0, width, height);

    const scale = 1.5;
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
    const scale = 1.5;
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

function updateOrbit() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    drawOrbit(semiMajorAxis, eccentricity);
    drawPlanet(semiMajorAxis, eccentricity);
    drawLinesAndFocus(semiMajorAxis, eccentricity, angle);
}

function animate() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;

    const scale = 1.5;
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
    const button = document.querySelector(".controls button");
    
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

function init() {
    const planetSelect = document.getElementById('planetSelect');
    Object.keys(planets).forEach(planet => {
        const option = document.createElement('option');
        option.value = planet;
        option.textContent = planet;
        planetSelect.appendChild(option);
    });

    planetSelect.addEventListener('change', selectPlanet);
    document.getElementById('semiMajorAxis').addEventListener('input', updateOrbit);
    document.getElementById('eccentricity').addEventListener('input', updateOrbit);
    document.getElementById('toggleAnimation').addEventListener('click', toggleAnimation);
    updateOrbit();
}

function syncInputs() {
    const planet = planets[selectedPlanet];
    document.getElementById('semiMajorAxis').value = planet.semiMajorAxis;
    document.getElementById('eccentricity').value = planet.eccentricity;
    document.getElementById('speedFactor').value = 1; 
}

function resetAnimation() {
    cancelAnimationFrame(animationId);
    angle = 0;
    isAnimating = false;
    updateOrbit();
}


planetSelect.addEventListener('change', () => {
    syncInputs();
    resetAnimation();
});


document.addEventListener('DOMContentLoaded', init);
