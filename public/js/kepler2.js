let sectorCount = 2; 
const sectorColors = ['#F5E6FF', '#D4B3FF', '#A366FF', '#7A33CC', '#5C1999', '#3D0066']; 

function calculateSectorAngles(semiMajorAxis, eccentricity, sectorCount) {
    const angles = [0]; 
    const totalArea = Math.PI * semiMajorAxis * semiMajorAxis * Math.sqrt(1 - eccentricity ** 2); 
    const sectorArea = totalArea / sectorCount; 
    const focusX = semiMajorAxis * eccentricity; 
    const step = 0.001; 

    let accumulatedArea = 0;
    let currentAngle = 0;

    while (angles.length < sectorCount) {
        const nextAngle = currentAngle + step;
        const x1 = semiMajorAxis * Math.cos(currentAngle) - focusX;
        const y1 = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * Math.sin(currentAngle);
        const x2 = semiMajorAxis * Math.cos(nextAngle) - focusX;
        const y2 = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * Math.sin(nextAngle);
        accumulatedArea += Math.abs((x1 * y2 - x2 * y1) / 2);
        if (accumulatedArea >= sectorArea) {
            angles.push(nextAngle); 
            accumulatedArea = 0;
        }

        currentAngle = nextAngle;
    }

    angles.push(2 * Math.PI);
    return angles;
}
function drawSectors(semiMajorAxis, eccentricity) {
    const angles = calculateSectorAngles(semiMajorAxis, eccentricity, sectorCount); 
    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName); 
    const scale = 10 * baseScale;
    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    const focusX = cx + semiMajorAxis * eccentricity * scale;

    for (let i = 0; i < sectorCount; i++) {
        const startAngle = angles[i];
        const endAngle = angles[i + 1];
        ctx.beginPath();
        ctx.moveTo(focusX, cy);
        for (let theta = startAngle; theta <= endAngle; theta += 0.001) {
            const x = cx + orbitRadiusX * Math.cos(theta);
            const y = cy + orbitRadiusY * Math.sin(theta);
            ctx.lineTo(x, y);
        }

        ctx.closePath();
        ctx.fillStyle = sectorColors[i % sectorColors.length];
        ctx.globalAlpha = 0.4;
        ctx.fill();
    }
    ctx.globalAlpha = 1; 
}



function drawOrbit(semiMajorAxis, eccentricity) {
    
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

function updateOrbit() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || planets[selectedPlanet].semiMajorAxis;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || planets[selectedPlanet].eccentricity;
    ctx.clearRect(0, 0, width, height);
    drawOrbit(semiMajorAxis, eccentricity);
    drawSectors(semiMajorAxis, eccentricity, angle);
    drawPlanet(semiMajorAxis, eccentricity);
}

function animate() {
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
    drawSectors(semiMajorAxis, eccentricity, angle); 
    drawPlanet(semiMajorAxis, eccentricity);

    animationId = requestAnimationFrame(animate);
}
document.getElementById('sectorCount').addEventListener('input', (e) => {
    sectorCount = parseInt(e.target.value) || 2;
    updateOrbit();
});
document.addEventListener('DOMContentLoaded', () => {
    init();
    updateOrbit();
});
