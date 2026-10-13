/* ============================================================
   form.js — форма добавления и редактирования товара.
   ============================================================ */

window.KB = window.KB || {};

KB.PRODUCT_FIELD_HINTS = {
    1: { name: "AMD Ryzen 5 7600X", price: "Например: 21500", brand: "AMD", description: "6 ядер / 12 потоков, сокет AM5" },
    2: { name: "DeepCool AK400", price: "Например: 2900", brand: "DeepCool", description: "Башенный кулер, поддержка AM4 / AM5 / LGA1700" },
    3: { name: "MSI MAG B650 Tomahawk", price: "Например: 18900", brand: "MSI", description: "Сокет AM5, память DDR5, форм-фактор ATX" },
    4: { name: "G.Skill Trident Z5 32GB DDR5", price: "Например: 12900", brand: "G.Skill", description: "32 ГБ (2×16 ГБ), DDR5, 6000 МГц" },
    5: { name: "Samsung 980 Pro 1TB", price: "Например: 8900", brand: "Samsung", description: "1 ТБ, NVMe M.2, PCIe 4.0" },
    6: { name: "NVIDIA RTX 4070 12GB", price: "Например: 58900", brand: "NVIDIA", description: "12 ГБ видеопамяти, рекомендуемая мощность 200 Вт" },
    7: { name: "NZXT H5 Flow", price: "Например: 8900", brand: "NZXT", description: "Корпус Mid-Tower, поддержка ATX / Micro-ATX / Mini-ITX" },
    8: { name: "Corsair RM750e 750W", price: "Например: 9900", brand: "Corsair", description: "Мощность 750 Вт, сертификат 80+ Gold" },
    9: { name: "Windows 11 Home", price: "Например: 12900", brand: "Microsoft", description: "Домашняя версия, 64-разрядная система" },
    10: { name: "Dell S2721QS 27\"", price: "Например: 32900", brand: "Dell", description: "27 дюймов, 4K, IPS, частота 60 Гц" }
};

/* Заполняет селект категорий в форме. */
KB.populateCategorySelect = function () {
    const $select = $("#form-category");
    $select.empty();
    $select.append($("<option>", {
        value: "",
        text: "Выберите категорию",
        disabled: true,
        selected: true
    }));

    KB.state.categories.forEach(function (category) {
        $select.append($("<option>", {
            value: category.id,
            text: category.id + ". " + category.name
        }));
    });
};

/* Обновляет примеры полей по выбранной категории. */
KB.updateProductFormHints = function () {
    const categoryId = Number($("#form-category").val());
    const hints = KB.PRODUCT_FIELD_HINTS[categoryId];
    const editingProduct = KB.state.editingProductId === null
        ? null
        : KB.findProduct(KB.state.editingProductId);

    KB.renderCompatibilityFields(
        editingProduct && editingProduct.categoryId === categoryId ? editingProduct : null
    );

    if (!hints) {
        $("#form-name").attr("placeholder", "Сначала выберите категорию");
        $("#form-price").attr("placeholder", "Сначала выберите категорию");
        $("#form-brand").attr("placeholder", "Сначала выберите категорию");
        $("#form-description").attr("placeholder", "Сначала выберите категорию");
        return;
    }

    $("#form-name").attr("placeholder", "Например: " + hints.name);
    $("#form-price").attr("placeholder", hints.price);
    $("#form-brand").attr("placeholder", "Например: " + hints.brand);
    $("#form-description").attr("placeholder", "Например: " + hints.description);
};

/* Показывает технические параметры, участвующие в проверке совместимости. */
KB.renderCompatibilityFields = function (product) {
    const categoryId = Number($("#form-category").val());
    const fields = KB.COMPATIBILITY_FIELDS[categoryId] || [];
    const $container = $("#compatibility-fields").empty();

    fields.forEach(function (field) {
        const $wrapper = $("<div>", { class: "form-field full" });
        $wrapper.append($("<label>", { text: field.label }));

        if (field.type === "checkboxes") {
            const selected = Array.isArray(product && product[field.key])
                ? product[field.key]
                : [];
            const $options = $("<div>", { class: "compatibility-options" });

            field.options.forEach(function (option) {
                const $input = $("<input>", {
                    type: "checkbox",
                    class: "compatibility-option",
                    "data-compat-key": field.key,
                    value: option,
                    checked: selected.includes(option)
                });
                $options.append($("<label>").append($input, $("<span>", { text: option })));
            });

            $wrapper.append($options);
        } else if (field.type === "select") {
            const $select = $("<select>", {
                id: "compat-" + field.key,
                class: "form-control",
                required: true
            });
            $select.append($("<option>", { value: "", text: "Выберите значение", disabled: true, selected: true }));
            field.options.forEach(function (option) {
                $select.append($("<option>", {
                    value: option,
                    text: option,
                }));
            });
            $select.val(product && product[field.key] ? product[field.key] : "");
            $wrapper.append($select);
        } else {
            $wrapper.append($("<input>", {
                type: "number",
                id: "compat-" + field.key,
                class: "form-control",
                min: field.min,
                step: 1,
                placeholder: "Укажите значение в ваттах",
                required: true,
                value: product && product[field.key] ? product[field.key] : ""
            }));
        }

        $container.append($wrapper);
    });
};

/* Собирает структурированные параметры совместимости из динамических полей. */
KB.readCompatibilityForm = function () {
    const categoryId = Number($("#form-category").val());
    const fields = KB.COMPATIBILITY_FIELDS[categoryId] || [];
    const compatibility = {};

    fields.forEach(function (field) {
        if (field.type === "checkboxes") {
            compatibility[field.key] = $("#compatibility-fields .compatibility-option[data-compat-key='" + field.key + "']:checked").map(function () {
                return this.value;
            }).get();
        } else if (field.type === "number") {
            const value = $("#compat-" + field.key).val();
            compatibility[field.key] = value === "" ? null : Number(value);
        } else {
            compatibility[field.key] = $("#compat-" + field.key).val();
        }
    });

    return compatibility;
};

/* Читает значения формы в объект. */
KB.readProductForm = function () {
    const productData = {
        name: String($("#form-name").val()).trim(),
        categoryId: Number($("#form-category").val()),
        price: Number($("#form-price").val()),
        brand: String($("#form-brand").val()).trim(),
        description: String($("#form-description").val()).trim(),
        inStock: $("#form-instock").prop("checked"),
        image: KB.state.pendingProductImage || null
    };

    Object.assign(productData, KB.readCompatibilityForm());
    return productData;
};

/* Преобразует выбранный файл изображения в data URL и кладёт в временное состояние. */
KB.readImageFile = function (file) {
    if (!file || !file.type || !file.type.startsWith("image/")) {
        KB.state.pendingProductImage = null;
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        KB.state.pendingProductImage = event.target.result;
    };

    reader.readAsDataURL(file);
};

/* Показывает ошибки валидации формы. */
KB.showFormErrors = function (errors) {
    const $box = $("#form-errors");
    $box.empty().removeClass("has-errors");

    if (!errors || errors.length === 0) {
        return;
    }

    const $ul = $("<ul>");

    errors.forEach(function (message) {
        $ul.append($("<li>", { text: message }));
    });

    $box.addClass("has-errors").append($ul);
};

/* Очищает форму и сбрасывает режим редактирования. */
KB.resetProductForm = function () {
    KB.state.editingProductId = null;
    KB.state.pendingProductImage = null;
    $("#product-form")[0].reset();
    $("#form-errors").empty().removeClass("has-errors");
    $("#product-form-title").text("Добавить товар");
    KB.populateCategorySelect();
    KB.updateProductFormHints();
};

/* Открывает форму: с productId — редактирование, без — добавление. */
KB.openProductForm = function (productId) {
    KB.populateCategorySelect();
    KB.showFormErrors([]);

    if (typeof productId === "number") {
        const product = KB.findProduct(productId);

        if (product === undefined) {
            KB.showMessage("Товар не найден", "error");
            return;
        }

        KB.state.editingProductId = product.id;
        $("#product-form-title").text("Изменить товар");
        $("#form-name").val(product.name);
        $("#form-category").val(String(product.categoryId));
        $("#form-price").val(product.price);
        $("#form-brand").val(product.brand);
        $("#form-description").val(product.description);
        $("#form-instock").prop("checked", product.inStock);
        KB.state.pendingProductImage = product.image || null;
        KB.updateProductFormHints();
    } else {
        KB.resetProductForm();
    }

    KB.openModal("product-modal");
};

/* Обработка отправки формы (submit). */
KB.handleProductFormSubmit = function (event) {
    event.preventDefault();

    const productData = KB.readProductForm();
    let saved;

    if (KB.state.editingProductId === null) {
        saved = KB.addProduct(productData);
    } else {
        saved = KB.updateProduct(KB.state.editingProductId, productData);
    }

    if (saved) {
        KB.resetProductForm();
        KB.closeModal("product-modal");
    }
};
