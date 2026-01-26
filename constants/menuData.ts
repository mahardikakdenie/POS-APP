import { Category, Product } from "./types/pos";

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'All Menu', icon: 'fast-food' },
  { id: 'coffee', label: 'Coffee', icon: 'cafe' },
  { id: 'bakery', label: 'Bakery', icon: 'nutrition' },
  { id: 'main', label: 'Main Course', icon: 'restaurant' },
  { id: 'dessert', label: 'Dessert', icon: 'ice-cream' },
  { id: 'drinks', label: 'Cold Drinks', icon: 'wine' },
];

export const PRODUCTS: Product[] = [
  // --- COFFEE ---
  { 
    id: '1', 
    name: 'Caramel Macchiato', 
    price: 4.5, 
    cat: 'coffee', 
    img: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '2', 
    name: 'Hot Cappuccino', 
    price: 3.8, 
    cat: 'coffee', 
    img: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '3', 
    name: 'Iced Americano', 
    price: 3.2, 
    cat: 'coffee', 
    img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '4', 
    name: 'Espresso Double', 
    price: 2.5, 
    cat: 'coffee', 
    img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80' 
  },

  // --- BAKERY ---
  { 
    id: '5', 
    name: 'Butter Croissant', 
    price: 3.0, 
    cat: 'bakery', 
    img: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '6', 
    name: 'Choco Muffin', 
    price: 3.5, 
    cat: 'bakery', 
    img: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '7', 
    name: 'Bagel & Cream', 
    price: 4.0, 
    cat: 'bakery', 
    img: 'https://images.unsplash.com/photo-1585478259715-876a6a81bc08?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '8', 
    name: 'Sourdough Toast', 
    price: 5.5, 
    cat: 'bakery', 
    img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80' 
  },

  // --- MAIN COURSE ---
  { 
    id: '9', 
    name: 'Beef Burger', 
    price: 8.9, 
    cat: 'main', 
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '10', 
    name: 'Spaghetti Carbonara', 
    price: 9.5, 
    cat: 'main', 
    img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '11', 
    name: 'Caesar Salad', 
    price: 7.2, 
    cat: 'main', 
    img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '12', 
    name: 'Grilled Salmon', 
    price: 12.0, 
    cat: 'main', 
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '13', 
    name: 'Club Sandwich', 
    price: 6.5, 
    cat: 'main', 
    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80' 
  },

  // --- DESSERT ---
  { 
    id: '14', 
    name: 'Berry Cheesecake', 
    price: 5.0, 
    cat: 'dessert', 
    img: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '15', 
    name: 'Classic Tiramisu', 
    price: 5.5, 
    cat: 'dessert', 
    img: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '16', 
    name: 'Fudgy Brownie', 
    price: 4.0, 
    cat: 'dessert', 
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '17', 
    name: 'Vanilla Ice Cream', 
    price: 3.5, 
    cat: 'dessert', 
    img: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=400&q=80' 
  },

  // --- DRINKS ---
  { 
    id: '18', 
    name: 'Fresh Lemonade', 
    price: 3.0, 
    cat: 'drinks', 
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '19', 
    name: 'Iced Lemon Tea', 
    price: 2.5, 
    cat: 'drinks', 
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' 
  },
  { 
    id: '20', 
    name: 'Orange Juice', 
    price: 4.0, 
    cat: 'drinks', 
    img: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80' 
  },
];
