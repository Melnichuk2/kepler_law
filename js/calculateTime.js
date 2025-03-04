function calculateTimes() {
    const semiMajorAxis = parseFloat(document.getElementById('semiMajorAxis').value) || 200;
    const eccentricity = parseFloat(document.getElementById('eccentricity').value) || 0.5;
    
    const planetName = selectedPlanet;
    const baseScale = getBaseScale(planetName); 
    const scale = 10 * baseScale;

    const cx = width / 2;
    const cy = height / 2;
    const orbitRadiusX = semiMajorAxis * scale;
    const orbitRadiusY = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2) * scale;

    const focusX = cx + semiMajorAxis * eccentricity * scale;

    const times = []; 
    const gravitationalConstant = 1; 
    const massSun = 1; 

    const totalArea = Math.PI * orbitRadiusX * orbitRadiusY;

    for (let i = 0; i < sectorCount; i++) {
        const startAngle = (i * 2 * Math.PI) / sectorCount;
        const endAngle = ((i + 1) * 2 * Math.PI) / sectorCount;

        const sectorArea = calculateSectorArea(orbitRadiusX, orbitRadiusY, startAngle, endAngle);

        const orbitalPeriod = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / (gravitationalConstant * massSun)); // Период обращения
        const sectorTime = (sectorArea / totalArea) * orbitalPeriod;

        times.push(sectorTime.toFixed(2)); 
    }

    const resultsContainer = document.getElementById('sectorTimes');
    resultsContainer.innerHTML = '';
    times.forEach((time, index) => {
        const result = document.createElement('li');
        result.textContent = `Сектор ${index + 1}: ${time} сек.`;
        resultsContainer.appendChild(result);
    });
}

function calculateSectorArea(orbitRadiusX, orbitRadiusY, startAngle, endAngle) {
    const step = 0.001;
    let area = 0;

    for (let theta = startAngle; theta < endAngle; theta += step) {
        const x = orbitRadiusX * Math.cos(theta);
        const y = orbitRadiusY * Math.sin(theta);
        const nextTheta = theta + step;

        const nextX = orbitRadiusX * Math.cos(nextTheta);
        const nextY = orbitRadiusY * Math.sin(nextTheta);

        area += 0.5 * Math.abs(x * nextY - nextX * y);
    }

    return area;
}
