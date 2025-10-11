// Антибан система - определение ботов и модераторов
let currentStep = 1;
const totalSteps = 6;
let userInteractions = 0;
let mouseMovements = 0;
let startTime = Date.now();
let isBot = false;

// Конечная ссылка на смартлинк
const SMARTLINK_URL = 'https://chmpmrm.flirt-hotlady.com/wdk2cxh';

// Отслеживание поведения пользователя для антибан
document.addEventListener('mousemove', () => {
    mouseMovements++;
});

document.addEventListener('click', () => {
    userInteractions++;
});

// Проверка на бота
function detectBot() {
    const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
        'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget',
        'python', 'java', 'http', 'okhttp', 'axios'
    ];
    
    for (let pattern of botPatterns) {
        if (userAgent.includes(pattern)) {
            return true;
        }
    }
    
    // Проверка на отсутствие взаимодействий
    const timeSpent = (Date.now() - startTime) / 1000;
    if (timeSpent > 5 && mouseMovements < 3 && userInteractions < 2) {
        return true;
    }
    
    return false;
}

// Запуск квиза
function startQuiz() {
    isBot = detectBot();
    
    // Если бот - показываем безопасный контент дольше
    if (isBot) {
        setTimeout(() => {
            document.getElementById('safe-layer').classList.add('hidden');
            document.getElementById('quiz-container').classList.remove('hidden');
        }, 2000);
    } else {
        document.getElementById('safe-layer').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');
    }
    
    updateProgress();
}

// Переход на следующий шаг
function nextStep(step) {
    // Скрываем текущий шаг
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    
    // Показываем следующий шаг
    document.getElementById('step' + step).classList.add('active');
    
    currentStep = step;
    updateProgress();
}

// Обновление прогресс-бара
function updateProgress() {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Показ загрузки
function showLoading() {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.getElementById('loading').classList.add('active');
    
    updateProgress();
    
    // Имитация поиска совпадений
    const loadingTexts = [
        'Анализируем твои ответы...',
        'Ищем совпадения в твоем городе...',
        'Проверяем активных пользователей...',
        'Подбираем лучшие профили...',
        'Почти готово...'
    ];
    
    let textIndex = 0;
    const textInterval = setInterval(() => {
        if (textIndex < loadingTexts.length) {
            document.getElementById('loading-text').textContent = loadingTexts[textIndex];
            textIndex++;
        }
    }, 1000);
    
    // Показываем финальный экран через 5 секунд
    setTimeout(() => {
        clearInterval(textInterval);
        showFinal();
    }, 5000);
}

// Показ финального экрана
function showFinal() {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.getElementById('final').classList.add('active');
    
    // Обновляем прогресс на 100%
    document.getElementById('progress-fill').style.width = '100%';
}

// Добавление UTM меток к финальной ссылке
function addUTMParams() {
    const url = new URL(SMARTLINK_URL);
    const params = new URLSearchParams(window.location.search);
    
    // Передаем существующие UTM метки
    for (let [key, value] of params) {
        if (key.startsWith('utm_') || key.startsWith('fbclid') || key.startsWith('gclid')) {
            url.searchParams.set(key, value);
        }
    }
    
    return url.toString();
}

// Редирект на смартлинк
function redirectToOffer() {
    isBot = detectBot();
    const finalURL = addUTMParams();
    
    if (isBot) {
        setTimeout(() => {
            window.location.href = finalURL;
        }, 1500);
    } else {
        window.location.href = finalURL;
    }
}

// Предзагрузка изображений для быстрой работы
window.addEventListener('load', () => {
    const images = [
        'images/image1.jpg',
        'images/image2.jpg',
        'images/image4.jpg'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Защита от быстрого скипа (антибот)
let clickCount = 0;
let lastClickTime = Date.now();

document.addEventListener('click', (e) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 100) {
        clickCount++;
        if (clickCount > 5) {
            isBot = true;
        }
    } else {
        clickCount = 0;
    }
    
    lastClickTime = currentTime;
});

// Отключение DevTools (дополнительная защита)
(function() {
    const devtools = /./;
    devtools.toString = function() {
        isBot = true;
    };
    console.log('%c', devtools);
})();

// Защита от копирования контента
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

document.addEventListener('copy', (e) => {
    e.preventDefault();
});

// Отслеживание времени на странице
let pageTime = 0;
setInterval(() => {
    pageTime++;
}, 1000);

