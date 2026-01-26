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

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface Order {
    id: string;
    date: Date;
    cashier: string;
    type: string;
    items: CartItem[];
    subTotal: number;
    tax: number;
    bagCharge: number; // Biaya tas
    total: number;
    status: OrderStatus;
    customerName: string; // Nama Pelanggan
    tableNo?: string;     // Nomor Meja (Opsional)
}
