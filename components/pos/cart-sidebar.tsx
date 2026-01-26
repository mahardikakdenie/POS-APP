import { ThemedText } from '@/components/themed-text';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const CartSidebar = () => {
	const { state, actions } = usePOS();
	const { orderId, cart, orderType, customerName, tableNo, useBag, summary } =
		state;

	return (
		<View style={styles.container}>
			{/* Header: Order ID & Type */}
			<View>
				<View style={styles.header}>
					<ThemedText style={styles.title}>
						Order #{orderId}
					</ThemedText>
					<View style={styles.editIcon}>
						<Ionicons
							name='create-outline'
							size={16}
							color='#3b82f6'
						/>
					</View>
				</View>

				<View style={styles.typeContainer}>
					{['Dine In', 'To Go', 'Delivery'].map((type) => (
						<TouchableOpacity
							key={type}
							style={[
								styles.typeBtn,
								orderType === type && styles.typeBtnActive,
							]}
							onPress={() => actions.setOrderType(type)}>
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

				{/* --- INPUT FORM SECTION --- */}
				<View style={styles.formContainer}>
					{/* Customer Name (Always Visible) */}
					<View style={styles.inputGroup}>
						<Ionicons
							name='person-outline'
							size={20}
							color='#94a3b8'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							placeholder='Customer Name'
							value={customerName}
							onChangeText={actions.setCustomerName}
						/>
					</View>

					{/* Table Number (Only for Dine In) */}
					{orderType === 'Dine In' && (
						<View style={[styles.inputGroup, { marginTop: 10 }]}>
							<Ionicons
								name='grid-outline'
								size={20}
								color='#94a3b8'
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								placeholder='Table Number'
								keyboardType='numeric'
								value={tableNo}
								onChangeText={actions.setTableNo}
							/>
						</View>
					)}

					{/* Shopping Bag (Only for To Go / Delivery) */}
					{orderType !== 'Dine In' && (
						<View style={styles.bagRow}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 8,
								}}>
								<View style={styles.bagIconBox}>
									<Ionicons
										name='bag-handle-outline'
										size={18}
										color='#F97316'
									/>
								</View>
								<View>
									<ThemedText style={styles.bagLabel}>
										Eco Bag
									</ThemedText>
									<ThemedText style={styles.bagPrice}>
										+$0.50
									</ThemedText>
								</View>
							</View>
							<Switch
								value={useBag}
								onValueChange={actions.setUseBag}
								trackColor={{
									false: '#e2e8f0',
									true: '#F97316',
								}}
								thumbColor={'#fff'}
							/>
						</View>
					)}
				</View>
			</View>

			{/* Cart List */}
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
									onPress={() =>
										actions.updateQty(item.id, -1)
									}
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
									onPress={() =>
										actions.updateQty(item.id, 1)
									}
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

			{/* Footer */}
			<View style={styles.footer}>
				<Row
					label='Subtotal'
					value={`$${summary.subTotal.toFixed(2)}`}
				/>
				<Row label='Tax (10%)' value={`$${summary.tax.toFixed(2)}`} />
				{summary.bag > 0 && (
					<Row
						label='Packaging'
						value={`$${summary.bag.toFixed(2)}`}
					/>
				)}
				<View style={styles.divider} />
				<View style={styles.totalRow}>
					<ThemedText style={styles.totalLabel}>Total</ThemedText>
					<ThemedText style={styles.totalValue}>
						${summary.total.toFixed(2)}
					</ThemedText>
				</View>

				<TouchableOpacity
					style={styles.payBtn}
					onPress={actions.placeOrder}>
					<ThemedText style={styles.payText}>Place Order</ThemedText>
					<Ionicons name='arrow-forward' size={20} color='#fff' />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const Row = ({ label, value }: { label: string; value: string }) => (
	<View style={styles.row}>
		<ThemedText style={styles.label}>{label}</ThemedText>
		<ThemedText style={styles.value}>{value}</ThemedText>
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
		alignItems: 'center',
		marginBottom: 20,
	},
	title: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
	editIcon: { padding: 4, backgroundColor: '#eff6ff', borderRadius: 8 },

	typeContainer: {
		flexDirection: 'row',
		backgroundColor: '#f1f5f9',
		padding: 4,
		borderRadius: 12,
		marginBottom: 16,
	},
	typeBtn: {
		flex: 1,
		paddingVertical: 8,
		alignItems: 'center',
		borderRadius: 10,
	},
	typeBtnActive: {
		backgroundColor: '#fff',
		elevation: 1,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 2,
	},
	typeText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
	typeTextActive: { color: '#1e293b' },

	// Form Styles
	formContainer: {
		marginBottom: 20,
		padding: 16,
		backgroundColor: '#F8FAFC',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#F1F5F9',
	},
	inputGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 12,
	},
	inputIcon: { marginRight: 8 },
	textInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: '#1e293b' },

	bagRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		paddingVertical: 4,
	},
	bagIconBox: {
		width: 32,
		height: 32,
		backgroundColor: '#FFF7ED',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bagLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
	bagPrice: { fontSize: 12, color: '#F97316', fontWeight: '600' },

	// List Styles
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		opacity: 0.5,
	},
	emptyText: { marginTop: 12, color: '#94a3b8' },
	itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
	itemImg: {
		width: 48,
		height: 48,
		borderRadius: 10,
		marginRight: 12,
		backgroundColor: '#f1f5f9',
	},
	itemName: { fontSize: 14, fontWeight: '600', color: '#1e293b', width: 120 },
	itemPrice: { fontSize: 13, color: '#64748b', marginTop: 2 },
	qtyContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 8,
		padding: 4,
		marginLeft: 'auto',
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
		marginHorizontal: 10,
		fontSize: 14,
		fontWeight: '600',
		color: '#1e293b',
	},

	// Footer
	footer: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 20 },
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	label: { color: '#64748b', fontSize: 14 },
	value: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
	divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	totalLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
	totalValue: { fontSize: 24, fontWeight: '800', color: '#3b82f6' },
	payBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#3b82f6',
		paddingVertical: 16,
		borderRadius: 14,
		alignItems: 'center',
		shadowColor: '#3b82f6',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
	},
	payText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
