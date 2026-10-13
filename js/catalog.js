/* ============================================================
   catalog.js — поиск, фильтрация, сортировка, CRUD товаров
   и выбор комплектующих в сборку.
   ============================================================ */

window.KB = window.KB || {};

/* Флаг, чтобы не показывать сообщение о неверном диапазоне цен на каждый ввод. */
let priceRangeWarningShown = false;

/* ============================================================
   Поиск, фильтрация, сортировка
   ============================================================ */

/* Поиск по названию, производителю и описанию внутри активной
   категории (регистр не важен). */
KB.searchProducts = function (query) {
    const state = KB.state;

    const categoryProducts = state.products.filter(function (product) {
        return product.categoryId === state.activeCategoryId;
    });

    if (!query) {
        return categoryProducts;
    }

    const normalized = query.toLowerCase();
    return categoryProducts.filter(function (product) {
        const haystack = [
            product.name,
            product.brand,
            product.description
        ].join(" ").toLowerCase();

        return haystack.indexOf(normalized) !== -1;
    });
};

/* Фильтрация по наличию и диапазону цены. */
KB.asArray = function (value) {
    if (value === undefined || value === null) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
};

KB.getSelectedBuildMap = function () {
    const selected = {};

    KB.state.categories.forEach(function (category) {
        const product = KB.getSelectedProduct(category);

        if (product) {
            selected[category.id] = product;
        }
    });

    return selected;
};

KB.isProductCompatibleWithCurrentBuild = function (product) {
    if (!product) {
        return false;
    }

    const selected = KB.getSelectedBuildMap();
    const activeCategory = KB.findCategory(KB.state.activeCategoryId);

    if (activeCategory && activeCategory.selectedProductId === product.id) {
        return true;
    }

    const cpu = selected[1];
    const cooler = selected[2];
    const motherboard = selected[3];
    const memory = selected[4];
    const gpu = selected[6];
    const caseProduct = selected[7];
    const psu = selected[8];

    if (product.categoryId === 1) {
        if (motherboard && product.socket !== motherboard.socket) {
            return false;
        }
        if (cooler && !KB.asArray(cooler.supportedSockets).includes(product.socket)) {
            return false;
        }
    }

    if (product.categoryId === 2) {
        const supportedSockets = KB.asArray(product.supportedSockets);
        if (cpu && !supportedSockets.includes(cpu.socket)) {
            return false;
        }
        if (motherboard && !supportedSockets.includes(motherboard.socket)) {
            return false;
        }
    }

    if (product.categoryId === 3) {
        if (cpu && product.socket !== cpu.socket) {
            return false;
        }
        if (memory && product.memoryType && memory.memoryType && product.memoryType !== memory.memoryType) {
            return false;
        }
        if (cooler && !KB.asArray(cooler.supportedSockets).includes(product.socket)) {
            return false;
        }
        if (caseProduct && product.formFactor && !KB.asArray(caseProduct.supportedFormFactors).includes(product.formFactor)) {
            return false;
        }
    }

    if (product.categoryId === 4 && motherboard && product.memoryType && motherboard.memoryType && product.memoryType !== motherboard.memoryType) {
        return false;
    }

    if (product.categoryId === 6 && psu && product.recommendedPsuWattage && psu.wattage < product.recommendedPsuWattage) {
        return false;
    }

    if (product.categoryId === 7 && motherboard && product.supportedFormFactors && !KB.asArray(product.supportedFormFactors).includes(motherboard.formFactor)) {
        return false;
    }

    if (product.categoryId === 8 && gpu && gpu.recommendedPsuWattage && product.wattage < gpu.recommendedPsuWattage) {
        return false;
    }

    return true;
};

KB.filterProducts = function (productList) {
    const filters = KB.state.activeFilters;

    return productList.filter(function (product) {
        if (!KB.isProductCompatibleWithCurrentBuild(product)) {
            return false;
        }

        if (filters.stock === "in" && product.inStock !== true) {
            return false;
        }
        if (filters.stock === "out" && product.inStock !== false) {
            return false;
        }
        if (filters.minPrice !== null && product.price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice !== null && product.price > filters.maxPrice) {
            return false;
        }
        return true;
    });
};

/* Сортировка по цене или названию (без изменения исходного массива). */
KB.sortProducts = function (productList) {
    const sort = KB.state.activeSort;
    const sorted = productList.slice();

    sorted.sort(function (a, b) {
        let result;

        if (sort.field === "price") {
            result = a.price - b.price;
        } else {
            result = a.name.localeCompare(b.name, "ru");
        }

        if (sort.dir === "desc") {
            result = -result;
        }

        return result;
    });

    return sorted;
};

/* Читает число из поля фильтра (пустое значение = без ограничения). */
KB.parsePriceValue = function (raw) {
    if (raw === "" || raw === null || raw === undefined) {
        return null;
    }

    const value = Number(raw);

    if (isNaN(value) || value < 0) {
        return null;
    }

    return value;
};

/* Применяет фильтр по цене из полей ввода. */
KB.applyPriceFilters = function () {
    const filters = KB.state.activeFilters;

    filters.minPrice = KB.parsePriceValue($("#filter-price-min").val());
    filters.maxPrice = KB.parsePriceValue($("#filter-price-max").val());

    const invalidRange =
        filters.minPrice !== null &&
        filters.maxPrice !== null &&
        filters.maxPrice < filters.minPrice;

    if (invalidRange) {
        if (!priceRangeWarningShown) {
            KB.showMessage("Максимальная цена меньше минимальной", "error");
            priceRangeWarningShown = true;
        }
    } else {
        priceRangeWarningShown = false;
    }

    KB.renderProducts();
};

/* Разбирает значение селекта сортировки. */
KB.applySortValue = function (value) {
    if (value === "price-asc") {
        KB.state.activeSort = { field: "price", dir: "asc" };
    } else if (value === "price-desc") {
        KB.state.activeSort = { field: "price", dir: "desc" };
    } else if (value === "name-desc") {
        KB.state.activeSort = { field: "name", dir: "desc" };
    } else {
        KB.state.activeSort = { field: "name", dir: "asc" };
    }
};

/* Сбрасывает поиск, фильтры и сортировку. */
KB.resetFilters = function () {
    KB.state.activeFilters = { stock: "all", minPrice: null, maxPrice: null };
    KB.state.activeSort = { field: "name", dir: "asc" };
    KB.state.searchQuery = "";
    priceRangeWarningShown = false;

    $("#search-input").val("");
    $("#filter-stock").val("all");
    $("#filter-price-min").val("");
    $("#filter-price-max").val("");
    $("#sort-select").val("name-asc");

    KB.renderProducts();
    KB.showMessage("Поиск и фильтры сброшены", "info");
};

/* ============================================================
   CRUD товаров
   ============================================================ */

/* Проверяет данные формы товара. Возвращает { valid, errors }. */
KB.validateProductForm = function (productData) {
    const errors = [];

    if (!productData.name || String(productData.name).trim() === "") {
        errors.push("Укажите название товара.");
    }

    if (productData.categoryId === null || productData.categoryId === undefined || productData.categoryId === "" || KB.findCategory(productData.categoryId) === undefined) {
        errors.push("Выберите категорию товара.");
    }

    if (
        typeof productData.price !== "number" ||
        isNaN(productData.price) ||
        productData.price <= 0
    ) {
        errors.push("Цена должна быть числом больше нуля.");
    }

    if (!productData.brand || String(productData.brand).trim() === "") {
        errors.push("Укажите производителя.");
    }

    if (!productData.description || String(productData.description).trim() === "") {
        errors.push("Добавьте описание и основные характеристики товара.");
    }

    const compatibilityFields = KB.COMPATIBILITY_FIELDS[Number(productData.categoryId)] || [];
    compatibilityFields.forEach(function (field) {
        const value = productData[field.key];
        let valid = value !== null && value !== undefined && value !== "";

        if (field.type === "checkboxes") {
            valid = Array.isArray(value) && value.length > 0 && value.every(function (option) {
                return field.options.includes(option);
            });
        } else if (field.type === "select") {
            valid = field.options.includes(value);
        } else if (field.type === "number") {
            valid = typeof value === "number" && isFinite(value) && value >= field.min;
        }

        if (!valid) {
            errors.push("Заполните параметр совместимости: " + field.label + ".");
        }
    });

    return { valid: errors.length === 0, errors: errors };
};

/* Переносит только параметры совместимости текущей категории в товар. */
KB.applyCompatibilityFields = function (product, categoryId, source) {
    const values = {};
    (KB.COMPATIBILITY_FIELDS[categoryId] || []).forEach(function (field) {
        values[field.key] = source[field.key];
    });

    Object.keys(KB.COMPATIBILITY_FIELDS).forEach(function (id) {
        KB.COMPATIBILITY_FIELDS[id].forEach(function (field) {
            delete product[field.key];
        });
    });

    (KB.COMPATIBILITY_FIELDS[categoryId] || []).forEach(function (field) {
        product[field.key] = values[field.key];
    });
};

/* Добавляет товар в каталог. Возвращает true/false. */
KB.addProduct = function (productData) {
    const validation = KB.validateProductForm(productData);

    if (!validation.valid) {
        KB.showFormErrors(validation.errors);
        return false;
    }

    const id = KB.getNextProductId();

    /* Защита от дубликата идентификатора. */
    if (KB.findProduct(id) !== undefined) {
        KB.showFormErrors(["Не удалось создать уникальный идентификатор товара."]);
        return false;
    }

    const product = {
        id: id,
        name: String(productData.name).trim(),
        categoryId: Number(productData.categoryId),
        price: Number(productData.price),
        brand: String(productData.brand || "").trim(),
        description: String(productData.description || "").trim(),
        inStock: productData.inStock === true,
        image: productData.image || null
    };

    KB.applyCompatibilityFields(product, product.categoryId, productData);
    KB.state.products.push(product);
    KB.saveData();
    KB.renderProducts();
    KB.updateCounters();
    KB.showMessage("Товар \u00AB" + product.name + "\u00BB добавлен в каталог", "success");

    return true;
};

/* Удаляет товар из каталога и очищает связанные слоты сборки. */
KB.deleteProduct = function (productId) {
    const product = KB.findProduct(productId);

    if (product === undefined) {
        KB.showMessage("Товар не найден", "error");
        return;
    }

    if (!window.confirm("Удалить товар \u00AB" + product.name + "\u00BB из каталога?")) {
        return;
    }

    const index = KB.state.products.findIndex(function (item) {
        return item.id === product.id;
    });

    KB.state.products.splice(index, 1);

    KB.state.categories.forEach(function (category) {
        if (category.selectedProductId === product.id) {
            category.selectedProductId = null;
        }
    });

    KB.saveData();
    KB.renderProducts();
    KB.updateCategorySlots();
    KB.updateProgress();
    KB.updateCounters();
    KB.showMessage("Товар \u00AB" + product.name + "\u00BB удалён из каталога", "success");
};

/* Изменяет товар. Возвращает true/false. */
KB.updateProduct = function (productId, updatedData) {
    const product = KB.findProduct(productId);

    if (product === undefined) {
        KB.showMessage("Товар не найден", "error");
        return false;
    }

    const validation = KB.validateProductForm(updatedData);

    if (!validation.valid) {
        KB.showFormErrors(validation.errors);
        return false;
    }

    const oldCategoryId = product.categoryId;

    product.name = String(updatedData.name).trim();
    product.categoryId = Number(updatedData.categoryId);
    product.price = Number(updatedData.price);
    product.brand = String(updatedData.brand || "").trim();
    product.description = String(updatedData.description || "").trim();
    product.inStock = updatedData.inStock === true;
    product.image = updatedData.image || null;
    KB.applyCompatibilityFields(product, product.categoryId, updatedData);

    /* Товар переехал в другую категорию — чистим старый слот. */
    if (oldCategoryId !== product.categoryId) {
        const oldCategory = KB.findCategory(oldCategoryId);

        if (oldCategory && oldCategory.selectedProductId === productId) {
            oldCategory.selectedProductId = null;
        }
    }

    /* Товар перестал быть в наличии — убираем его из сборки. */
    let removedFromBuild = false;

    if (product.inStock !== true) {
        const currentCategory = KB.findCategory(product.categoryId);

        if (currentCategory && currentCategory.selectedProductId === productId) {
            currentCategory.selectedProductId = null;
            removedFromBuild = true;
        }
    }

    KB.saveData();
    KB.renderProducts();
    KB.updateCategorySlots();
    KB.updateProgress();
    KB.updateCounters();
    KB.showMessage("Товар \u00AB" + product.name + "\u00BB обновлён", "success");

    if (removedFromBuild) {
        KB.showMessage(
            "Товар \u00AB" + product.name + "\u00BB убран из сборки: нет в наличии",
            "info"
        );
    }

    return true;
};

/* ============================================================
   Сборка (выбор / снятие)
   ============================================================ */

/* Выбирает товар в активную категорию. */
KB.selectProduct = function (productId) {
    const product = KB.findProduct(productId);

    if (product === undefined) {
        KB.showMessage("Товар не найден", "error");
        return;
    }

    if (product.categoryId !== KB.state.activeCategoryId) {
        KB.showMessage("Товар относится к другой категории", "error");
        return;
    }

    if (product.inStock !== true) {
        KB.showMessage("Товар отсутствует в наличии", "error");
        return;
    }

    if (!KB.isProductCompatibleWithCurrentBuild(product)) {
        KB.showMessage("Этот товар несовместим с уже выбранными комплектующими", "error");
        return;
    }

    const category = KB.findCategory(product.categoryId);

    if (category === undefined) {
        KB.showMessage("Категория не найдена", "error");
        return;
    }

    /* Замена товара в заполненном слоте не добавляет прогресс повторно. */
    category.selectedProductId = product.id;

    KB.saveData();
    KB.updateCategorySlots();
    KB.updateProgress();
    KB.updateCounters();
    KB.updateSelectedCardStates();
    KB.renderProducts();
    KB.showMessage("Товар \u00AB" + product.name + "\u00BB добавлен в сборку", "success");
};

/* Очищает выбранный слот категории (товар в каталоге остаётся). */
KB.removeSelectedProduct = function (categoryId) {
    const category = KB.findCategory(categoryId);

    if (category === undefined) {
        KB.showMessage("Категория не найдена", "error");
        return;
    }

    if (category.selectedProductId === null) {
        KB.showMessage("Слот уже пуст", "info");
        return;
    }

    category.selectedProductId = null;

    KB.saveData();
    KB.updateCategorySlots();
    KB.updateProgress();
    KB.updateCounters();
    KB.updateSelectedCardStates();
    KB.showMessage("Комплектующее убрано из сборки", "success");
};

/* Полностью очищает сборку. */
KB.resetBuild = function () {
    if (KB.countFilledCategories() === 0) {
        KB.showMessage("Сборка уже пуста", "info");
        return;
    }

    if (!window.confirm("Очистить все выбранные комплектующие?")) {
        return;
    }

    KB.state.categories.forEach(function (category) {
        category.selectedProductId = null;
    });

    KB.saveData();
    KB.updateCategorySlots();
    KB.updateProgress();
    KB.updateCounters();
    KB.updateSelectedCardStates();
    KB.showMessage("Сборка очищена", "success");
};
