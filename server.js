const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Используем CORS для работы с запросами с других доменов (если нужно)
app.use(cors());

// Статическая папка для файлов
app.use(express.static(path.join(__dirname, 'public')));

// Данные о планетах
const planets = {
    Меркурій: { semiMajorAxis: 0.39, eccentricity: 0.2056 },
    Венера: { semiMajorAxis: 0.72, eccentricity: 0.0067 },
    Земля: { semiMajorAxis: 1.0, eccentricity: 0.0167 },
    Марс: { semiMajorAxis: 1.52, eccentricity: 0.0934 },
    Юпітер: { semiMajorAxis: 5.2, eccentricity: 0.0489 },
    Сатурн: { semiMajorAxis: 9.58, eccentricity: 0.0557 },
    Уран: { semiMajorAxis: 19.2, eccentricity: 0.0444 },
    Нептун: { semiMajorAxis: 30.05, eccentricity: 0.011 }
};

// API для получения данных о планетах
app.get('/api/planets', (req, res) => {
    res.json(planets);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});

