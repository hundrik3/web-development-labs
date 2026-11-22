function createParagraph(className, text) {
    const paragraph = document.createElement('p');
    paragraph.className = className;
    paragraph.textContent = text;
    return paragraph;
}

dishes.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

for (const dish of dishes) {
    const grid = document.querySelector(`[data-category="${dish.category}"]`);
    const card = document.createElement('div');
    card.className = 'dish';
    card.dataset.dish = dish.keyword;

    const image = document.createElement('img');
    image.className = 'dish-image';
    image.src = dish.image;
    image.alt = dish.name;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Добавить';

    card.append(image,
        createParagraph('dish-price', `${dish.price} ₽`),
        createParagraph('dish-name', dish.name),
        createParagraph('dish-weight', dish.count), button);
    grid.append(card);
}
