const menuStatus = document.getElementById('menu-status');
const retryButton = document.getElementById('menu-retry');
const accessForm = document.querySelector('.access-form');

async function initializeMenu() {
    if (!getApiKey()) {
        menuStatus.textContent = 'Введите ключ доступа из СДО, чтобы загрузить блюда.';
        retryButton.hidden = true;
        return;
    }
    menuStatus.textContent = 'Загрузка меню...';
    retryButton.hidden = true;
    retryButton.disabled = true;
    try {
        const loadedDishes = await loadDishes();
        dishes = loadedDishes;
        restoreOrder();
        renderDishes();
        applyFilters();
        updateOrder();
        menuStatus.textContent = dishes.length ? '' : 'В меню пока нет блюд.';
    } catch {
        menuStatus.textContent = 'Не удалось загрузить блюда. Проверьте ключ доступа и подключение, затем повторите попытку.';
        retryButton.hidden = false;
    } finally {
        retryButton.disabled = false;
    }
}

accessForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const input = document.getElementById('api-key');
    const key = input.value.trim();
    if (!key) { return; }
    try { sessionStorage.setItem(accessStorageKey, key); } catch {
        menuStatus.textContent = 'Браузер не позволяет сохранить ключ для этой вкладки.';
        return;
    }
    input.value = '';
    initializeMenu();
});
retryButton.addEventListener('click', initializeMenu);
initializeMenu();
