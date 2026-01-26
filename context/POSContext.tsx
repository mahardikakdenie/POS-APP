import { PRODUCTS } from '@/constants/menuData';
import { CartItem, Order, OrderStatus, Product } from '@/constants/types/pos';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';

interface POSContextType {
	state: {
		isSessionActive: boolean;
		cashierName: string;
		orderId: string;
		selectedCat: string;
		searchQuery: string;
		orderType: string;
		cart: CartItem[];
		orders: Order[];
		filteredProducts: Product[];
		summary: { subTotal: number; tax: number; total: number };
	};
	actions: {
		setCashierName: (name: string) => void;
		startSession: () => void;
		setSelectedCat: (cat: string) => void;
		setSearchQuery: (query: string) => void;
		setOrderType: (type: string) => void;
		addToCart: (product: Product) => void;
		updateQty: (id: string, delta: number) => void;
		placeOrder: () => void;
		updateOrderStatus: (orderId: string, status: OrderStatus) => void;
	};
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: React.ReactNode }) => {
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [cashierName, setCashierName] = useState('');
	const [orderId, setOrderId] = useState('');
	const [selectedCat, setSelectedCat] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');
	const [orderType, setOrderType] = useState('Dine In');
	const [cart, setCart] = useState<CartItem[]>([]);
	const [orders, setOrders] = useState<Order[]>([]);

	const startSession = () => {
		if (!cashierName.trim()) {
			Alert.alert('Required', 'Enter cashier name');
			return;
		}
		setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
		setIsSessionActive(true);
	};

	const addToCart = (product: Product) => {
		setCart((prev) => {
			const exists = prev.find((item) => item.id === product.id);
			if (exists) {
				return prev.map((item) =>
					item.id === product.id
						? { ...item, qty: item.qty + 1 }
						: item,
				);
			}
			return [...prev, { ...product, qty: 1 }];
		});
	};

	const updateQty = (id: string, delta: number) => {
		setCart((prev) => {
			return prev
				.map((item) => {
					if (item.id === id) {
						return { ...item, qty: item.qty + delta };
					}
					return item;
				})
				.filter((item) => item.qty > 0);
		});
	};

	const placeOrder = () => {
		if (cart.length === 0) {
			Alert.alert('Error', 'Cart is empty');
			return;
		}
		const newOrder: Order = {
			id: orderId,
			date: new Date(),
			cashier: cashierName,
			type: orderType,
			items: [...cart],
			subTotal: summary.subTotal,
			tax: summary.tax,
			total: summary.total,
			status: 'Pending', // Status awal
		};
		setOrders((prev) => [newOrder, ...prev]);
		setCart([]);
		setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
		Alert.alert('Success', 'Order sent to kitchen!');
	};

	const updateOrderStatus = (id: string, status: OrderStatus) => {
		setOrders((prev) =>
			prev.map((order) =>
				order.id === id ? { ...order, status } : order,
			),
		);
	};

	const filteredProducts = useMemo(() => {
		return PRODUCTS.filter((p) => {
			const matchesCat = selectedCat === 'all' || p.cat === selectedCat;
			const matchesSearch = p.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			return matchesCat && matchesSearch;
		});
	}, [selectedCat, searchQuery]);

	const summary = useMemo(() => {
		const subTotal = cart.reduce(
			(sum, item) => sum + item.price * item.qty,
			0,
		);
		const tax = subTotal * 0.1;
		const total = subTotal + tax;
		return { subTotal, tax, total };
	}, [cart]);

	const value = {
		state: {
			isSessionActive,
			cashierName,
			orderId,
			selectedCat,
			searchQuery,
			orderType,
			cart,
			orders,
			filteredProducts,
			summary,
		},
		actions: {
			setCashierName,
			startSession,
			setSelectedCat,
			setSearchQuery,
			setOrderType,
			addToCart,
			updateQty,
			placeOrder,
			updateOrderStatus,
		},
	};

	return <POSContext.Provider value={value}>{children}</POSContext.Provider>;
};

export const usePOS = () => {
	const context = useContext(POSContext);
	if (!context) throw new Error('usePOS must be used within a POSProvider');
	return context;
};
