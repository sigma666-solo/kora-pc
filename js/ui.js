/* ============================================================
   ui.js — сообщения, модальные окна, меню, завершение сборки,
   переключение активной категории.
   ============================================================ */

window.KB = window.KB || {};

/* Показывает всплывающее сообщение с эффектом fadeIn/fadeOut. */
KB.showMessage = function (message, type) {
    const $message = $("<div>", {
        class: "message message-" + (type || "info")
    });
    $message.text(message);

    $("#messages").append($message);
    $message.hide().fadeIn(200);

    window.setTimeout(function () {
        $message.fadeOut(300, function () {
            $(this).remove();
        });
    }, 3200);
};

/* Открывает модальное окно с эффектом slideDown. */
KB.openModal = function (modalId) {
    const $modal = $("#" + modalId);

    if ($modal.length === 0) {
        return;
    }

    $modal.addClass("active");
    /* stop(true) без jumpToEnd: не даём «догоняющему» колбэку закрытия
       снять класс active у только что открытого окна. */
    $modal.find(".modal-content").stop(true).hide().slideDown(180, function () {
        /* Переводим фокус в первое поле, если оно есть (форма товара). */
        $(this).find("input, select, textarea").filter(":visible").first().trigger("focus");
    });
};

/* Закрывает модальное окно с эффектом slideUp. */
KB.closeModal = function (modalId) {
    const $modal = $("#" + modalId);

    if ($modal.length === 0 || !$modal.hasClass("active")) {
        return;
    }

    $modal.find(".modal-content").stop(true, true).slideUp(150, function () {
        $modal.removeClass("active");
        $(this).css("display", "");
    });
};

/* Обрабатывает пункты выпадающего меню. */
KB.handleMenuAction = function (action) {
    if (action === "add") {
        KB.openProductForm();
    } else if (action === "summary") {
        KB.handleCompleteBuild();
    } else if (action === "reset-build") {
        KB.resetBuild();
    }
};

/* Проверяет сборку и открывает итоговое окно. */
KB.handleCompleteBuild = function () {
    const total = KB.state.categories.length;
    const filled = KB.countFilledCategories();

    if (filled < total) {
        const missing = total - filled;
        KB.showMessage(
            "Сборка не завершена: не хватает " + missing +
            " категорий (заполнено " + filled + " из " + total + ").",
            "error"
        );
        return;
    }

    KB.renderSummary();
    KB.openModal("summary-modal");
};

/* Переключает активную категорию. */
KB.switchCategory = function (categoryId) {
    if (KB.state.activeCategoryId === categoryId) {
        return;
    }

    KB.state.activeCategoryId = categoryId;
    KB.state.searchQuery = "";
    $("#search-input").val("");

    $("#category-list .category-item").removeClass("is-active");
    $('#category-list .category-item[data-category-id="' + categoryId + '"]').addClass("is-active");

    KB.renderProducts();
};
