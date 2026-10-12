/* ============================================================
   app.js — обработчики событий и инициализация приложения.
   Подключается последним.
   ============================================================ */

window.KB = window.KB || {};

/* Навешивает все обработчики событий. */
KB.bindEvents = function () {
    /* --- click: переключение категорий --- */
    $("#category-list").on("click", ".category-item", function () {
        KB.switchCategory(Number($(this).data("category-id")));
    });

    /* --- click: очистка заполненного слота --- */
    $("#category-list").on("click", ".category-slot", function (event) {
        if (!$(this).hasClass("is-filled")) {
            return;
        }
        event.stopPropagation();
        KB.removeSelectedProduct(Number($(this).data("slot")));
    });

    /* --- click: действия с карточками (делегирование) --- */
    $("#product-grid").on("click", ".select-btn", function () {
        KB.selectProduct(Number($(this).closest(".product-card").data("product-id")));
    });

    $("#product-grid").on("click", ".edit-btn", function () {
        KB.openProductForm(Number($(this).closest(".product-card").data("product-id")));
    });

    $("#product-grid").on("click", ".delete-btn", function () {
        KB.deleteProduct(Number($(this).closest(".product-card").data("product-id")));
    });

    /* --- click: клик по карточке (кроме кнопок) выбирает товар --- */
    $("#product-grid").on("click", ".product-card", function (event) {
        if ($(event.target).closest("button").length > 0) {
            return;
        }
        KB.selectProduct(Number($(this).data("product-id")));
    });

    /* --- click: добавить товар, завершить сборку, сброс фильтров --- */
    $("#add-product-btn").on("click", function () {
        KB.openProductForm();
    });

    $("#complete-btn").on("click", function () {
        KB.handleCompleteBuild();
    });

    $("#reset-filters").on("click", function () {
        KB.resetFilters();
    });

    /* --- click: выпадающее меню --- */
    $("#menu-btn").on("click", function (event) {
        event.stopPropagation();
        const $dropdown = $("#menu-dropdown");
        $dropdown.toggleClass("is-open");
        $(this).attr("aria-expanded", $dropdown.hasClass("is-open") ? "true" : "false");
    });

    $("#menu-dropdown").on("click", "button", function (event) {
        event.stopPropagation();
        KB.handleMenuAction($(this).data("action"));
        $("#menu-dropdown").removeClass("is-open");
        $("#menu-btn").attr("aria-expanded", "false");
    });

    $(document).on("click", function () {
        $("#menu-dropdown").removeClass("is-open");
        $("#menu-btn").attr("aria-expanded", "false");
    });

    /* --- keydown: Esc закрывает меню и открытые модальные окна --- */
    $(document).on("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        $("#menu-dropdown").removeClass("is-open");
        $("#menu-btn").attr("aria-expanded", "false");

        $(".modal.active").each(function () {
            KB.closeModal($(this).attr("id"));
        });
    });

    /* --- click: закрытие модальных окон --- */
    $(".modal").on("click", ".modal-close, [data-modal]", function (event) {
        event.preventDefault();
        KB.closeModal($(this).data("modal"));
    });

    $(".modal").on("click", function (event) {
        if (event.target === this) {
            KB.closeModal($(this).attr("id"));
        }
    });

    /* --- input: поиск --- */
    $("#search-input").on("input", function () {
        KB.state.searchQuery = String($(this).val());
        KB.renderProducts();
    });

    /* --- input: фильтр по цене --- */
    $("#filter-price-min").on("input", function () {
        KB.applyPriceFilters();
    });

    $("#filter-price-max").on("input", function () {
        KB.applyPriceFilters();
    });

    /* --- change: фильтр по наличию --- */
    $("#filter-stock").on("change", function () {
        KB.state.activeFilters.stock = String($(this).val());
        KB.renderProducts();
    });

    /* --- change: сортировка --- */
    $("#sort-select").on("change", function () {
        KB.applySortValue(String($(this).val()));
        KB.renderProducts();
    });

    /* --- submit: форма товара --- */
    $("#product-form").on("submit", KB.handleProductFormSubmit);
};

/* Запускает приложение после загрузки DOM. */
KB.initializeApp = function () {
    /* Скрипты подключены и на лендинге — там конструктора нет. */
    if ($("#product-grid").length === 0) {
        return;
    }

    const loaded = KB.loadData();

    if (!loaded) {
        KB.state.categories = KB.buildSeedCategories();
        KB.state.products = KB.buildSeedProducts();
    }

    KB.repairData();

    KB.state.activeCategoryId = KB.state.categories.length > 0
        ? KB.state.categories[0].id
        : 1;

    KB.populateCategorySelect();
    KB.renderCategories();
    KB.renderProducts();
    KB.updateProgress();
    KB.updateCounters();
    KB.bindEvents();
    KB.resetProductForm();
};

$(document).ready(KB.initializeApp);
