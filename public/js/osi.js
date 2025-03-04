let showAxes = false; 

function drawAxes(semiMajorAxis, eccentricity) {
    if (!showAxes) return;

    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName); 
    const scale = 10 * baseScale;

    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;
    ctx.beginPath();
    ctx.moveTo(cx, cy - orbitRadiusY);  
    ctx.lineTo(cx, cy + orbitRadiusY); 
    ctx.strokeStyle = '#ff7f00';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - orbitRadiusX, cy); 
    ctx.lineTo(cx + orbitRadiusX, cy);  
    ctx.strokeStyle = '#ff7f00';
    ctx.lineWidth = 1;
    ctx.stroke();
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

    drawAxes(semiMajorAxis, eccentricity); 
}

document.getElementById('showAxes').addEventListener('change', (e) => {
    showAxes = e.target.checked;
    updateOrbit(); 
});
