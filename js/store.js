/* ============================================================
   store.js — тестовые данные и хранилище (localStorage).
   ============================================================ */

window.KB = window.KB || {};

/* Создаёт стартовый список категорий (id 1..10, слоты пустые). */
KB.buildSeedCategories = function () {
    return KB.CATEGORY_NAMES.map(function (name, index) {
        return {
            id: index + 1,
            name: name,
            selectedProductId: null
        };
    });
};

/* Создаёт стартовый список товаров из KB.SEED_CATALOG. */
KB.buildSeedProducts = function () {
    const list = [];
    let id = 101;

    for (let categoryId = 1; categoryId <= KB.CATEGORY_NAMES.length; categoryId++) {
        const rows = KB.SEED_CATALOG[categoryId] || [];

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            list.push({
                id: id,
                name: row[0],
                categoryId: categoryId,
                price: row[1],
                brand: row[2],
                description: row[3],
                inStock: row[4],
                image: row[5] || null
            });
            id += 1;
        }
    }

    return list;
};

/* Сохраняет товары и категории (вместе с выбранными слотами). */
KB.saveData = function () {
    try {
        localStorage.setItem(KB.STORAGE_KEYS.products, JSON.stringify(KB.state.products));
        localStorage.setItem(KB.STORAGE_KEYS.categories, JSON.stringify(KB.state.categories));
        return true;
    } catch (error) {
        console.error("Не удалось сохранить данные:", error);
        KB.showMessage("Не удалось сохранить данные в браузере", "error");
        return false;
    }
};

/* Загружает данные из localStorage. При отсутствии/повреждении —
   возвращает false, чтобы вызывающий код подставил тестовые данные. */
KB.loadData = function () {
    try {
        const rawProducts = localStorage.getItem(KB.STORAGE_KEYS.products);
        const rawCategories = localStorage.getItem(KB.STORAGE_KEYS.categories);

        if (rawProducts && rawCategories) {
            const parsedProducts = JSON.parse(rawProducts);
            const parsedCategories = JSON.parse(rawCategories);

            /* Пустой массив товаров — валидное состояние: пользователь мог
               удалить все товары, его выбор нельзя затирать тестовыми данными. */
            const productsValid = Array.isArray(parsedProducts);
            const categoriesValid =
                Array.isArray(parsedCategories) &&
                parsedCategories.length === KB.CATEGORY_NAMES.length;

            if (productsValid && categoriesValid) {
                KB.state.products = parsedProducts;
                KB.state.categories = parsedCategories;
                return true;
            }
        }
    } catch (error) {
        console.error("Сохранённые данные повреждены:", error);
        KB.showMessage("Сохранённые данные повреждены, загружен стандартный каталог", "error");
    }

    return false;
};

/* Приводит загруженные данные к безопасному состоянию. */
KB.repairData = function () {
    const state = KB.state;

    if (!Array.isArray(state.categories) || state.categories.length !== KB.CATEGORY_NAMES.length) {
        state.categories = KB.buildSeedCategories();
    }

    if (!Array.isArray(state.products)) {
        state.products = KB.buildSeedProducts();
    }

    /* Максимальный id нужен для генерации следующего уникального id. */
    let maxId = 100;
    state.products.forEach(function (product) {
        if (typeof product.id === "number" && product.id > maxId) {
            maxId = product.id;
        }
    });
    state.nextProductId = maxId + 1;

    /* Дозаполняем изображения для товаров, сохранённых до их появления. */
    const seedImages = {};
    KB.buildSeedProducts().forEach(function (seedProduct) {
        if (seedProduct.image) {
            seedImages[seedProduct.name] = seedProduct.image;
        }
    });
    state.products.forEach(function (product) {
        if (!product.image && seedImages[product.name]) {
            product.image = seedImages[product.name];
        }
    });

    /* Если выбранный товар удалён из каталога — очищаем слот. */
    state.categories.forEach(function (category) {
        if (
            category.selectedProductId !== null &&
            KB.findProduct(category.selectedProductId) === undefined
        ) {
            category.selectedProductId = null;
        }
    });
};
