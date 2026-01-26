import { PRODUCTS } from '@/constants/menuData';
import { CartItem, Order, Product } from '@/constants/types/pos';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

export const usePOS = () => {
  // Session States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [cashierName, setCashierName] = useState('');
  
  // Transaction States
  const [orderId, setOrderId] = useState('');
  const [orderType, setOrderType] = useState('Dine In');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // <--- STATE UNTUK MENYIMPAN RIWAYAT ORDER

  // Filter States
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // --- COMPUTED VALUES (Summary) ---
  const summary = useMemo(() => {
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subTotal * 0.1;
    const total = subTotal + tax;
    return { subTotal, tax, total };
  }, [cart]);

  // --- ACTIONS ---
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
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
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

  // --- UPDATE: SIMPAN ORDER KE HISTORY ---
  const placeOrder = () => {
    if (cart.length === 0) {
        Alert.alert('Error', 'Cart is empty');
        return;
    }

    // 1. Buat object Order baru
    const newOrder: Order = {
        id: orderId,
        date: new Date(),
        cashier: cashierName,
        type: orderType,
        items: [...cart], // Copy array cart agar tidak ikut terhapus
        subTotal: summary.subTotal,
        tax: summary.tax,
        total: summary.total,
        status: 'Completed',
    };

    // 2. Simpan ke state orders (History)
    setOrders((prev) => [newOrder, ...prev]);

    // 3. Reset Cart dan Generate ID Baru
    setCart([]);
    setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
    
    Alert.alert('Success', 'Order saved successfully!');
    
    // Opsional: Log untuk memastikan data tersimpan
    console.log("Order Saved:", newOrder);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCat = selectedCat === 'all' || p.cat === selectedCat;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCat, searchQuery]);

  return {
    state: { 
        isSessionActive, 
        cashierName, 
        orderId, 
        selectedCat, 
        searchQuery, 
        orderType, 
        cart, 
        orders, // <--- Kembalikan orders agar bisa diakses UI (misal untuk halaman History)
        filteredProducts, 
        summary 
    },
    actions: { 
        setCashierName, 
        startSession, 
        setSelectedCat, 
        setSearchQuery, 
        setOrderType, 
        addToCart, 
        updateQty, 
        placeOrder 
    },
  };
};
