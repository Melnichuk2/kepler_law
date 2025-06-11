const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;


app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


const planets = {
    Меркурій: { semiMajorAxis: 0.39, eccentricity: 0.2056, image: '/images/mercury.png' },
    Венера: { semiMajorAxis: 0.72, eccentricity: 0.0067, image: '/images/venus.png' },
    Земля: { semiMajorAxis: 1.0, eccentricity: 0.0167, image: '/images/earth.png' },
    Марс: { semiMajorAxis: 1.52, eccentricity: 0.0934, image: '/images/mars.png' },
    Юпітер: { semiMajorAxis: 5.2, eccentricity: 0.0489, image: '/images/jupiter.png' },
    Сатурн: { semiMajorAxis: 9.58, eccentricity: 0.0557, image: '/images/saturn.png' },
    Уран: { semiMajorAxis: 19.2, eccentricity: 0.0444, image: '/images/uranus.png' },
    Нептун: { semiMajorAxis: 30.05, eccentricity: 0.011, image: '/images/neptune.png' }
};


app.get('/api/planets', (req, res) => {
    res.json(planets);
});


app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

