const selectedDishes = { soup: null, main_dish: null, salad: null, drink: null, dessert: null };
const orderForm = document.querySelector('.order-form');
const orderError = document.getElementById('order-error');

function updateOrder() {
    let total = 0;
    let hasDishes = false;

    for (const category of Object.keys(selectedDishes)) {
        const dish = selectedDishes[category];
        const description = document.getElementById(`chosen-${category}`);
        const field = document.getElementById(category);

        if (dish) {
            description.textContent = `${dish.name} — ${dish.price} ₽`;
            field.value = dish.keyword;
            total += dish.price;
            hasDishes = true;
        } else {
            description.textContent = category === 'drink' ? 'Напиток не выбран' : category === 'dessert' ? 'Десерт не выбран' : 'Блюдо не выбрано';
            field.value = '';
        }
    }

    document.getElementById('order-empty').hidden = hasDishes;
    document.getElementById('order-items').hidden = !hasDishes;
    document.getElementById('order-cost').hidden = !hasDishes;
    document.getElementById('order-total').textContent = `${total} ₽`;

    for (const card of document.querySelectorAll('.dish')) {
        const dish = dishes.find(item => item.keyword === card.dataset.dish);
        const selected = selectedDishes[dish.category] === dish;
        card.classList.toggle('selected', selected);
        card.querySelector('button').setAttribute('aria-pressed', String(selected));
    }
}

document.querySelector('.lunch-main').addEventListener('click', function (event) {
    const button = event.target.closest('.dish button');
    if (!button) {
        return;
    }

    const card = button.closest('.dish');
    const dish = dishes.find(item => item.keyword === card.dataset.dish);
    selectedDishes[dish.category] = dish;
    orderError.hidden = true;
    orderError.textContent = '';
    updateOrder();
});

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

function validateCombo(event) {
    const message = getComboError();
    if (message) {
        event.preventDefault();
        showNotification(message);
    }
}

orderForm.querySelector('[type="submit"]').addEventListener('click', validateCombo);
orderForm.addEventListener('submit', validateCombo);


orderForm.addEventListener('reset', function () {
    for (const category of Object.keys(selectedDishes)) {
        selectedDishes[category] = null;
    }
    orderError.hidden = true;
    orderError.textContent = '';
    updateOrder();
});

updateOrder();

