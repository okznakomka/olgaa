// Динамическое изменение онлайн счетчика
function updateOnlineCount() {
    const baseCount = 2847;
    const variation = Math.floor(Math.random() * 20) - 10;
    const newCount = baseCount + variation;
    document.getElementById("onlineCount").textContent = newCount;
}

// Обновление счетчика каждые 5 секунд
setInterval(updateOnlineCount, 5000);

// Динамическое изменение оставшихся мест
function updateSpotsLeft() {
    const spotsElement = document.getElementById("spotsLeft");
    if (spotsElement) {
        let currentSpots = parseInt(spotsElement.textContent);
        if (currentSpots > 3) {
            currentSpots--;
            spotsElement.textContent = currentSpots;
            
            // Добавляем эффект мигания
            spotsElement.style.color = "#ef4444";
            setTimeout(() => {
                spotsElement.style.color = "inherit";
            }, 500);
        }
    }
}

// Уменьшение мест каждые 8 секунд
setInterval(updateSpotsLeft, 8000);

// Переход к следующему шагу
function nextStep(stepNumber) {
    // Скрываем текущий шаг
    const currentStep = document.querySelector(".step.active");
    currentStep.classList.remove("active");
    
    // Показываем следующий шаг
    const nextStepElement = document.getElementById("step" + stepNumber);
    nextStepElement.classList.add("active");
    
    // Обновляем счетчик вопросов
    const stepCounter = document.querySelector(".step.active .step-counter");
    if (stepCounter) {
        const totalQuestions = 3; // Общее количество вопросов
        const currentQuestion = stepNumber - 1; // Шаг 2 = Вопрос 1, Шаг 3 = Вопрос 2, Шаг 4 = Вопрос 3
        if (currentQuestion > 0 && currentQuestion <= totalQuestions) {
            stepCounter.textContent = `Вопрос ${currentQuestion} из ${totalQuestions}`;
        } else if (stepNumber === 4) { // Последний вопрос
            stepCounter.textContent = "Последний вопрос";
        }
    }

    // Прокрутка наверх
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Если это финальный шаг, запускаем анимацию счетчика
    if (stepNumber === 5) {
        animateMatchCount();
    }
}

// Выбор опции и переход к следующему шагу
function selectOption(element, nextStepNumber) {
    // Убираем выделение с других опций
    const options = element.parentElement.querySelectorAll(".option-card");
    options.forEach(opt => opt.classList.remove("selected"));
    
    // Выделяем выбранную опцию
    element.classList.add("selected");
    
    // Переход к следующему шагу через небольшую задержку
    setTimeout(() => {
        nextStep(nextStepNumber);
    }, 400);
}

// Анимация счетчика совпадений
function animateMatchCount() {
    const targetCount = 47;
    const countElement = document.getElementById("matchCount");
    let currentCount = 0;
    const duration = 2000; // 2 секунды
    const steps = 50;
    const increment = targetCount / steps;
    const stepDuration = duration / steps;
    
    const interval = setInterval(() => {
        currentCount += increment;
        if (currentCount >= targetCount) {
            currentCount = targetCount;
            clearInterval(interval);
        }
        countElement.textContent = Math.floor(currentCount);
    }, stepDuration);
}

// Эффект появления элементов при прокрутке
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    const elements = document.querySelectorAll(".profile-item, .option-card");
    elements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(el);
    });
}

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    observeElements();
    
    // Добавляем эффект частиц (опционально)
    createFloatingHearts();
});

// Создание плавающих сердечек (декоративный эффект)
function createFloatingHearts() {
    const hearts = ["💕", "💖", "💗", "💓", "💝"];
    
    setInterval(() => {
        // Создаем сердечко только если на первом шаге
        const step1 = document.getElementById("step1");
        if (step1 && step1.classList.contains("active")) {
            const heart = document.createElement("div");
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = "fixed";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.bottom = "-50px";
            heart.style.fontSize = "20px";
            heart.style.opacity = "0.6";
            heart.style.pointerEvents = "none";
            heart.style.zIndex = "1";
            heart.style.transition = "all 4s ease-in-out";
            
            document.body.appendChild(heart);
            
            // Анимация вверх
            setTimeout(() => {
                heart.style.bottom = "110vh";
                heart.style.opacity = "0";
                heart.style.transform = "translateX(" + (Math.random() * 200 - 100) + "px)";
            }, 100);
            
            // Удаление элемента
            setTimeout(() => {
                heart.remove();
            }, 4100);
        }
    }, 3000);
}

// Предотвращение случайного закрытия страницы
window.addEventListener("beforeunload", (e) => {
    const step5 = document.getElementById("step5");
    if (!step5.classList.contains("active")) {
        e.preventDefault();
        e.returnValue = "";
        return "";
    }
});

// Отслеживание активности пользователя
let userActive = true;
let inactivityTimer;

function resetInactivityTimer() {
    userActive = true;
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        userActive = false;
        // Можно добавить всплывающее напоминание
        showInactivityReminder();
    }, 30000); // 30 секунд неактивности
}

function showInactivityReminder() {
    const step1 = document.getElementById("step1");
    if (step1 && step1.classList.contains("active")) {
        // Создаем ненавязчивое напоминание
        const reminder = document.createElement("div");
        reminder.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(239, 68, 68, 0.95);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideUp 0.5s ease;
        `;
        reminder.textContent = "⏰ Не упусти шанс! Одноклассницы ждут...";
        
        document.body.appendChild(reminder);
        
        setTimeout(() => {
            reminder.style.animation = "slideDown 0.5s ease";
            setTimeout(() => reminder.remove(), 500);
        }, 3000);
    }
}

// Отслеживание движений мыши и кликов
document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);
document.addEventListener("scroll", resetInactivityTimer);
document.addEventListener("keypress", resetInactivityTimer);

// Запуск таймера при загрузке
resetInactivityTimer();

// Добавление CSS анимаций динамически
const style = document.createElement("style");
style.textContent = `
    @keyframes slideUp {
        from {
            bottom: -100px;
            opacity: 0;
        }
        to {
            bottom: 20px;
            opacity: 1;
        }
    }
    
    @keyframes slideDown {
        from {
            bottom: 20px;
            opacity: 1;
        }
        to {
            bottom: -100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

