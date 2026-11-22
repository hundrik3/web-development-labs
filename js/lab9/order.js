function getComboError() {
    const soup = Boolean(selectedDishes.soup);
    const main = Boolean(selectedDishes.main_dish);
    const salad = Boolean(selectedDishes.salad);
    const drink = Boolean(selectedDishes.drink);
    const dessert = Boolean(selectedDishes.dessert);

    if (!soup && !main && !salad && !drink && !dessert) {
        return 'Ничего не выбрано. Выберите блюда для заказа';
    }
    if (soup && !main && !salad) {
        return 'Выберите главное блюдо/салат/стартер';
    }
    if (salad && !soup && !main) {
        return 'Выберите суп или главное блюдо';
    }
    if (!soup && !main && !salad) {
        return 'Выберите главное блюдо';
    }
    if (!drink) {
        return 'Выберите напиток';
    }
    return '';
}

function showNotification(message) {
    const oldNotification = document.querySelector('.notification-overlay');
    if (oldNotification) {
        oldNotification.remove();
    }
    const previousFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    const dialog = document.createElement('div');
    dialog.className = 'notification-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-labelledby', 'notification-message');
    const paragraph = document.createElement('p');
    paragraph.className = 'notification-message';
    paragraph.id = 'notification-message';
    paragraph.textContent = message;
    const button = document.createElement('button');
    button.className = 'notification-button';
    button.type = 'button';
    button.textContent = 'Окей';

    function closeNotification() {
        overlay.remove();
        previousFocus.focus();
    }

    button.addEventListener('click', closeNotification);
    dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeNotification();
        }
        if (event.key === 'Tab') {
            event.preventDefault();
            button.focus();
        }
    });
    dialog.append(paragraph, button);
    overlay.append(dialog);
    document.body.append(overlay);
    button.focus();
}


const orderForm = document.querySelector('.order-form');
let sendingOrder = false;

function updateOrder() {
    let total = 0;
    let hasDishes = false;
    for (const category of Object.keys(selectedDishes)) {
        const dish = selectedDishes[category];
        const description = document.getElementById('chosen-' + category);
        if (dish) { total += dish.price; hasDishes = true; }
        if (description) { description.textContent = dish ? dish.name + ' — ' + dish.price + ' ₽' : category === 'main_dish' ? 'Не выбрано' : 'Не выбран'; }
        const field = document.getElementById(category);
        if (field) { field.value = dish ? String(dish.id) : ''; }
    }
    const totalElement = document.getElementById('order-total');
    if (totalElement) { totalElement.textContent = total + ' ₽'; }
    const empty = document.getElementById('order-empty');
    if (empty) { empty.hidden = true; }
    const panel = document.getElementById('checkout-panel');
    if (panel) {
        panel.hidden = !hasDishes;
        document.getElementById('panel-total').textContent = total + ' ₽';
        const link = document.getElementById('checkout-link');
        const valid = !getComboError();
        link.setAttribute('aria-disabled', String(!valid));
        if (valid) { link.href = 'orders9.html'; } else { link.removeAttribute('href'); }
    }
    for (const card of document.querySelectorAll('[data-category] .dish')) {
        const dish = dishes.find(item => item.id === Number(card.dataset.id));
        const selected = selectedDishes[dish.category] === dish;
        card.classList.toggle('selected', selected);
        card.querySelector('button').setAttribute('aria-pressed', String(selected));
    }
    renderCheckout();
}

const menuMain = document.querySelector('.lunch-main');
if (menuMain) {
    menuMain.addEventListener('click', function (event) {
        const button = event.target.closest('.dish button');
        if (!button) { return; }
        const dish = dishes.find(item => item.id === Number(button.closest('.dish').dataset.id));
        selectedDishes[dish.category] = dish;
        saveOrder();
        updateOrder();
    });
    document.getElementById('checkout-link').addEventListener('click', function (event) {
        if (this.getAttribute('aria-disabled') === 'true') { event.preventDefault(); }
    });
}

const checkoutGrid = document.getElementById('checkout-dishes');
if (checkoutGrid) {
    checkoutGrid.addEventListener('click', function (event) {
        const button = event.target.closest('.dish button');
        if (!button || sendingOrder) { return; }
        const dish = dishes.find(item => item.id === Number(button.closest('.dish').dataset.id));
        selectedDishes[dish.category] = null;
        saveOrder();
        updateOrder();
    });
}

function updateDeliveryTime() {
    const scheduled = orderForm.elements.delivery_type.value === 'by_time';
    const time = orderForm.elements.delivery_time;
    time.required = scheduled;
    time.disabled = !scheduled;
    time.setCustomValidity('');
    if (scheduled && time.value) {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        const parts = time.value.split(':').map(Number);
        if (parts[0] * 60 + parts[1] < minutes) { time.setCustomValidity('Выберите время не раньше текущего.'); }
    }
}

function checkCheckout(event) {
    const message = getComboError();
    if (message) { event.preventDefault(); showNotification(message); return false; }
    if (!getApiKey()) { event.preventDefault(); showNotification('Введите ключ доступа из СДО.'); return false; }
    updateDeliveryTime();
    return true;
}

async function sendOrder(event) {
    event.preventDefault();
    if (sendingOrder || !checkCheckout(event) || !orderForm.reportValidity()) { return; }
    const fields = orderForm.elements;
    const data = {
        full_name: fields.customer_name.value,
        email: fields.email.value,
        subscribe: fields.subscribe.checked ? 1 : 0,
        phone: fields.phone.value,
        delivery_address: fields.address.value,
        delivery_type: fields.delivery_type.value,
        comment: fields.comment.value
    };
    const apiFields = { soup: 'soup_id', main_dish: 'main_course_id', salad: 'salad_id', drink: 'drink_id', dessert: 'dessert_id' };
    for (const category of Object.keys(selectedDishes)) {
        if (selectedDishes[category]) { data[apiFields[category]] = selectedDishes[category].id; }
    }
    if (data.delivery_type === 'by_time') { data.delivery_time = fields.delivery_time.value; }
    sendingOrder = true;
    const submit = orderForm.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
        const response = await fetch(apiUrl('orders'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        const result = await response.json();
        if (!response.ok || !result || typeof result !== 'object' || Array.isArray(result) || result.error || typeof result.id !== 'number' || !Number.isFinite(result.id)) { throw new Error('Order failed'); }
        for (const category of Object.keys(selectedDishes)) { selectedDishes[category] = null; }
        try { localStorage.removeItem(orderStorageKey); } catch { /* Заказ очищен на странице. */ }
        updateOrder();
        orderForm.reset();
        showNotification('Заказ успешно оформлен!');
    } catch {
        showNotification('Не удалось отправить заказ. Ваш выбор и данные сохранены. Попробуйте ещё раз.');
    } finally {
        sendingOrder = false;
        submit.disabled = false;
    }
}

if (orderForm) {
    orderForm.querySelector('[type="submit"]').addEventListener('click', checkCheckout);
    orderForm.addEventListener('submit', sendOrder);
    orderForm.addEventListener('change', updateDeliveryTime);
    orderForm.elements.delivery_time.addEventListener('input', updateDeliveryTime);
    orderForm.addEventListener('reset', function () {
        if (sendingOrder) { return; }
        for (const category of Object.keys(selectedDishes)) { selectedDishes[category] = null; }
        saveOrder();
        updateOrder();
        orderForm.elements.delivery_time.required = false;
        orderForm.elements.delivery_time.setCustomValidity('');
    });
}
updateOrder();
