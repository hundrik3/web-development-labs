let historyOrders = [];
let historyDishes = [];
let historyPending = false;
const historyBody = document.getElementById('orders-body');
const historyStatus = document.getElementById('history-status');
const historyNotice = document.getElementById('history-notice');
const historyRetry = document.getElementById('history-retry');
const dishFields = ['soup_id', 'main_course_id', 'salad_id', 'drink_id', 'dessert_id'];

function getHistoryKey() {
    try { return sessionStorage.getItem('foodConstructKey8') || ''; } catch { return ''; }
}

async function historyRequest(endpoint, options) {
    if (!getHistoryKey()) { throw new Error('Введите ключ доступа.'); }
    const url = new URL('https://edu.std-900.ist.mospolytech.ru/labs/api/' + endpoint);
    url.searchParams.set('api_key', getHistoryKey());
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok || !result || result.error) { throw new Error('Не удалось выполнить запрос. Попробуйте ещё раз.'); }
    return result;
}

function selectedHistoryDishes(order) {
    return dishFields.map(field => historyDishes.find(dish => dish.id === order[field])).filter(Boolean);
}

function orderTotal(order) {
    return selectedHistoryDishes(order).reduce((total, dish) => total + Number(dish.price), 0);
}

function deliveryText(order) {
    return order.delivery_type === 'by_time' ? order.delivery_time || '' : 'Как можно скорее (с 7:00 до 23:00)';
}

function historyElement(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) { element.textContent = text; }
    if (className) { element.className = className; }
    return element;
}

function historyButton(text, handler) {
    const button = historyElement('button', text);
    button.type = 'button';
    button.addEventListener('click', handler);
    return button;
}

function renderHistory() {
    historyOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    historyBody.replaceChildren();
    historyOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        row.dataset.orderId = String(order.id);
        for (const value of [index + 1, new Date(order.created_at).toLocaleString('ru-RU'), selectedHistoryDishes(order).map(dish => dish.name).join(', '), orderTotal(order) + ' ₽', deliveryText(order)]) {
            row.append(historyElement('td', String(value)));
        }
        const actions = historyElement('td', undefined, 'history-actions');
        actions.append(historyButton('Подробнее', () => showDetails(order)), historyButton('Редактирование', () => showEdit(order)), historyButton('Удаление', () => showDelete(order)));
        row.append(actions);
        historyBody.append(row);
    });
}

async function loadHistory() {
    if (!getHistoryKey()) { historyStatus.textContent = 'Введите ключ доступа, чтобы загрузить историю.'; return; }
    historyStatus.textContent = 'Загрузка истории...';
    historyRetry.hidden = true;
    historyRetry.disabled = true;
    try {
        const results = await Promise.all([historyRequest('orders'), historyRequest('dishes')]);
        if (!Array.isArray(results[0]) || !Array.isArray(results[1])) { throw new Error('Invalid data'); }
        historyOrders = results[0];
        historyDishes = results[1];
        renderHistory();
        historyStatus.textContent = historyOrders.length ? '' : 'У вас пока нет заказов.';
    } catch {
        historyStatus.textContent = 'Не удалось загрузить историю заказов. Проверьте ключ доступа и подключение, затем повторите попытку.';
        historyRetry.hidden = false;
    } finally { historyRetry.disabled = false; }
}

function createHistoryModal(title) {
    const previousFocus = document.activeElement;
    const overlay = historyElement('div', undefined, 'history-overlay');
    const dialog = historyElement('div', undefined, 'history-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', title);
    function close() {
        if (historyPending) { return; }
        overlay.remove();
        previousFocus.focus();
    }
    const closeButton = historyButton('×', close);
    closeButton.className = 'history-close';
    closeButton.setAttribute('aria-label', 'Закрыть');
    dialog.append(closeButton, historyElement('h2', title));
    overlay.append(dialog);
    document.body.append(overlay);
    closeButton.focus();
    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { close(); }
        if (event.key === 'Tab') {
            const elements = Array.from(dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled)'));
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    return { dialog, close };
}

function addDetail(container, title, value) {
    const paragraph = document.createElement('p');
    paragraph.append(historyElement('strong', title + ': '), document.createTextNode(value === null || value === undefined ? '' : String(value)));
    container.append(paragraph);
}

function addDishDetails(container, order) {
    container.append(historyElement('h3', 'Состав заказа'));
    for (const dish of selectedHistoryDishes(order)) { addDetail(container, dish.name, dish.price + ' ₽'); }
    addDetail(container, 'Стоимость', orderTotal(order) + ' ₽');
}

function showDetails(order) {
    const modal = createHistoryModal('Просмотр заказа');
    for (const pair of [['Дата оформления', new Date(order.created_at).toLocaleString('ru-RU')], ['Имя', order.full_name], ['Адрес доставки', order.delivery_address], ['Время доставки', deliveryText(order)], ['Телефон', order.phone], ['Email', order.email], ['Комментарий', order.comment]]) { addDetail(modal.dialog, pair[0], pair[1]); }
    addDishDetails(modal.dialog, order);
    modal.dialog.append(historyButton('Ок', modal.close));
}

function historyField(form, labelText, name, value, type) {
    const label = historyElement('label', labelText);
    label.htmlFor = 'edit-' + name;
    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    if (type !== 'textarea') { input.type = type || 'text'; }
    input.id = 'edit-' + name;
    input.name = name;
    input.value = value || '';
    input.className = 'form-control';
    label.className = 'form-label';
    form.append(label, input);
    return input;
}

function showEdit(order) {
    const modal = createHistoryModal('Редактирование заказа');
    const form = document.createElement('form');
    form.className = 'history-edit-form';
    for (const field of [['Имя', 'full_name', 'text'], ['Email', 'email', 'email'], ['Телефон', 'phone', 'tel'], ['Адрес доставки', 'delivery_address', 'text']]) { historyField(form, field[0], field[1], order[field[1]], field[2]).required = true; }
    const label = historyElement('label', 'Тип доставки');
    label.htmlFor = 'edit-delivery-type';
    const type = document.createElement('select');
    type.id = 'edit-delivery-type';
    type.name = 'delivery_type';
    type.className = 'form-control';
    for (const item of [['now', 'Как можно скорее'], ['by_time', 'К указанному времени']]) {
        const option = historyElement('option', item[1]); option.value = item[0]; type.append(option);
    }
    type.value = order.delivery_type;
    form.append(label, type);
    const time = historyField(form, 'Время доставки', 'delivery_time', order.delivery_time ? order.delivery_time.slice(0, 5) : '', 'time');
    time.min = '07:00'; time.max = '23:00'; time.step = '300';
    historyField(form, 'Комментарий', 'comment', order.comment, 'textarea');
    function checkTime() {
        const scheduled = type.value === 'by_time';
        time.required = scheduled; time.disabled = !scheduled; time.setCustomValidity('');
        if (scheduled && time.value) {
            const now = new Date(); const parts = time.value.split(':').map(Number);
            if (parts[0] * 60 + parts[1] < now.getHours() * 60 + now.getMinutes()) { time.setCustomValidity('Выберите время не раньше текущего.'); }
        }
    }
    type.addEventListener('change', checkTime); time.addEventListener('input', checkTime); checkTime();
    addDishDetails(form, order);
    const save = historyElement('button', 'Сохранить'); save.type = 'submit';
    const error = historyElement('p', '', 'history-modal-error'); error.setAttribute('role', 'alert');
    form.append(error, save, historyButton('Отмена', modal.close));
    save.addEventListener('click', checkTime);
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (historyPending) { return; }
        checkTime(); if (!form.reportValidity()) { return; }
        const data = {};
        for (const name of ['full_name', 'email', 'phone', 'delivery_address', 'delivery_type', 'comment']) { data[name] = form.elements[name].value; }
        data.delivery_time = type.value === 'by_time' ? time.value : null;
        historyPending = true; save.disabled = true; error.textContent = '';
        try {
            const result = await historyRequest('orders/' + order.id, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            if (typeof result.id !== 'number' || result.id !== order.id) { throw new Error('Invalid order'); }
            Object.assign(order, data, result);
            renderHistory(); historyNotice.textContent = 'Заказ успешно изменён.';
            historyPending = false; modal.close();
        } catch { error.textContent = 'Не удалось сохранить изменения. Введённые данные сохранены. Попробуйте ещё раз.'; }
        finally { historyPending = false; save.disabled = false; }
    });
    modal.dialog.append(form);
}

function showDelete(order) {
    const modal = createHistoryModal('Удаление заказа');
    modal.dialog.append(historyElement('p', 'Вы уверены, что хотите удалить заказ?'));
    const error = historyElement('p', '', 'history-modal-error'); error.setAttribute('role', 'alert');
    const confirm = historyButton('Да', async function () {
        if (historyPending) { return; }
        historyPending = true; confirm.disabled = true; error.textContent = '';
        try {
            const result = await historyRequest('orders/' + order.id, { method: 'DELETE' });
            if (typeof result.id !== 'number' || result.id !== order.id) { throw new Error('Invalid order'); }
            historyOrders = historyOrders.filter(item => item.id !== order.id);
            renderHistory(); historyStatus.textContent = historyOrders.length ? '' : 'У вас пока нет заказов.';
            historyNotice.textContent = 'Заказ успешно удалён.';
            historyPending = false; modal.close();
        } catch { error.textContent = 'Не удалось удалить заказ. Попробуйте ещё раз.'; }
        finally { historyPending = false; confirm.disabled = false; }
    });
    modal.dialog.append(error, confirm, historyButton('Отмена', modal.close));
}

historyRetry.addEventListener('click', loadHistory);
document.querySelector('.access-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('api-key');
    const key = input.value.trim(); if (!key) { return; }
    try { sessionStorage.setItem('foodConstructKey8', key); } catch { historyStatus.textContent = 'Не удалось сохранить ключ в этой вкладке.'; return; }
    input.value = ''; loadHistory();
});
loadHistory();
