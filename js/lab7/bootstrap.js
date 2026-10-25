const menuStatus = document.getElementById('menu-status');
const retryButton = document.getElementById('menu-retry');

async function initializeMenu() {
    menuStatus.textContent = 'Загрузка меню...';
    retryButton.hidden = true;
    retryButton.disabled = true;
    try {
        const loadedDishes = await loadDishes();
        dishes = loadedDishes;
        for (const category of Object.keys(selectedDishes)) {
            const selected = selectedDishes[category];
            if (selected) {
                selectedDishes[category] = dishes.find(dish => dish.keyword === selected.keyword) || selected;
            }
        }
        renderDishes();
        applyFilters();
        updateOrder();
        menuStatus.textContent = dishes.length ? '' : 'В меню пока нет блюд.';
    } catch (error) {
        menuStatus.textContent = 'Не удалось загрузить меню. Проверьте подключение и попробуйте ещё раз. ' + error.message;
        retryButton.hidden = false;
    } finally {
        retryButton.disabled = false;
    }
}

retryButton.addEventListener('click', initializeMenu);
initializeMenu();
