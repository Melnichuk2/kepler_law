const canvas = document.getElementById('orbitCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let planets = {};
let selectedPlanet = "Земля";
let angle = 0;
let isAnimating = false;
let animationId;
let zoomLevel = 1;

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

function calculatePeriod(semiMajorAxis) {
    return Math.pow(semiMajorAxis, 3 / 2); // T = a^(3/2), період у роках
}

function getBaseScale(planetName) {
    const smallOrbit = ['Меркурій', 'Венера', 'Земля', 'Марс'];
    const averageOrbit = ['Юпітер'];
    const mediumLargeOrbit = ['Сатурн'];
    const largeOrbit = ['Уран'];
    const lalargeOrbit = ['Нептун'];

    if (smallOrbit.includes(planetName)) return 15;
    if (averageOrbit.includes(planetName)) return 5;
    if (mediumLargeOrbit.includes(planetName)) return 2.8;
    if (largeOrbit.includes(planetName)) return 1.5;
    if (lalargeOrbit.includes(planetName)) return 1;
    return 1;
}

function drawOrbit(semiMajorAxis, eccentricity) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale * zoomLevel;
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

function drawSecondOrbit(semiMajorAxis2) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale * zoomLevel;
    const cx = width / 2;
    const cy = height / 2;

    ctx.beginPath();
    ctx.ellipse(cx, cy, semiMajorAxis2 * scale, semiMajorAxis2 * scale, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function drawPlanet(semiMajorAxis, eccentricity, angle) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale * zoomLevel;
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
    return { x: planetX, y: planetY };
}

function drawSecondPlanet(semiMajorAxis2, angle) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale * zoomLevel;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX2 = semiMajorAxis2 * scale;
    const planetX2 = cx + orbitRadiusX2 * Math.cos(angle);
    const planetY2 = cy + orbitRadiusX2 * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(planetX2, planetY2, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#00ff00';
    ctx.fill();
    return { x: planetX2, y: planetY2 };
}

function drawLinesAndFocus(semiMajorAxis, eccentricity, angle) {
    const baseScale = getBaseScale(selectedPlanet);
    const scale = 10 * baseScale * zoomLevel;
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
    const semiMajorAxis2 = parseFloat(document.getElementById('semiMajorAxis2').value) || 2;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;
    const period1 = calculatePeriod(semiMajorAxis);
    const period2 = calculatePeriod(semiMajorAxis2);

    ctx.clearRect(0, 0, width, height);
    drawOrbit(semiMajorAxis, eccentricity);
    drawSecondOrbit(semiMajorAxis2);
    drawPlanet(semiMajorAxis, eccentricity, angle);
    drawSecondPlanet(semiMajorAxis2, angle * (semiMajorAxis / semiMajorAxis2));
    drawLinesAndFocus(semiMajorAxis, eccentricity, angle);

    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Період 1: ${period1.toFixed(2)} років`, 10, 30);
    ctx.fillText(`Період 2: ${period2.toFixed(2)} років`, 10, 50);
}

function animate() {
    if (!planets[selectedPlanet]) return;
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const semiMajorAxis2 = parseFloat(document.getElementById('semiMajorAxis2').value) || 2;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;
    const speedFactor = parseFloat(document.getElementById('speedFactor').value) || 1;

    const baseScale = getBaseScale(selectedPlanet);
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
    const angularSpeed = speedFactor * 5000 / Math.pow(distance, 1.5);

    const orbitRadiusX2 = semiMajorAxis2 * scale;
    const planetX2 = cx + orbitRadiusX2 * Math.cos(angle * (semiMajorAxis / semiMajorAxis2));
    const planetY2 = cy + orbitRadiusX2 * Math.sin(angle * (semiMajorAxis / semiMajorAxis2));

    ctx.clearRect(0, 0, width, height);
    drawOrbit(semiMajorAxis, eccentricity);
    drawSecondOrbit(semiMajorAxis2);
    drawPlanet(semiMajorAxis, eccentricity, angle);
    drawSecondPlanet(semiMajorAxis2, angle * (semiMajorAxis / semiMajorAxis2));
    drawLinesAndFocus(semiMajorAxis, eccentricity, angle);

    const period1 = calculatePeriod(semiMajorAxis);
    const period2 = calculatePeriod(semiMajorAxis2);
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Період 1: ${period1.toFixed(2)} років`, 10, 30);
    ctx.fillText(`Період 2: ${period2.toFixed(2)} років`, 10, 50);

    angle += angularSpeed * 0.01;
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

function zoomIn() {
    zoomLevel += 0.2;
    zoomLevel = Math.min(zoomLevel, 5);
    updateOrbit();
}

function zoomOut() {
    zoomLevel -= 0.2;
    zoomLevel = Math.max(zoomLevel, 0.1);
    updateOrbit();
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
    const planetSelect = document.getElementById('planetSelect');
    planetSelect.innerHTML = '';
    Object.keys(planets).forEach(planet => {
        const option = document.createElement('option');
        option.value = planet;
        option.textContent = planet;
        planetSelect.appendChild(option);
    });

    selectedPlanet = planetSelect.value;
    updateOrbit();

    planetSelect.addEventListener('change', selectPlanet);
    document.getElementById('semiMajorAxis').addEventListener('input', updateOrbit);
    document.getElementById('semiMajorAxis2').addEventListener('input', updateOrbit);
    document.getElementById('eccentricity').addEventListener('input', updateOrbit);
    document.getElementById('speedFactor').addEventListener('input', updateOrbit);
    canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        zoomLevel += event.deltaY * -0.001;
        zoomLevel = Math.min(Math.max(0.1, zoomLevel), 5);
        updateOrbit();
    });
}

document.addEventListener('DOMContentLoaded', init);