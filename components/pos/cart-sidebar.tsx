import { ThemedText } from '@/components/themed-text';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import {
	Platform,
	ScrollView,
	StyleSheet,
	Switch,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';

interface CartSidebarProps {
	onClose?: () => void;
}

export const CartSidebar = ({ onClose }: CartSidebarProps) => {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;
	const { state, actions } = usePOS();
	const { orderId, cart, orderType, customerName, tableNo, useBag, summary } =
		state;

	return (
		<View style={[styles.container, isMobile && styles.containerMobile]}>
			<View style={styles.headerSection}>
				<View style={styles.headerRow}>
					<View>
						<ThemedText style={styles.title}>
							Order #{orderId}
						</ThemedText>
						<ThemedText style={styles.subtitle}>
							{cart.length} items selected
						</ThemedText>
					</View>
					{isMobile ? (
						<TouchableOpacity
							onPress={onClose}
							style={styles.closeBtn}>
							<Ionicons name='close' size={24} color='#1e293b' />
						</TouchableOpacity>
					) : (
						<TouchableOpacity style={styles.moreBtn}>
							<Ionicons
								name='ellipsis-horizontal'
								size={20}
								color='#64748b'
							/>
						</TouchableOpacity>
					)}
				</View>

				<View style={styles.typeContainer}>
					{['Dine In', 'To Go', 'Delivery'].map((type) => (
						<TouchableOpacity
							key={type}
							activeOpacity={0.8}
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

				<View style={styles.formContainer}>
					<View style={styles.inputWrapper}>
						<Ionicons
							name='person-outline'
							size={18}
							color='#94a3b8'
							style={styles.inputIcon}
						/>
						<TextInput
							style={styles.textInput}
							placeholder='Customer Name'
							value={customerName}
							onChangeText={actions.setCustomerName}
							placeholderTextColor='#94a3b8'
						/>
					</View>

					{orderType === 'Dine In' && (
						<View style={[styles.inputWrapper, { marginTop: 12 }]}>
							<Ionicons
								name='grid-outline'
								size={18}
								color='#94a3b8'
								style={styles.inputIcon}
							/>
							<TextInput
								style={styles.textInput}
								placeholder='Table No.'
								keyboardType='numeric'
								value={tableNo}
								onChangeText={actions.setTableNo}
								placeholderTextColor='#94a3b8'
							/>
						</View>
					)}

					{orderType !== 'Dine In' && (
						<View style={styles.bagRow}>
							<View style={styles.bagInfo}>
								<View style={styles.bagIconBox}>
									<Ionicons
										name='bag-handle'
										size={16}
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

			<ScrollView
				style={styles.listContainer}
				showsVerticalScrollIndicator={false}>
				{cart.length === 0 ? (
					<View style={styles.empty}>
						<Image
							source={require('@/assets/images/icon.png')}
							style={{
								width: 60,
								height: 60,
								opacity: 0.2,
								marginBottom: 16,
							}}
						/>
						<ThemedText style={styles.emptyTitle}>
							Cart is Empty
						</ThemedText>
						<ThemedText style={styles.emptyText}>
							Select products to start order
						</ThemedText>
					</View>
				) : (
					cart.map((item) => (
						<View key={item.id} style={styles.itemRow}>
							<Image
								source={{ uri: item.img }}
								style={styles.itemImg}
								contentFit='cover'
							/>
							<View style={styles.itemInfo}>
								<ThemedText
									style={styles.itemName}
									numberOfLines={1}>
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
										size={14}
										color='#1e293b'
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
										size={14}
										color='#1e293b'
									/>
								</TouchableOpacity>
							</View>
						</View>
					))
				)}
			</ScrollView>

			<View style={styles.footer}>
				<View style={styles.summaryContainer}>
					<Row
						label='Subtotal'
						value={`$${summary.subTotal.toFixed(2)}`}
					/>
					<Row
						label='Tax (10%)'
						value={`$${summary.tax.toFixed(2)}`}
					/>
					{summary.bag > 0 && (
						<Row
							label='Packaging'
							value={`$${summary.bag.toFixed(2)}`}
						/>
					)}
				</View>
				<View style={styles.divider} />
				<View style={styles.totalRow}>
					<ThemedText style={styles.totalLabel}>
						Total Amount
					</ThemedText>
					<ThemedText style={styles.totalValue}>
						${summary.total.toFixed(2)}
					</ThemedText>
				</View>

				<TouchableOpacity
					style={styles.payBtn}
					activeOpacity={0.9}
					onPress={actions.placeOrder}>
					<ThemedText style={styles.payText}>
						Proceed to Payment
					</ThemedText>
					<View style={styles.payIcon}>
						<Ionicons
							name='arrow-forward'
							size={18}
							color='#3b82f6'
						/>
					</View>
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
		width: 400,
		backgroundColor: '#fff',
		borderLeftWidth: 1,
		borderLeftColor: '#f1f5f9',
		height: '100%',
		display: 'flex',
	},
	containerMobile: {
		width: '100%',
		borderLeftWidth: 0,
	},
	headerSection: {
		padding: 24,
		paddingBottom: 16,
		backgroundColor: '#fff',
		zIndex: 10,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: '800',
		color: '#1e293b',
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 14,
		color: '#64748b',
		fontWeight: '500',
		marginTop: 2,
	},
	closeBtn: { padding: 8, backgroundColor: '#f8fafc', borderRadius: 12 },
	moreBtn: { padding: 8 },

	typeContainer: {
		flexDirection: 'row',
		backgroundColor: '#f8fafc',
		padding: 4,
		borderRadius: 14,
		marginBottom: 20,
	},
	typeBtn: {
		flex: 1,
		paddingVertical: 10,
		alignItems: 'center',
		borderRadius: 10,
	},
	typeBtnActive: {
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 2,
	},
	typeText: { fontSize: 13, fontWeight: '600', color: '#94a3b8' },
	typeTextActive: { color: '#1e293b' },

	formContainer: {},
	inputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		paddingHorizontal: 14,
		height: 48,
	},
	inputIcon: { marginRight: 10 },
	textInput: {
		flex: 1,
		height: '100%',
		fontSize: 14,
		fontWeight: '500',
		color: '#1e293b',
	},

	bagRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 16,
		padding: 12,
		backgroundColor: '#fff7ed',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#ffedd5',
	},
	bagInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
	bagIconBox: {
		width: 36,
		height: 36,
		backgroundColor: '#fff',
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	bagLabel: { fontSize: 14, fontWeight: '700', color: '#7c2d12' },
	bagPrice: { fontSize: 12, color: '#ea580c', fontWeight: '600' },

	listContainer: { flex: 1, paddingHorizontal: 24 },
	empty: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: 300,
	},
	emptyTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 4,
	},
	emptyText: { color: '#94a3b8', fontSize: 14 },

	itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
	itemImg: {
		width: 56,
		height: 56,
		borderRadius: 12,
		marginRight: 14,
		backgroundColor: '#f1f5f9',
	},
	itemInfo: { flex: 1, marginRight: 8 },
	itemName: {
		fontSize: 15,
		fontWeight: '600',
		color: '#1e293b',
		marginBottom: 4,
	},
	itemPrice: { fontSize: 14, color: '#64748b', fontWeight: '500' },

	qtyContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 8,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		padding: 3,
	},
	qtyBtn: {
		width: 28,
		height: 28,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f8fafc',
		borderRadius: 6,
	},
	qtyText: {
		marginHorizontal: 10,
		fontSize: 14,
		fontWeight: '700',
		color: '#1e293b',
	},

	footer: {
		padding: 24,
		paddingTop: 20,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
		paddingBottom: Platform.OS === 'ios' ? 34 : 24,
	},
	summaryContainer: { gap: 10, marginBottom: 16 },
	row: { flexDirection: 'row', justifyContent: 'space-between' },
	label: { color: '#64748b', fontSize: 14, fontWeight: '500' },
	value: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
	divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 16 },
	totalRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	totalLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
	totalValue: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
	payBtn: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#1e293b',
		padding: 4,
		paddingLeft: 20,
		borderRadius: 16,
		alignItems: 'center',
		height: 56,
		shadowColor: '#1e293b',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.2,
		shadowRadius: 12,
		elevation: 8,
	},
	payText: { color: '#fff', fontSize: 16, fontWeight: '700' },
	payIcon: {
		backgroundColor: '#fff',
		width: 48,
		height: 48,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
