let dishes = [];
const orderStorageKey = 'foodConstructOrder8';
const accessStorageKey = 'foodConstructKey8';
const selectedDishes = { soup: null, main_dish: null, salad: null, drink: null, dessert: null };

function getApiKey() {
    try { return sessionStorage.getItem(accessStorageKey) || ''; } catch { return ''; }
}

function apiUrl(endpoint) {
    const url = new URL('https://edu.std-900.ist.mospolytech.ru/labs/api/' + endpoint);
    url.searchParams.set('api_key', getApiKey());
    return url;
}

async function loadDishes() {
    if (!getApiKey()) { throw new Error('Введите ключ доступа из СДО.'); }
    const response = await fetch(apiUrl('dishes'));
    if (!response.ok) { throw new Error('Не удалось загрузить меню. Попробуйте ещё раз.'); }
    const data = await response.json();
    if (!Array.isArray(data)) { throw new Error('Не удалось прочитать меню. Попробуйте ещё раз.'); }
    return data.map(dish => {
        const category = dish.category === 'main-course' || dish.category === 'main_course' ? 'main_dish' : dish.category === 'salads' ? 'salad' : dish.category;
        if (typeof dish.id !== 'number' || !Number.isFinite(dish.id)) { throw new Error('В меню отсутствуют данные для оформления заказа.'); }
        return { ...dish, category };
    });
}

function saveOrder() {
    const saved = {};
    for (const category of Object.keys(selectedDishes)) {
        if (selectedDishes[category]) { saved[category] = selectedDishes[category].id; }
    }
    try { localStorage.setItem(orderStorageKey, JSON.stringify(saved)); } catch { /* Заказ остаётся доступен на странице. */ }
}

function restoreOrder() {
    let saved = {};
    try {
        const parsed = JSON.parse(localStorage.getItem(orderStorageKey) || '{}');
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) { saved = parsed; }
    } catch { saved = {}; }
    for (const category of Object.keys(selectedDishes)) {
        selectedDishes[category] = dishes.find(dish => dish.id === saved[category] && dish.category === category) || null;
    }
    saveOrder();
}
