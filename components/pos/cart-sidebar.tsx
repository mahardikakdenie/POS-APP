import { CartItem } from '@/constants/types/pos';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../themed-text';

interface Props {
	orderId: string;
	cart: CartItem[];
	orderType: string;
	setOrderType: (type: string) => void;
	updateQty: (id: string, delta: number) => void;
	summary: { subTotal: number; tax: number; total: number };
	onPlaceOrder: () => void;
}

export const CartSidebar = ({
	orderId,
	cart,
	orderType,
	setOrderType,
	updateQty,
	summary,
	onPlaceOrder,
}: Props) => {
	return (
		<View style={styles.container}>
			{/* Header & Order Type */}
			<View>
				<View style={styles.header}>
					<ThemedText style={styles.title}>
						Order #{orderId}
					</ThemedText>
					<Ionicons name='create-outline' size={20} color='#3b82f6' />
				</View>
				<View style={styles.typeContainer}>
					{['Dine In', 'To Go', 'Delivery'].map((type) => (
						<TouchableOpacity
							key={type}
							style={[
								styles.typeBtn,
								orderType === type && styles.typeBtnActive,
							]}
							onPress={() => setOrderType(type)}>
							<ThemedText
								style={[
									styles.typeText,
									orderType === type && styles.typeTextActive,
								]}>
								{type}
							</ThemedText>
						</TouchableOpacity>
					))}
				</View>
			</View>

			{/* Cart Items List */}
			<ScrollView style={{ flex: 1 }}>
				{cart.length === 0 ? (
					<View style={styles.empty}>
						<Ionicons
							name='cart-outline'
							size={48}
							color='#e2e8f0'
						/>
						<ThemedText style={styles.emptyText}>
							No items selected
						</ThemedText>
					</View>
				) : (
					cart.map((item) => (
						<View key={item.id} style={styles.itemRow}>
							<Image
								source={{ uri: item.img }}
								style={styles.itemImg}
							/>
							<View style={{ flex: 1 }}>
								<ThemedText style={styles.itemName}>
									{item.name}
								</ThemedText>
								<ThemedText style={styles.itemPrice}>
									${(item.price * item.qty).toFixed(2)}
								</ThemedText>
							</View>
							<View style={styles.qtyContainer}>
								<TouchableOpacity
									onPress={() => updateQty(item.id, -1)}
									style={styles.qtyBtn}>
									<Ionicons
										name='remove'
										size={16}
										color='#64748b'
									/>
								</TouchableOpacity>
								<ThemedText style={styles.qtyText}>
									{item.qty}
								</ThemedText>
								<TouchableOpacity
									onPress={() => updateQty(item.id, 1)}
									style={styles.qtyBtn}>
									<Ionicons
										name='add'
										size={16}
										color='#64748b'
									/>
								</TouchableOpacity>
							</View>
						</View>
					))
				)}
			</ScrollView>

			{/* Footer Summary */}
			<View style={styles.footer}>
				<Row
					label='Subtotal'
					value={`$${summary.subTotal.toFixed(2)}`}
				/>
				<Row label='Tax (10%)' value={`$${summary.tax.toFixed(2)}`} />
				<Row
					label='Total'
					value={`$${summary.total.toFixed(2)}`}
					isTotal
				/>
				<TouchableOpacity style={styles.payBtn} onPress={onPlaceOrder}>
					<ThemedText style={styles.payText}>Place Order</ThemedText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

// Helper Component kecil untuk baris summary
const Row = ({
	label,
	value,
	isTotal,
}: {
	label: string;
	value: string;
	isTotal?: boolean;
}) => (
	<View style={[styles.row, isTotal && styles.totalRow]}>
		<ThemedText style={[styles.label, isTotal && styles.totalLabel]}>
			{label}
		</ThemedText>
		<ThemedText style={[styles.value, isTotal && styles.totalLabel]}>
			{value}
		</ThemedText>
	</View>
);

const styles = StyleSheet.create({
	container: {
		width: 380,
		backgroundColor: '#fff',
		borderLeftWidth: 1,
		borderLeftColor: '#f1f5f9',
		padding: 24,
		justifyContent: 'space-between',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20,
	},
	title: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
	typeContainer: {
		flexDirection: 'row',
		backgroundColor: '#f1f5f9',
		padding: 4,
		borderRadius: 12,
		marginBottom: 24,
	},
	typeBtn: {
		flex: 1,
		paddingVertical: 8,
		alignItems: 'center',
		borderRadius: 10,
	},
	typeBtnActive: { backgroundColor: '#fff', elevation: 1 },
	typeText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
	typeTextActive: { color: '#1e293b' },
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0.5,
	},
	emptyText: { marginTop: 12, color: '#94a3b8' },
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f8fafc',
	},
	itemImg: { width: 50, height: 50, borderRadius: 10, marginRight: 12 },
	itemName: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
	itemPrice: { fontSize: 13, color: '#64748b', marginTop: 2 },
	qtyContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		padding: 4,
	},
	qtyBtn: {
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	qtyText: {
		marginHorizontal: 12,
		fontSize: 14,
		fontWeight: '600',
		color: '#1e293b',
	},
	footer: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 20 },
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 10,
	},
	label: { color: '#64748b', fontSize: 14 },
	value: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
	totalRow: {
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#e2e8f0',
	},
	totalLabel: { fontSize: 18, fontWeight: '700', color: '#3b82f6' },
	payBtn: {
		backgroundColor: '#3b82f6',
		paddingVertical: 16,
		borderRadius: 14,
		alignItems: 'center',
		marginTop: 20,
	},
	payText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
