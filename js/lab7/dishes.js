let dishes = [];

async function loadDishes() {
    const response = await fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes');
    if (!response.ok) {
        throw new Error('Сервер вернул ошибку ' + response.status);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error('Сервер вернул неверный формат меню');
    }
    return data;
}
