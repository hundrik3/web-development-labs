function createParagraph(className, text) {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = text;
    return paragraph;
}

function createCard(dish, checkout) {
    const card = document.createElement('div');
    card.className = 'dish';
    card.dataset.dish = dish.keyword;
    card.dataset.id = String(dish.id);
    const image = document.createElement('img');
    image.className = 'dish-image';
    image.src = dish.image;
    image.alt = dish.name;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = checkout ? 'Удалить' : 'Добавить';
    card.append(image, createParagraph('dish-price', dish.price + ' ₽'), createParagraph('dish-name', dish.name), createParagraph('dish-weight', dish.count), button);
    return card;
}

function renderDishes() {
    dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    for (const grid of document.querySelectorAll('[data-category]')) {
        grid.replaceChildren();
        for (const dish of dishes) {
            if (dish.category === grid.dataset.category) { grid.append(createCard(dish, false)); }
        }
    }
}

function renderCheckout() {
    const grid = document.getElementById('checkout-dishes');
    if (!grid) { return; }
    grid.replaceChildren();
    for (const dish of Object.values(selectedDishes)) {
        if (dish) { grid.append(createCard(dish, true)); }
    }
    document.getElementById('checkout-empty').hidden = grid.children.length > 0;
}
