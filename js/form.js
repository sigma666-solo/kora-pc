/* ============================================================
   form.js — форма добавления и редактирования товара.
   ============================================================ */

window.KB = window.KB || {};

/* Заполняет селект категорий в форме. */
KB.populateCategorySelect = function () {
    const $select = $("#form-category");
    $select.empty();

    KB.state.categories.forEach(function (category) {
        $select.append($("<option>", {
            value: category.id,
            text: category.id + ". " + category.name
        }));
    });
};

/* Читает значения формы в объект. */
KB.readProductForm = function () {
    return {
        name: String($("#form-name").val()).trim(),
        categoryId: Number($("#form-category").val()),
        price: Number($("#form-price").val()),
        brand: String($("#form-brand").val()).trim(),
        description: String($("#form-description").val()).trim(),
        inStock: $("#form-instock").prop("checked")
    };
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
    $("#product-form")[0].reset();
    $("#form-errors").empty().removeClass("has-errors");
    $("#product-form-title").text("Добавить товар");
    KB.populateCategorySelect();
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
