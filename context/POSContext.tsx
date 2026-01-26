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
		customerName: string; // Baru
		tableNo: string; // Baru
		useBag: boolean; // Baru
		cart: CartItem[];
		orders: Order[];
		filteredProducts: Product[];
		summary: { subTotal: number; tax: number; bag: number; total: number };
	};
	actions: {
		setCashierName: (name: string) => void;
		startSession: () => void;
		setSelectedCat: (cat: string) => void;
		setSearchQuery: (query: string) => void;
		setOrderType: (type: string) => void;
		setCustomerName: (name: string) => void; // Baru
		setTableNo: (num: string) => void; // Baru
		setUseBag: (val: boolean) => void; // Baru
		addToCart: (product: Product) => void;
		updateQty: (id: string, delta: number) => void;
		placeOrder: () => void;
		updateOrderStatus: (orderId: string, status: OrderStatus) => void;
	};
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: React.ReactNode }) => {
	// Session
	const [isSessionActive, setIsSessionActive] = useState(false);
	const [cashierName, setCashierName] = useState('');

	// Filter
	const [selectedCat, setSelectedCat] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	// Transaction Details
	const [orderId, setOrderId] = useState('');
	const [orderType, setOrderType] = useState('Dine In');
	const [customerName, setCustomerName] = useState(''); // State Nama Customer
	const [tableNo, setTableNo] = useState(''); // State Meja
	const [useBag, setUseBag] = useState(false); // State Tas

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

	// Kalkulasi Total (Termasuk Tas)
	const summary = useMemo(() => {
		const subTotal = cart.reduce(
			(sum, item) => sum + item.price * item.qty,
			0,
		);
		const tax = subTotal * 0.1;
		const bag = useBag ? 0.5 : 0; // Harga Tas $0.50
		const total = subTotal + tax + bag;
		return { subTotal, tax, bag, total };
	}, [cart, useBag]);

	const placeOrder = () => {
		if (cart.length === 0) {
			Alert.alert('Error', 'Cart is empty');
			return;
		}
		if (orderType === 'Dine In' && !tableNo) {
			Alert.alert('Required', 'Please enter Table Number for Dine In');
			return;
		}
		if (!customerName.trim()) {
			Alert.alert('Required', 'Please enter Customer Name');
			return;
		}

		const newOrder: Order = {
			id: orderId,
			date: new Date(),
			cashier: cashierName,
			type: orderType,
			customerName: customerName,
			tableNo: orderType === 'Dine In' ? tableNo : undefined,
			items: [...cart],
			subTotal: summary.subTotal,
			tax: summary.tax,
			bagCharge: summary.bag,
			total: summary.total,
			status: 'Pending',
		};

		setOrders((prev) => [newOrder, ...prev]);

		// Reset Form
		setCart([]);
		setCustomerName('');
		setTableNo('');
		setUseBag(false);
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

	const value = {
		state: {
			isSessionActive,
			cashierName,
			orderId,
			selectedCat,
			searchQuery,
			orderType,
			customerName,
			tableNo,
			useBag,
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
			setCustomerName,
			setTableNo,
			setUseBag,
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
