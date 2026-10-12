/* ============================================================
   config.js — пространство имён, константы, тестовые данные,
   начальное состояние приложения.

   Все модули Builder живут в одном объекте window.KB, чтобы не
   засорять глобальную область и не требовать сборщика.
   ============================================================ */

window.KB = window.KB || {};

/* Ключи для localStorage. */
KB.STORAGE_KEYS = {
    products: "builderProducts",
    categories: "builderCategories"
};

/* Фиксированный порядок и названия десяти категорий. */
KB.CATEGORY_NAMES = [
    "CPU",
    "CPU Cooler",
    "Motherboard",
    "Memory",
    "Storage",
    "Video card",
    "Case",
    "Power supply",
    "Operating System",
    "Monitor"
];

/* Иконка-заглушка для карточки товара (у товаров нет изображений). */
KB.CATEGORY_ICONS = {
    1: "\u{1F9E0}",          // CPU
    2: "\u2744\uFE0F",       // CPU Cooler
    3: "\u{1F9E9}",          // Motherboard
    4: "\u{1F4BE}",          // Memory
    5: "\u{1F4BE}",          // Storage
    6: "\u{1F3AE}",          // Video card
    7: "\u{1F5C4}\uFE0F",    // Case
    8: "\u{1F50C}",          // Power supply
    9: "\u{1FA9F}",          // Operating System
    10: "\u{1F5A5}\uFE0F"    // Monitor
};

/* Символ валюты для форматирования цены. */
KB.CURRENCY = "\u20BD";

/* Тестовый каталог: [название, цена, производитель, описание, в наличии, изображение].
   Изображение — необязательный шестой элемент (путь к файлу).
   Данные правдоподобны по структуре, но не являются реальными
   предложениями конкретных магазинов. */
KB.SEED_CATALOG = {
    1: [
        ["AMD Ryzen 5 7600X", 21500, "AMD", "6 ядер / 12 потоков, сокет AM5", true, "product_cards/CPU/AMD/ryzen 5 7600x.jpg"],
        ["Intel Core i5-13600K", 28900, "Intel", "14 ядер, сокет LGA1700", true, "product_cards/CPU/Intel/i5-13600k.jpg"],
        ["AMD Ryzen 7 7800X3D", 45900, "AMD", "8 ядер, 3D V-Cache, игровой", true, "product_cards/CPU/AMD/ryzen 7 7800x3d.jpg"],
        ["Intel Core i9-13900K", 62900, "Intel", "24 ядра, флагманский", false, "product_cards/CPU/Intel/i9-13900k.jpg"],
        ["AMD Ryzen 5 5600", 11900, "AMD", "6 ядер / 12 потоков, сокет AM4", true, "product_cards/CPU/AMD/ryzen 5 5600.jpg"]
    ],
    2: [
        ["DeepCool AK400", 2900, "DeepCool", "Башенный кулер, 4 тепловые трубки", true],
        ["Noctua NH-D15", 10900, "Noctua", "Двухбашенный, тихий и мощный", true],
        ["Arctic Liquid Freezer II 240", 7900, "Arctic", "СЖО 240 мм", true],
        ["be quiet! Pure Rock 2", 3400, "be quiet!", "Башня 150 Вт", true],
        ["ID-Cooling SE-224-XT", 1900, "ID-Cooling", "Бюджетный башенный кулер", false]
    ],
    3: [
        ["MSI MAG B650 Tomahawk", 18900, "MSI", "AM5, DDR5, Wi-Fi 6E", true],
        ["ASUS TUF B760-Plus", 16900, "ASUS", "LGA1700, DDR5, усиленное питание", true],
        ["Gigabyte X670 Aorus Elite", 32900, "Gigabyte", "AM5, топовый чипсет", false],
        ["ASRock B550M Pro4", 8900, "ASRock", "AM4, micro-ATX", true],
        ["MSI MAG Z790 Tomahawk", 28900, "MSI", "LGA1700, разгон, DDR5", true]
    ],
    4: [
        ["Kingston Fury 16GB DDR4 3200", 4200, "Kingston", "2×8 ГБ, DDR4 3200 МГц", true],
        ["G.Skill Trident Z5 32GB DDR5", 12900, "G.Skill", "2×16 ГБ, DDR5 6000 МГц", true],
        ["Corsair Vengeance 16GB DDR5", 6100, "Corsair", "2×8 ГБ, DDR5 5200 МГц", true],
        ["Crucial 8GB DDR4 2666", 2100, "Crucial", "1×8 ГБ, DDR4 2666 МГц", false],
        ["Patriot Viper 32GB DDR4", 8900, "Patriot", "2×16 ГБ, DDR4 3600 МГц", true]
    ],
    5: [
        ["Samsung 980 Pro 1TB", 8900, "Samsung", "NVMe PCIe 4.0, до 7000 МБ/с", true],
        ["Kingston NV2 500GB", 3400, "Kingston", "NVMe PCIe 4.0, бюджетный", true],
        ["WD Black SN850X 2TB", 17900, "Western Digital", "NVMe PCIe 4.0, игровой", true],
        ["Seagate Barracuda 2TB", 5200, "Seagate", "HDD 7200 об/мин, SATA", true],
        ["Crucial MX500 1TB", 6900, "Crucial", "SATA SSD, 2.5\"", false]
    ],
    6: [
        ["NVIDIA RTX 4070 12GB", 58900, "NVIDIA", "DLSS 3, трассировка лучей", true],
        ["AMD RX 7800 XT 16GB", 52900, "AMD", "16 ГБ, 1440p-гейминг", true],
        ["NVIDIA RTX 4060 Ti 8GB", 39900, "NVIDIA", "Компактная, эффективная", true],
        ["AMD RX 6600 8GB", 19900, "AMD", "Бюджетная 1080p", false],
        ["NVIDIA RTX 4090 24GB", 189900, "NVIDIA", "Флагман 4K", true]
    ],
    7: [
        ["NZXT H5 Flow", 8900, "NZXT", "Mid-Tower, продуваемый", true],
        ["Fractal Design Pop Air", 7400, "Fractal Design", "Mid-Tower, 3 вентилятора", true],
        ["Lian Li Lancool 216", 9900, "Lian Li", "Mid-Tower, mesh-фронт", true],
        ["Corsair 4000D Airflow", 8200, "Corsair", "Mid-Tower, airflow", true],
        ["DeepCool CH510", 5400, "DeepCool", "Mid-Tower, бюджетный", false]
    ],
    8: [
        ["Corsair RM750e 750W", 9900, "Corsair", "750 Вт, 80+ Gold, модульный", true],
        ["Seasonic Focus GX-650", 8900, "Seasonic", "650 Вт, 80+ Gold", true],
        ["be quiet! Pure Power 12 M 850W", 11900, "be quiet!", "850 Вт, 80+ Gold", true],
        ["Cooler Master MWE 550W", 4900, "Cooler Master", "550 Вт, 80+ Bronze", false],
        ["MSI MPG A1000G 1000W", 15900, "MSI", "1000 Вт, 80+ Gold", true]
    ],
    9: [
        ["Windows 11 Home", 12900, "Microsoft", "Домашняя лицензия", true],
        ["Windows 11 Pro", 19900, "Microsoft", "Профессиональная лицензия", true],
        ["Windows 10 Home", 9900, "Microsoft", "Домашняя лицензия", false],
        ["Ubuntu 24.04 LTS (USB)", 500, "Canonical", "Установочная флешка", true],
        ["Fedora Workstation (USB)", 500, "Red Hat", "Установочная флешка", true]
    ],
    10: [
        ["Dell S2721QS 27\"", 32900, "Dell", "27\", 4K IPS, 60 Гц", true],
        ["LG 27GP850 27\"", 38900, "LG", "27\", 1440p IPS, 165 Гц", true],
        ["Samsung Odyssey G5 32\"", 29900, "Samsung", "32\", 1440p VA, 144 Гц", true],
        ["AOC 24G2 24\"", 14900, "AOC", "24\", 1080p IPS, 144 Гц", false],
        ["ASUS ProArt PA248QV", 22900, "ASUS", "24\", 1920×1200 IPS", true]
    ]
};

/* Изменяемое состояние интерфейса. */
KB.state = {
    categories: [],                                     // список категорий
    products: [],                                       // список товаров
    activeCategoryId: 1,                                // текущая категория
    searchQuery: "",                                    // строка поиска
    activeFilters: { stock: "all", minPrice: null, maxPrice: null },
    activeSort: { field: "name", dir: "asc" },          // сортировка
    editingProductId: null,                             // редактируемый товар
    nextProductId: 101                                  // следующий id
};
