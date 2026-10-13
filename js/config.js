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

/* Структурированные параметры для проверки совместимости. */
KB.COMPATIBILITY_FIELDS = {
    1: [
        { key: "socket", label: "Сокет процессора", type: "select", options: ["AM4", "AM5", "LGA1700"] }
    ],
    2: [
        { key: "supportedSockets", label: "Поддерживаемые сокеты кулера", type: "checkboxes", options: ["AM4", "AM5", "LGA1700"] }
    ],
    3: [
        { key: "socket", label: "Сокет материнской платы", type: "select", options: ["AM4", "AM5", "LGA1700"] },
        { key: "memoryType", label: "Тип памяти", type: "select", options: ["DDR4", "DDR5"] },
        { key: "formFactor", label: "Форм-фактор платы", type: "select", options: ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"] }
    ],
    4: [
        { key: "memoryType", label: "Тип памяти", type: "select", options: ["DDR4", "DDR5"] }
    ],
    6: [
        { key: "recommendedPsuWattage", label: "Рекомендуемая мощность блока питания (Вт)", type: "number", min: 1 }
    ],
    7: [
        { key: "supportedFormFactors", label: "Поддерживаемые форм-факторы плат", type: "checkboxes", options: ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"] }
    ],
    8: [
        { key: "wattage", label: "Мощность блока питания (Вт)", type: "number", min: 1 }
    ]
};

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
        ["DeepCool AK400", 2900, "DeepCool", "Башенный кулер, 4 тепловые трубки", true, "product_cards/Cpu Cooler/Deepcool AK400.jpg"],
        ["Noctua NH-D15", 10900, "Noctua", "Двухбашенный, тихий и мощный", true, "product_cards/Cpu Cooler/Noctua NH-D15.jpg"],
        ["Arctic Liquid Freezer II 240", 7900, "Arctic", "СЖО 240 мм", true, "product_cards/Cpu Cooler/ARCTIC Liquid Freezer II 240.jpg"],
        ["be quiet! Pure Rock 2", 3400, "be quiet!", "Башня 150 Вт", true, "product_cards/Cpu Cooler/be quiet! Pure Rock 2.jpg"],
        ["ID-Cooling SE-224-XT", 1900, "ID-Cooling", "Бюджетный башенный кулер", false, "product_cards/Cpu Cooler/ID-COOLING SE-224-XT.jpg"]
    ],
    3: [
        ["MSI MAG B650 Tomahawk", 18900, "MSI", "AM5, DDR5, Wi-Fi 6E", true, "product_cards/Motherboard/MSI MAG B650 TOMAHAWK.jpg"],
        ["ASUS TUF B760-Plus", 16900, "ASUS", "LGA1700, DDR5, усиленное питание", true, "product_cards/Motherboard/Asus TUF GAMING B760-PLUS.jpg"],
        ["Gigabyte X670 Aorus Elite", 32900, "Gigabyte", "AM5, топовый чипсет", false, "product_cards/Motherboard/Gigabyte X670 AORUS ELITE.jpg"],
        ["ASRock B550M Pro4", 8900, "ASRock", "AM4, micro-ATX", true, "product_cards/Motherboard/ASRock B550M Pro4.jpg"],
        ["MSI MAG Z790 Tomahawk", 28900, "MSI", "LGA1700, разгон, DDR5", true, "product_cards/Motherboard/MSI MAG Z790 TOMAHAWK.jpg"]
    ],
    4: [
        ["Kingston Fury 16GB DDR4 3200", 4200, "Kingston", "2×8 ГБ, DDR4 3200 МГц", true, "product_cards/Memory/Kingston FURY Beast 16 GB.jpg"],
        ["G.Skill Trident Z5 32GB DDR5", 12900, "G.Skill", "2×16 ГБ, DDR5 6000 МГц", true, "product_cards/Memory/G.Skill Trident Z5 RGB 32 GB.jpg"],
        ["Corsair Vengeance 16GB DDR5", 6100, "Corsair", "2×8 ГБ, DDR5 5200 МГц", true, "product_cards/Memory/Corsair Vengeance RGB 16 GB.jpg"],
        ["Crucial 8GB DDR4 2666", 2100, "Crucial", "1×8 ГБ, DDR4 2666 МГц", false, "product_cards/Memory/Crucial CT8G4DFD8213 8 GB.jpg"],
        ["Patriot Viper 32GB DDR4", 8900, "Patriot", "2×16 ГБ, DDR4 3600 МГц", true, "product_cards/Memory/Patriot Viper Steel 32 GB.jpg"]
    ],
    5: [
        ["Samsung 980 Pro 1TB", 8900, "Samsung", "NVMe PCIe 4.0, до 7000 МБ/с", true, "product_cards/Storage/Samsung 980 Pro 1TB.jpg"],
        ["Kingston NV2 500GB", 3400, "Kingston", "NVMe PCIe 4.0, бюджетный", true, "product_cards/Storage/Kingston NV2 500GB.jpg"],
        ["WD Black SN850X 2TB", 17900, "Western Digital", "NVMe PCIe 4.0, игровой", true, "product_cards/Storage/WD Black SN850X 2TB.jpg"],
        ["Seagate Barracuda 2TB", 5200, "Seagate", "HDD 7200 об/мин, SATA", true, "product_cards/Storage/Seagate Barracuda 2TB.jpg"],
        ["Crucial MX500 1TB", 6900, "Crucial", "SATA SSD, 2.5\"", false, "product_cards/Storage/Crucial MX500 1 TB.jpg"]
    ],
    6: [
        ["NVIDIA RTX 4070 12GB", 58900, "NVIDIA", "DLSS 3, трассировка лучей", true, "product_cards/Video card/Asus TUF GAMING OC GeForce RTX 4070 12 GB.jpg"],
        ["AMD RX 7800 XT 16GB", 52900, "AMD", "16 ГБ, 1440p-гейминг", true, "product_cards/Video card/Sapphire NITRO+ Radeon RX 7800 XT 16 GB.jpg"],
        ["NVIDIA RTX 4060 Ti 8GB", 39900, "NVIDIA", "Компактная, эффективная", true, "product_cards/Video card/Gigabyte EAGLE GeForce RTX 4060 Ti 8 GB.jpg"],
        ["AMD RX 6600 8GB", 19900, "AMD", "Бюджетная 1080p", false, "product_cards/Video card/ASRock Challenger D Radeon RX 6600 8 GB.jpg"],
        ["NVIDIA RTX 4090 24GB", 189900, "NVIDIA", "Флагман 4K", true, "product_cards/Video card/MSI SUPRIM LIQUID X GeForce RTX 4090 24 GB.jpg"]
    ],
    7: [
        ["NZXT H5 Flow", 8900, "NZXT", "Mid-Tower, продуваемый", true, "product_cards/Case/NZXT H5 Flow.jpg"],
        ["Fractal Design Pop Air", 7400, "Fractal Design", "Mid-Tower, 3 вентилятора", true, "product_cards/Case/Fractal Design Pop Air.jpg"],
        ["Lian Li Lancool 216", 9900, "Lian Li", "Mid-Tower, mesh-фронт", true, "product_cards/Case/Lian Li Lancool 216.jpg"],
        ["Corsair 4000D Airflow", 8200, "Corsair", "Mid-Tower, airflow", true, "product_cards/Case/Corsair 4000D Airflow.jpg"],
        ["DeepCool CH510", 5400, "DeepCool", "Mid-Tower, бюджетный", false, "product_cards/Case/DeepCool CH510.jpg"]
    ],
    8: [
        ["Corsair RM750e 750W", 9900, "Corsair", "750 Вт, 80+ Gold, модульный", true, "product_cards/Power supply/Corsair RM750e 750W.jpg"],
        ["Seasonic Focus GX-650", 8900, "Seasonic", "650 Вт, 80+ Gold", true, "product_cards/Power supply/Seasonic Focus GX-650.jpg"],
        ["be quiet! Pure Power 12 M 850W", 11900, "be quiet!", "850 Вт, 80+ Gold", true, "product_cards/Power supply/be quiet! Pure Power 12 M 850W.jpg"],
        ["Cooler Master MWE 550W", 4900, "Cooler Master", "550 Вт, 80+ Bronze", false, "product_cards/Power supply/Cooler Master MWE Gold V3 550 W.jpg"],
        ["MSI MPG A1000G 1000W", 15900, "MSI", "1000 Вт, 80+ Gold", true, "product_cards/Power supply/MSI MPG A1000G 1000W.jpg"]
    ],
    9: [
        ["Windows 11 Home", 12900, "Microsoft", "Домашняя лицензия", true, "product_cards/Operating system/Windows 11 Home.jpg"],
        ["Windows 11 Pro", 19900, "Microsoft", "Профессиональная лицензия", true, "product_cards/Operating system/Windows 11 Pro.jpg"],
        ["Windows 10 Home", 9900, "Microsoft", "Домашняя лицензия", false, "product_cards/Operating system/Windows 10 Home.jpg"],
        ["Ubuntu 24.04 LTS (USB)", 500, "Canonical", "Установочная флешка", true, "product_cards/Operating system/Ubuntu 24.04 LTS.jpg"],
        ["Fedora Workstation (USB)", 500, "Red Hat", "Установочная флешка", true, "product_cards/Operating system/Fedora Workstation.png"]
    ],
    10: [
        ["Dell S2721QS 27\"", 32900, "Dell", "27\", 4K IPS, 60 Гц", true, "product_cards/Monitor/Dell S2721QS 27\".jpg"],
        ["LG 27GP850 27\"", 38900, "LG", "27\", 1440p IPS, 165 Гц", true, "product_cards/Monitor/LG 27GP850 27\".jpg"],
        ["Samsung Odyssey G5 32\"", 29900, "Samsung", "32\", 1440p VA, 144 Гц", true, "product_cards/Monitor/Samsung Odyssey G5 32\".jpg"],
        ["AOC 24G2 24\"", 14900, "AOC", "24\", 1080p IPS, 144 Гц", false, "product_cards/Monitor/AOC 24G2 24\".jpg"],
        ["ASUS ProArt PA248QV", 22900, "ASUS", "24\", 1920×1200 IPS", true, "product_cards/Monitor/ASUS ProArt PA248QV.jpg"]
    ]
};

/* Базовые профили совместимости для комплектующих. */
KB.PRODUCT_COMPATIBILITY = {
    "AMD Ryzen 5 7600X": { socket: "AM5" },
    "Intel Core i5-13600K": { socket: "LGA1700" },
    "AMD Ryzen 7 7800X3D": { socket: "AM5" },
    "Intel Core i9-13900K": { socket: "LGA1700" },
    "AMD Ryzen 5 5600": { socket: "AM4" },

    "DeepCool AK400": { supportedSockets: ["AM4", "AM5", "LGA1700"] },
    "Noctua NH-D15": { supportedSockets: ["AM4", "AM5", "LGA1700"] },
    "Arctic Liquid Freezer II 240": { supportedSockets: ["AM4", "AM5", "LGA1700"] },
    "be quiet! Pure Rock 2": { supportedSockets: ["AM4", "AM5", "LGA1700"] },
    "ID-Cooling SE-224-XT": { supportedSockets: ["AM4", "AM5", "LGA1700"] },

    "MSI MAG B650 Tomahawk": { socket: "AM5", memoryType: "DDR5", formFactor: "ATX" },
    "ASUS TUF B760-Plus": { socket: "LGA1700", memoryType: "DDR5", formFactor: "ATX" },
    "Gigabyte X670 Aorus Elite": { socket: "AM5", memoryType: "DDR5", formFactor: "ATX" },
    "ASRock B550M Pro4": { socket: "AM4", memoryType: "DDR4", formFactor: "Micro-ATX" },
    "MSI MAG Z790 Tomahawk": { socket: "LGA1700", memoryType: "DDR5", formFactor: "ATX" },

    "Kingston Fury 16GB DDR4 3200": { memoryType: "DDR4" },
    "G.Skill Trident Z5 32GB DDR5": { memoryType: "DDR5" },
    "Corsair Vengeance 16GB DDR5": { memoryType: "DDR5" },
    "Crucial 8GB DDR4 2666": { memoryType: "DDR4" },
    "Patriot Viper 32GB DDR4": { memoryType: "DDR4" },

    "Samsung 980 Pro 1TB": { storageType: "NVMe" },
    "Kingston NV2 500GB": { storageType: "NVMe" },
    "WD Black SN850X 2TB": { storageType: "NVMe" },
    "Seagate Barracuda 2TB": { storageType: "HDD" },
    "Crucial MX500 1TB": { storageType: "SATA" },

    "NVIDIA RTX 4070 12GB": { powerRequirement: 200, recommendedPsuWattage: 650 },
    "AMD RX 7800 XT 16GB": { powerRequirement: 230, recommendedPsuWattage: 750 },
    "NVIDIA RTX 4060 Ti 8GB": { powerRequirement: 160, recommendedPsuWattage: 550 },
    "AMD RX 6600 8GB": { powerRequirement: 130, recommendedPsuWattage: 500 },
    "NVIDIA RTX 4090 24GB": { powerRequirement: 330, recommendedPsuWattage: 850 },

    "NZXT H5 Flow": { supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"] },
    "Fractal Design Pop Air": { supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"] },
    "Lian Li Lancool 216": { supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX", "E-ATX"] },
    "Corsair 4000D Airflow": { supportedFormFactors: ["ATX", "Micro-ATX", "Mini-ITX"] },
    "DeepCool CH510": { supportedFormFactors: ["Micro-ATX", "Mini-ITX"] },

    "Corsair RM750e 750W": { wattage: 750 },
    "Seasonic Focus GX-650": { wattage: 650 },
    "be quiet! Pure Power 12 M 850W": { wattage: 850 },
    "Cooler Master MWE 550W": { wattage: 550 },
    "MSI MPG A1000G 1000W": { wattage: 1000 }
};

/* Находит профиль совместимости по имени товара. */
KB.getCompatibilityProfile = function (product) {
    if (!product || !product.name) {
        return {};
    }

    return KB.PRODUCT_COMPATIBILITY[product.name] || {};
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
