function resetFilters() {
    for (const button of document.querySelectorAll('.dish-filters button')) {
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
    }
    for (const card of document.querySelectorAll('.dish')) {
        card.hidden = false;
    }
}

for (const filters of document.querySelectorAll('.dish-filters')) {
    filters.addEventListener('click', function (event) {
        const button = event.target.closest('button[data-kind]');
        if (!button) {
            return;
        }

        const kind = button.classList.contains('active') ? null : button.dataset.kind;
        for (const filterButton of filters.querySelectorAll('button')) {
            const active = filterButton.dataset.kind === kind;
            filterButton.classList.toggle('active', active);
            filterButton.setAttribute('aria-pressed', String(active));
        }

        const category = filters.dataset.filterCategory;
        const grid = document.querySelector(`[data-category="${category}"]`);
        for (const card of grid.querySelectorAll('.dish')) {
            const dish = dishes.find(item => item.keyword === card.dataset.dish);
            card.hidden = kind !== null && dish.kind !== kind;
        }
    });
}

document.querySelector('.order-form').addEventListener('reset', resetFilters);
