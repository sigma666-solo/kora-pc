/* ============================================================
   utils.js — небольшие вспомогательные функции.
   ============================================================ */

window.KB = window.KB || {};

/* Ищет категорию по id (возвращает объект или undefined). */
KB.findCategory = function (categoryId) {
    const id = Number(categoryId);
    return KB.state.categories.find(function (category) {
        return category.id === id;
    });
};

/* Ищет товар по id (возвращает объект или undefined). */
KB.findProduct = function (productId) {
    const id = Number(productId);
    return KB.state.products.find(function (product) {
        return product.id === id;
    });
};

/* Выбранный товар категории (или null). */
KB.getSelectedProduct = function (category) {
    if (!category || category.selectedProductId === null) {
        return null;
    }
    return KB.findProduct(category.selectedProductId) || null;
};

/* Форматирует цену: 21500 -> "21 500 ₽". */
KB.formatPrice = function (price) {
    return Number(price).toLocaleString("ru-RU") + " " + KB.CURRENCY;
};

/* Обрезает длинное название для миниатюры в слоте. */
KB.shortenName = function (name, maxLength) {
    if (!name || name.length <= maxLength) {
        return name || "";
    }
    return name.slice(0, maxLength - 1) + "\u2026";
};

/* Экранирует пользовательский текст перед вставкой в HTML. */
KB.escapeHtml = function (value) {
    return String(value === null || value === undefined ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

/* Экранирует текст и подсвечивает в нём совпадения с поисковым запросом. */
KB.highlightMatch = function (value, query) {
    const safeText = KB.escapeHtml(value);
    const normalizedQuery = String(query === null || query === undefined ? "" : query).trim();

    if (normalizedQuery === "") {
        return safeText;
    }

    /* Экранируем запрос как HTML, затем как регулярное выражение. */
    const escapedQuery = KB.escapeHtml(normalizedQuery)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    return safeText.replace(
        new RegExp("(" + escapedQuery + ")", "gi"),
        '<mark class="search-hit">$1</mark>'
    );
};

/* Подбирает свободный уникальный id (цикл while). */
KB.getNextProductId = function () {
    let candidate = KB.state.nextProductId;

    while (KB.state.products.find(function (product) {
        return product.id === candidate;
    }) !== undefined) {
        candidate += 1;
    }

    KB.state.nextProductId = candidate + 1;
    return candidate;
};
