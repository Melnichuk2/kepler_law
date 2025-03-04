function toggleAnimation() {
    var button = document.querySelector(".controls button"); // Находим кнопку
    if (button.innerHTML === "Старт") {
        button.innerHTML = "Стоп"; // Меняем текст на "Стоп"
    } else {
        button.innerHTML = "Старт"; // Меняем обратно на "Старт"
    }
}