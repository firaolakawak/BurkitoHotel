export interface PosMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  tag?: "Chef's Special" | 'Vegetarian' | 'Spicy' | 'Gluten Free';
  isVegetarian?: boolean;
  isSpicy?: boolean;
  favorite?: boolean;
  linkedInventorySku?: string;
  defaultNote?: string;
}

export const POS_MENU_ITEMS: PosMenuItem[] = [
  {
    id: 'pos-1',
    name: 'Classic Burger',
    price: 48.00,
    description: 'Beef patty, lettuce, tomato, cheddar cheese, fries',
    category: 'Grill & Barbecue',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    tag: "Chef's Special",
    linkedInventorySku: 'FB-001',
    favorite: true
  },
  {
    id: 'pos-2',
    name: 'Margherita Pizza',
    price: 42.00,
    description: 'Tomato sauce, mozzarella, fresh basil',
    category: 'Pizza & Pasta',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&auto=format&fit=crop&q=80',
    tag: 'Vegetarian',
    isVegetarian: true,
    linkedInventorySku: 'FB-002',
    favorite: true,
    defaultNote: 'Regular'
  },
  {
    id: 'pos-3',
    name: 'Grilled Salmon',
    price: 75.00,
    description: 'Served with seasonal vegetables and lemon butter sauce',
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&auto=format&fit=crop&q=80',
    tag: "Chef's Special",
    linkedInventorySku: 'FB-001',
    favorite: true,
    defaultNote: 'No sauce, extra vegetables'
  },
  {
    id: 'pos-4',
    name: 'Caesar Salad',
    price: 38.00,
    description: 'Romaine lettuce, parmesan, croutons, caesar dressing',
    category: 'Salads',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&auto=format&fit=crop&q=80',
    tag: 'Vegetarian',
    isVegetarian: true,
    isSpicy: true,
    favorite: true,
    defaultNote: 'Regular'
  },
  {
    id: 'pos-5',
    name: 'Chicken Alfredo Pasta',
    price: 45.00,
    description: 'Creamy Alfredo sauce, grilled chicken, parmesan',
    category: 'Pizza & Pasta',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&auto=format&fit=crop&q=80',
    favorite: true
  },
  {
    id: 'pos-6',
    name: 'Beef Steak',
    price: 95.00,
    description: 'Ribeye steak with mashed potato and grilled vegetables',
    category: 'Grill & Barbecue',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    tag: "Chef's Special",
    isVegetarian: true,
    favorite: true
  },
  {
    id: 'pos-7',
    name: 'Tomato Soup',
    price: 28.00,
    description: 'Fresh tomato, herbs, served with garlic bread',
    category: 'Soups',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&auto=format&fit=crop&q=80',
    tag: 'Vegetarian',
    isVegetarian: true,
    isSpicy: true,
    favorite: true
  },
  {
    id: 'pos-8',
    name: 'Chicken Tikka',
    price: 52.00,
    description: 'Marinated chicken, served with rice and naan',
    category: 'Asian Cuisine',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=400&auto=format&fit=crop&q=80',
    tag: 'Spicy',
    isSpicy: true,
    favorite: true
  },
  {
    id: 'pos-9',
    name: 'Shrimp Pasta',
    price: 58.00,
    description: 'Prawns, creamy sauce, cherry tomatoes',
    category: 'Seafood',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    favorite: true
  },
  {
    id: 'pos-10',
    name: 'Beef Biryani',
    price: 65.00,
    description: 'Aromatic basmati rice with tender beef',
    category: 'Asian Cuisine',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    tag: "Chef's Special",
    isVegetarian: true,
    favorite: true
  },
  {
    id: 'pos-11',
    name: 'Chocolate Lava Cake',
    price: 32.00,
    description: 'Warm chocolate cake with vanilla ice cream',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80',
    favorite: true
  },
  {
    id: 'pos-12',
    name: 'Fresh Fruit Platter',
    price: 30.00,
    description: 'Seasonal fresh fruits',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=400&auto=format&fit=crop&q=80',
    tag: 'Vegetarian',
    isVegetarian: true,
    favorite: true
  },
  {
    id: 'pos-13',
    name: 'Fresh Orange Juice',
    price: 12.00,
    description: 'Freshly squeezed Valencia oranges',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80',
    tag: 'Vegetarian',
    isVegetarian: true,
    favorite: true
  },
  {
    id: 'pos-14',
    name: 'Espresso Double',
    price: 16.00,
    description: 'Single origin Colombian dark roast',
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&auto=format&fit=crop&q=80',
    favorite: false
  },
  {
    id: 'pos-15',
    name: 'Eggs Benedict',
    price: 44.00,
    description: 'Poached eggs, hollandaise sauce on English muffin',
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&auto=format&fit=crop&q=80',
    tag: "Chef's Special",
    favorite: false
  },
  {
    id: 'pos-16',
    name: 'Crispy Calamari',
    price: 36.00,
    description: 'Golden fried baby squid with tartar sauce',
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&auto=format&fit=crop&q=80',
    favorite: false
  }
];

export interface PosOrderItem {
  id: string;
  menuItem: PosMenuItem;
  quantity: number;
  note?: string;
  customPrice?: number;
}
