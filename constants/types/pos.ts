export interface Product {
    id: string;
    name: string;
    price: number;
    cat: string;
    img: string;
    stock?: number;
}

export interface CartItem extends Product {
    qty: number;
}

export interface Category {
    id: string;
    label: string;
    icon: string;
}

// Tambahkan Status Order
export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface Order {
    id: string;
    date: Date;
    cashier: string;
    type: string;
    items: CartItem[];
    subTotal: number;
    tax: number;
    total: number;
    status: OrderStatus; // <--- Baru
}
