export interface HistoricalRecord {
  month: string;
  purchases: { name: string; amount: number; category: string }[];
  services: { customerName: string; service: string; amount: number; isHomeService?: boolean }[];
}

export const HISTORICAL_DATA: HistoricalRecord[] = [
  {
    month: "July 2026",
    purchases: [
      { name: "Wash tub", amount: 140, category: "EQUIPMENT" },
      { name: "Streak serum", amount: 70, category: "PRODUCT_PURCHASE" },
      { name: "Oil", amount: 290, category: "PRODUCT_PURCHASE" },
      { name: "Massage cloth", amount: 20, category: "EQUIPMENT" },
      { name: "Disposable cloth", amount: 107, category: "PRODUCT_PURCHASE" },
    ],
    services: [
      { customerName: "Adeena", service: "Back massage", amount: 400, isHomeService: true },
      { customerName: "Adeena", service: "Back massage", amount: 400, isHomeService: true },
      { customerName: "Sabi", service: "Back massage", amount: 400, isHomeService: true },
      { customerName: "Jisnu", service: "Back massage", amount: 400, isHomeService: true },
    ],
  },
  {
    month: "August 2026",
    purchases: [
      { name: "Massage roller", amount: 195, category: "EQUIPMENT" },
      { name: "Gold bleach", amount: 130, category: "PRODUCT_PURCHASE" },
      { name: "Astringent", amount: 161, category: "PRODUCT_PURCHASE" },
      { name: "Detan Kit", amount: 87, category: "PRODUCT_PURCHASE" },
      { name: "Sleek Hot Wax", amount: 146, category: "PRODUCT_PURCHASE" },
      { name: "Rose water", amount: 107, category: "PRODUCT_PURCHASE" },
      { name: "Disposable panty", amount: 299, category: "PRODUCT_PURCHASE" },
    ],
    services: [
      { customerName: "Priyanka", service: "Full leg + Back", amount: 1400, isHomeService: true },
      { customerName: "Suja Alexander", service: "Head massage", amount: 400, isHomeService: true },
    ],
  },
  {
    month: "September 2026",
    purchases: [
      { name: "Jabini", amount: 2200, category: "EQUIPMENT" },
      { name: "Spa apron", amount: 242, category: "EQUIPMENT" },
      { name: "Hair cut apron", amount: 175, category: "EQUIPMENT" },
      { name: "Hair dying and clips", amount: 134, category: "EQUIPMENT" },
      { name: "5 Facial kits", amount: 227, category: "PRODUCT_PURCHASE" },
      { name: "Hair cut accessories", amount: 227, category: "EQUIPMENT" },
      { name: "2 D-tan kits", amount: 128, category: "PRODUCT_PURCHASE" },
      { name: "Skin whitening facial kit", amount: 126, category: "PRODUCT_PURCHASE" },
      { name: "Ubtan facial kit", amount: 98, category: "PRODUCT_PURCHASE" },
      { name: "Scissor", amount: 200, category: "EQUIPMENT" },
      { name: "Epsom salt", amount: 282, category: "PRODUCT_PURCHASE" },
      { name: "Wet wipes", amount: 190, category: "PRODUCT_PURCHASE" },
      { name: "Ring light", amount: 338, category: "EQUIPMENT" },
    ],
    services: [
      { customerName: "Jisnu", service: "Head + Back", amount: 800, isHomeService: true },
      { customerName: "Lavanya", service: "Head + Back (Home service)", amount: 900, isHomeService: true },
    ],
  },
];

export const INITIAL_CATEGORIES = [
  { name: "Massage", slug: "massage", iconName: "Sparkles", displayOrder: 1 },
  { name: "Facial", slug: "facial", iconName: "Flower", displayOrder: 2 },
  { name: "Hair", slug: "hair", iconName: "Scissors", displayOrder: 3 },
  { name: "Makeup", slug: "makeup", iconName: "Palette", displayOrder: 4 },
  { name: "Nails", slug: "nails", iconName: "Hand", displayOrder: 5 },
  { name: "Threading", slug: "threading", iconName: "Feather", displayOrder: 6 },
  { name: "Waxing", slug: "waxing", iconName: "Flame", displayOrder: 7 },
  { name: "Packages", slug: "packages", iconName: "Gift", displayOrder: 8 },
  { name: "Other", slug: "other", iconName: "Tag", displayOrder: 9 },
];

export const INITIAL_SERVICES = [
  {
    categorySlug: "massage",
    name: "Relaxing Body Massage",
    description: "Holistic full body herbal massage with warm Ayurvedic oils for deep muscle relaxation and rejuvenation.",
    benefits: "Relieves muscle stiffness, improves blood circulation, calms anxiety.",
    durationMins: 60,
    price: 499,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Ayurvedic Massage Oil", quantity: 60, unit: "ml" },
      { itemName: "Disposable Massage Sheet", quantity: 1, unit: "units" },
    ]
  },
  {
    categorySlug: "massage",
    name: "Back Massage",
    description: "Targeted soothing massage focusing on shoulder blades, neck, and lower back tension.",
    benefits: "Alleviates chronic backache, tension headaches, and posture fatigue.",
    durationMins: 30,
    price: 400,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Ayurvedic Massage Oil", quantity: 30, unit: "ml" },
      { itemName: "Disposable Massage Sheet", quantity: 1, unit: "units" },
    ]
  },
  {
    categorySlug: "massage",
    name: "Head + Back Massage Combo",
    description: "Stress-relieving head champi combined with intensive upper & lower back massage.",
    benefits: "Promotes sound sleep, stimulates hair follicles, melts stress.",
    durationMins: 45,
    price: 800,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Ayurvedic Massage Oil", quantity: 45, unit: "ml" },
      { itemName: "Disposable Massage Sheet", quantity: 1, unit: "units" },
    ]
  },
  {
    categorySlug: "facial",
    name: "Basic Glow Facial",
    description: "Deep pore cleansing, gentle exfoliation, steam, hydrating massage cream, and soothing pack.",
    benefits: "Removes dead skin, boosts hydration, leaves natural bridal glow.",
    durationMins: 45,
    price: 700,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Facial Massage Cream", quantity: 15, unit: "ml" },
      { itemName: "Face Pack Powder", quantity: 10, unit: "g" },
      { itemName: "Hydrating Sheet Mask", quantity: 1, unit: "units" },
      { itemName: "Rose Water", quantity: 10, unit: "ml" },
    ]
  },
  {
    categorySlug: "facial",
    name: "Skin Whitening & Detan Facial",
    description: "Advanced brightening facial with active fruit enzymes and antioxidant pack for sun-damaged skin.",
    benefits: "Fades pigmentation, evens skin tone, instantly lifts tan.",
    durationMins: 60,
    price: 999,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1512290900672-1f4a9b6d8ca1?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Detan Kit & Bleach", quantity: 1, unit: "units" },
      { itemName: "Facial Massage Cream", quantity: 20, unit: "ml" },
      { itemName: "Face Pack Powder", quantity: 15, unit: "g" },
    ]
  },
  {
    categorySlug: "hair",
    name: "Hair Styling & Blow Dry",
    description: "Professional blow-out styling, heat protection, and smooth finish for any occasion.",
    benefits: "Glossy volume, frizz control, long-lasting bounce.",
    durationMins: 30,
    price: 299,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Streak Hair Serum", quantity: 5, unit: "ml" },
    ]
  },
  {
    categorySlug: "makeup",
    name: "Light Party Makeup",
    description: "Subtle, dewy party makeup enhancing natural features with waterproof base and soft eye glam.",
    benefits: "Long-lasting, photo-ready, lightweight comfort.",
    durationMins: 45,
    price: 299,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Wet Wipes & Cotton", quantity: 2, unit: "units" },
    ]
  },
  {
    categorySlug: "other",
    name: "Traditional Saree Draping",
    description: "Flawless Kerala traditional Kasavu saree, Silk saree, or pleated modern draping.",
    benefits: "Secure pin-up, wrinkle-free pleats, elegant drape throughout the event.",
    durationMins: 20,
    price: 499,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
    materials: []
  },
  {
    categorySlug: "waxing",
    name: "Full Leg + Back Waxing",
    description: "Smooth Sleek hot wax application followed by soothing astringent and post-wax lotion.",
    benefits: "Silky smooth skin for weeks, gentle hair removal.",
    durationMins: 45,
    price: 1400,
    isHomeService: true,
    imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
    materials: [
      { itemName: "Sleek Hot Wax", quantity: 150, unit: "g" },
      { itemName: "Astringent Lotion", quantity: 15, unit: "ml" },
    ]
  }
];

export const INITIAL_PACKAGES = [
  {
    title: "Triple Dhamaka Offer",
    slug: "triple-dhamaka-offer",
    description: "Complete festive party makeover including Saree Draping, Light Makeup, and Hair Styling.",
    badgeText: "Most Popular",
    price: 999,
    originalPrice: 1097,
    savings: 98,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    serviceNames: ["Traditional Saree Draping", "Light Party Makeup", "Hair Styling & Blow Dry"]
  },
  {
    title: "Onam Adipoli Special Package",
    slug: "onam-adipoli-offer",
    description: "Traditional Kerala celebration package with Back Massage, Glow Facial, and Saree Draping.",
    badgeText: "Festive Special",
    price: 1399,
    originalPrice: 1598,
    savings: 199,
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    serviceNames: ["Back Massage", "Basic Glow Facial", "Traditional Saree Draping"]
  }
];

export const INITIAL_INVENTORY = [
  { name: "Ayurvedic Massage Oil", category: "Oils", unit: "ml", openingQuantity: 1000, currentQuantity: 850, minStockLevel: 200, purchasePrice: 290 },
  { name: "Facial Massage Cream", category: "Creams", unit: "ml", openingQuantity: 500, currentQuantity: 420, minStockLevel: 100, purchasePrice: 227 },
  { name: "Face Pack Powder", category: "Packs", unit: "g", openingQuantity: 400, currentQuantity: 350, minStockLevel: 80, purchasePrice: 98 },
  { name: "Hydrating Sheet Mask", category: "Masks", unit: "units", openingQuantity: 20, currentQuantity: 16, minStockLevel: 5, purchasePrice: 45 },
  { name: "Rose Water", category: "Toners", unit: "ml", openingQuantity: 500, currentQuantity: 460, minStockLevel: 100, purchasePrice: 107 },
  { name: "Detan Kit & Bleach", category: "Kits", unit: "units", openingQuantity: 10, currentQuantity: 7, minStockLevel: 3, purchasePrice: 130 },
  { name: "Streak Hair Serum", category: "Hair Care", unit: "ml", openingQuantity: 200, currentQuantity: 185, minStockLevel: 50, purchasePrice: 70 },
  { name: "Sleek Hot Wax", category: "Wax", unit: "g", openingQuantity: 1000, currentQuantity: 700, minStockLevel: 250, purchasePrice: 146 },
  { name: "Astringent Lotion", category: "Lotions", unit: "ml", openingQuantity: 500, currentQuantity: 450, minStockLevel: 100, purchasePrice: 161 },
  { name: "Disposable Massage Sheet", category: "Disposables", unit: "units", openingQuantity: 50, currentQuantity: 38, minStockLevel: 10, purchasePrice: 10 },
  { name: "Wet Wipes & Cotton", category: "Disposables", unit: "units", openingQuantity: 100, currentQuantity: 82, minStockLevel: 20, purchasePrice: 2 },
];
