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

orderForm.addEventListener('submit', function (event) {
    if (!selectedDishes.soup || !selectedDishes.main_dish || !selectedDishes.drink) {
        event.preventDefault();
        orderError.textContent = 'Выберите суп, главное блюдо и напиток перед отправкой заказа.';
        orderError.hidden = false;
    }
});

orderForm.addEventListener('reset', function () {
    for (const category of Object.keys(selectedDishes)) {
        selectedDishes[category] = null;
    }
    orderError.hidden = true;
    orderError.textContent = '';
    updateOrder();
});

updateOrder();

