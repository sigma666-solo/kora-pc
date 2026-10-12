/* ============================================================
   render.js — отрисовка DOM: категории, товары, прогресс,
   счётчики и итоговая сводка сборки.
   ============================================================ */

window.KB = window.KB || {};

/* Рисует список категорий в левой панели. */
KB.renderCategories = function () {
    const state = KB.state;
    const $list = $("#category-list");
    $list.empty();

    state.categories.forEach(function (category) {
        const activeClass = category.id === state.activeCategoryId ? " is-active" : "";

        const $item = $("<button>", {
            type: "button",
            class: "category-item" + activeClass,
            "data-category-id": category.id
        });

        const $name = $("<span>", { class: "category-name" });
        $name.append($("<span>", { class: "category-num", text: category.id + "." }));
        $name.append($("<span>", { class: "category-label", text: category.name }));

        const $slot = $("<span>", { class: "category-slot", "data-slot": category.id });

        $item.append($name, $slot);
        $list.append($item);
    });

    KB.updateCategorySlots();
};

/* Обновляет содержимое слотов (миниатюра выбранного товара). */
KB.updateCategorySlots = function () {
    KB.state.categories.forEach(function (category) {
        const $slot = $('.category-slot[data-slot="' + category.id + '"]');

        if ($slot.length === 0) {
            return;
        }

        const product = KB.getSelectedProduct(category);

        if (product) {
            $slot
                .addClass("is-filled")
                .text(KB.shortenName(product.name, 12))
                .attr("title", product.name + " \u2014 нажмите, чтобы убрать из сборки");
        } else {
            $slot
                .removeClass("is-filled")
                .text("")
                .removeAttr("title");
        }
    });
};

/* Строит HTML одной карточки товара. */
KB.createProductCardHtml = function (product, query) {
    const category = KB.findCategory(product.categoryId);
    const icon = KB.CATEGORY_ICONS[product.categoryId] || "\u{1F9E9}";
    const isSelected = category && category.selectedProductId === product.id;
    const stockClass = product.inStock ? "in" : "out";
    const stockText = product.inStock ? "В наличии" : "Нет в наличии";

    /* Нельзя выбрать отсутствующий товар — кнопка блокируется. */
    const canSelect = product.inStock === true;
    const selectLabel = isSelected ? "Выбрано" : "Выбрать";
    const selectClass = "card-btn select-btn" + (isSelected ? " is-active" : "");
    const selectAttrs =
        (canSelect ? "" : " disabled") +
        ' aria-pressed="' + (isSelected ? "true" : "false") + '"';

    /* Если у товара есть изображение — показываем его, иначе иконку-заглушку. */
    const hasImage = Boolean(product.image);
    const media = hasImage
        ? '<img src="' + KB.escapeHtml(encodeURI(product.image)) +
            '" alt="' + KB.escapeHtml(product.name) + '" loading="lazy">'
        : icon;

    return "" +
        '<article class="product-card' + (isSelected ? " is-selected" : "") +
            '" data-product-id="' + product.id + '">' +
            '<div class="card-media' + (hasImage ? " has-image" : "") + '">' + media + "</div>" +
            '<div class="card-body">' +
                '<h3 class="card-name">' + KB.highlightMatch(product.name, query) + "</h3>" +
                '<p class="card-brand">' + KB.escapeHtml(product.brand || "\u2014") + "</p>" +
                '<p class="card-desc">' + KB.highlightMatch(product.description || "", query) + "</p>" +
                '<div class="card-meta">' +
                    '<span class="card-price">' + KB.formatPrice(product.price) + "</span>" +
                    '<span class="card-stock ' + stockClass + '">' + stockText + "</span>" +
                "</div>" +
                '<div class="card-actions">' +
                    '<button type="button" class="' + selectClass + '"' + selectAttrs + ">" +
                        selectLabel +
                    "</button>" +
                    '<button type="button" class="card-btn edit-btn">Изменить</button>' +
                    '<button type="button" class="card-btn delete-btn">Удалить</button>' +
                "</div>" +
            "</div>" +
        "</article>";
};

/* Отображает товары активной категории: поиск -> фильтры -> сортировка. */
KB.renderProducts = function () {
    const state = KB.state;
    const category = KB.findCategory(state.activeCategoryId);
    const $grid = $("#product-grid");

    const searched = KB.searchProducts(state.searchQuery.trim());
    const filtered = KB.filterProducts(searched);
    const sorted = KB.sortProducts(filtered);
    const query = state.searchQuery.trim();

    if (category) {
        $("#category-title").text(category.id + ". " + category.name);
    }

    /* При активном поиске карточки раскрывают описание и подсвечивают совпадения. */
    $grid.toggleClass("is-searching", query.length > 0);

    if (sorted.length === 0) {
        $grid.html('<div class="grid-empty">Товары не найдены</div>');
    } else {
        const cards = sorted.map(function (product) {
            return KB.createProductCardHtml(product, query);
        }).join("");
        $grid.html(cards);
    }

    KB.updateCounters();
};

/* Подсвечивает карточки, выбранные в сборку для активной категории. */
KB.updateSelectedCardStates = function () {
    const category = KB.findCategory(KB.state.activeCategoryId);

    $(".product-card").each(function () {
        const $card = $(this);
        const productId = Number($card.data("product-id"));
        const isSelected = Boolean(category && category.selectedProductId === productId);

        $card.toggleClass("is-selected", isSelected);
        $card.find(".select-btn")
            .toggleClass("is-active", isSelected)
            .attr("aria-pressed", isSelected ? "true" : "false")
            .text(isSelected ? "Выбрано" : "Выбрать");
    });
};

/* Количество заполненных категорий (выбранный товар существует). */
KB.countFilledCategories = function () {
    let count = 0;

    KB.state.categories.forEach(function (category) {
        if (
            category.selectedProductId !== null &&
            KB.findProduct(category.selectedProductId) !== undefined
        ) {
            count += 1;
        }
    });

    return count;
};

/* Прогресс сборки в процентах (0..100). */
KB.calculateProgress = function () {
    const total = KB.state.categories.length;

    if (total === 0) {
        return 0;
    }

    return Math.round((KB.countFilledCategories() / total) * 100);
};

/* Обновляет прогресс-бар, текст и сохраняет состояние. */
KB.updateProgress = function () {
    const percent = KB.calculateProgress();
    const filled = KB.countFilledCategories();

    $("#progress-fill").css("width", percent + "%");
    $("#progress-value").text(percent + "%");
    $("#progress-categories").text(
        "Заполнено категорий: " + filled + " из " + KB.state.categories.length
    );

    KB.saveData();
};

/* Обновляет счётчики товаров. */
KB.updateCounters = function () {
    const state = KB.state;

    const categoryProducts = state.products.filter(function (product) {
        return product.categoryId === state.activeCategoryId;
    });

    const visible = KB.sortProducts(
        KB.filterProducts(KB.searchProducts(state.searchQuery.trim()))
    );

    $("#count-total").text(state.products.length);
    $("#count-category").text(categoryProducts.length);
    $("#count-found").text(visible.length);
};

/* Формирует содержимое итогового окна сборки. */
KB.renderSummary = function () {
    const $list = $("#summary-list");
    $list.empty();

    let totalPrice = 0;
    let totalCount = 0;

    KB.state.categories.forEach(function (category) {
        const product = KB.getSelectedProduct(category);
        const $row = $("<div>", { class: "summary-row" });

        $row.append($("<span>", {
            class: "summary-cat",
            text: category.id + ". " + category.name
        }));

        if (product) {
            totalPrice += Number(product.price) || 0;
            totalCount += 1;
            $row.append($("<span>", {
                class: "summary-val",
                text: product.name + " \u2014 " + KB.formatPrice(product.price)
            }));
        } else {
            $row.append($("<span>", { class: "summary-val", text: "не выбрано" }));
        }

        $list.append($row);
    });

    const $totalRow = $("<div>", { class: "summary-row summary-total" });
    $totalRow.append($("<span>", {
        class: "summary-cat",
        text: "Итого (" + totalCount + " шт.)"
    }));
    $totalRow.append($("<span>", {
        class: "summary-val",
        text: KB.formatPrice(totalPrice)
    }));
    $list.append($totalRow);
};
