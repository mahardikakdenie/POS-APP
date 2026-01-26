import { ThemedText } from '@/components/themed-text';
import { Order, OrderStatus } from '@/constants/types/pos';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

const getStatusTheme = (status: OrderStatus) => {
	switch (status) {
		case 'Pending':
			return {
				bg: '#FFF7ED',
				text: '#C2410C',
				indicator: '#F97316',
				icon: 'time',
				label: 'In Queue',
				btnBg: '#F97316',
				btnText: '#FFF',
				action: 'Start Cook',
			};
		case 'Preparing':
			return {
				bg: '#EFF6FF',
				text: '#1D4ED8',
				indicator: '#3B82F6',
				icon: 'flame',
				label: 'Cooking',
				btnBg: '#3B82F6',
				btnText: '#FFF',
				action: 'Mark Ready',
			};
		case 'Ready':
			return {
				bg: '#ECFDF5',
				text: '#047857',
				indicator: '#10B981',
				icon: 'checkmark-circle',
				label: 'Ready',
				btnBg: '#10B981',
				btnText: '#FFF',
				action: 'Serve',
			};
		case 'Completed':
			return {
				bg: '#F1F5F9',
				text: '#475569',
				indicator: '#64748B',
				icon: 'file-tray-full',
				label: 'Done',
				btnBg: '#E2E8F0',
				btnText: '#475569',
				action: 'Archived',
			};
	}
};

export default function OrdersScreen() {
	const { state, actions } = usePOS();
	const [activeTab, setActiveTab] = useState<'Active' | 'History'>('Active');

	const filteredOrders = state.orders.filter((order) =>
		activeTab === 'Active'
			? order.status !== 'Completed'
			: order.status === 'Completed',
	);

	const handleAction = (item: Order) => {
		if (item.status === 'Pending')
			actions.updateOrderStatus(item.id, 'Preparing');
		else if (item.status === 'Preparing')
			actions.updateOrderStatus(item.id, 'Ready');
		else if (item.status === 'Ready')
			actions.updateOrderStatus(item.id, 'Completed');
	};

	const renderCard = ({ item }: { item: Order }) => {
		const theme = getStatusTheme(item.status);

		return (
			<View style={styles.cardContainer}>
				<View style={styles.cardTop}>
					<View style={styles.cardHeaderRow}>
						<View style={styles.idBadge}>
							<ThemedText style={styles.hash}>#</ThemedText>
							<ThemedText style={styles.idText}>
								{item.id}
							</ThemedText>
						</View>
						<View
							style={[
								styles.statusPill,
								{ backgroundColor: theme.bg },
							]}>
							<Ionicons
								name={theme.icon as any}
								size={12}
								color={theme.text}
							/>
							<ThemedText
								style={[
									styles.statusText,
									{ color: theme.text },
								]}>
								{theme.label}
							</ThemedText>
						</View>
					</View>

					<View style={styles.metaRow}>
						<View style={styles.metaItem}>
							<Ionicons
								name='calendar-outline'
								size={14}
								color='#94A3B8'
							/>
							<ThemedText style={styles.metaValue}>
								{item.date.toLocaleTimeString([], {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</ThemedText>
						</View>
						<View style={styles.metaDivider} />
						<View style={styles.metaItem}>
							<Ionicons
								name='person-outline'
								size={14}
								color='#94A3B8'
							/>
							<ThemedText style={styles.metaValue}>
								{item.cashier}
							</ThemedText>
						</View>
						<View style={styles.metaDivider} />
						<View style={styles.metaItem}>
							<Ionicons
								name='restaurant-outline'
								size={14}
								color='#94A3B8'
							/>
							<ThemedText style={styles.metaValue}>
								{item.type}
							</ThemedText>
						</View>
					</View>
				</View>

				<View style={styles.cardBody}>
					{item.items.slice(0, 3).map((prod, idx) => (
						<View key={idx} style={styles.itemRow}>
							<View style={styles.qtyBox}>
								<ThemedText style={styles.qtyNum}>
									{prod.qty}
								</ThemedText>
							</View>
							<ThemedText
								style={styles.itemName}
								numberOfLines={1}>
								{prod.name}
							</ThemedText>
						</View>
					))}
					{item.items.length > 3 && (
						<ThemedText style={styles.moreItems}>
							+ {item.items.length - 3} more items...
						</ThemedText>
					)}
				</View>

				<View style={styles.cardFooter}>
					<View>
						<ThemedText style={styles.totalLabel}>Total</ThemedText>
						<ThemedText style={styles.totalValue}>
							${item.total.toFixed(2)}
						</ThemedText>
					</View>

					{item.status !== 'Completed' ? (
						<TouchableOpacity
							style={[
								styles.actionBtn,
								{ backgroundColor: theme.btnBg },
							]}
							onPress={() => handleAction(item)}
							activeOpacity={0.8}>
							<ThemedText
								style={[
									styles.actionBtnText,
									{ color: theme.btnText },
								]}>
								{theme.action}
							</ThemedText>
							<Ionicons
								name='arrow-forward'
								size={16}
								color={theme.btnText}
							/>
						</TouchableOpacity>
					) : (
						<View style={styles.completedBadge}>
							<Ionicons
								name='checkmark-done'
								size={20}
								color='#94A3B8'
							/>
						</View>
					)}
				</View>
			</View>
		);
	};

	return (
		<View style={styles.screen}>
			<View style={styles.headerContainer}>
				<View>
					<ThemedText style={styles.headerTitle}>
						Kitchen Display
					</ThemedText>
					<ThemedText style={styles.headerSubtitle}>
						Real-time order tracking
					</ThemedText>
				</View>
				<View style={styles.toggleContainer}>
					<TouchableOpacity
						style={[
							styles.toggleBtn,
							activeTab === 'Active' && styles.toggleBtnActive,
						]}
						onPress={() => setActiveTab('Active')}>
						<ThemedText
							style={[
								styles.toggleText,
								activeTab === 'Active' &&
									styles.toggleTextActive,
							]}>
							Active
						</ThemedText>
						{state.orders.filter((o) => o.status !== 'Completed')
							.length > 0 && (
							<View style={styles.counterBadge}>
								<ThemedText style={styles.counterText}>
									{
										state.orders.filter(
											(o) => o.status !== 'Completed',
										).length
									}
								</ThemedText>
							</View>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.toggleBtn,
							activeTab === 'History' && styles.toggleBtnActive,
						]}
						onPress={() => setActiveTab('History')}>
						<ThemedText
							style={[
								styles.toggleText,
								activeTab === 'History' &&
									styles.toggleTextActive,
							]}>
							History
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={filteredOrders}
				keyExtractor={(item) => item.id}
				renderItem={renderCard}
				numColumns={2}
				contentContainerStyle={styles.listContent}
				columnWrapperStyle={styles.columnWrapper}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyContainer}>
						<View style={styles.emptyIconBg}>
							<Ionicons
								name='newspaper-outline'
								size={48}
								color='#CBD5E1'
							/>
						</View>
						<ThemedText style={styles.emptyTitle}>
							No Orders Found
						</ThemedText>
						<ThemedText style={styles.emptySub}>
							{activeTab === 'Active'
								? 'All orders have been completed.'
								: 'No order history available.'}
						</ThemedText>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: '#F8FAFC',
		paddingHorizontal: 24,
		paddingTop: 24,
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 32,
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: '800',
		color: '#0F172A',
		letterSpacing: -0.5,
	},
	headerSubtitle: {
		fontSize: 14,
		color: '#64748B',
		marginTop: 4,
		fontWeight: '500',
	},
	toggleContainer: {
		flexDirection: 'row',
		backgroundColor: '#FFFFFF',
		padding: 4,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#E2E8F0',
		shadowColor: '#64748B',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 2,
	},
	toggleBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 12,
		gap: 8,
	},
	toggleBtnActive: {
		backgroundColor: '#0F172A',
	},
	toggleText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#64748B',
	},
	toggleTextActive: {
		color: '#FFFFFF',
	},
	counterBadge: {
		backgroundColor: '#EF4444',
		paddingHorizontal: 6,
		height: 20,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	counterText: {
		fontSize: 11,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	listContent: {
		paddingBottom: 40,
	},
	columnWrapper: {
		gap: 24,
	},
	cardContainer: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: '#F1F5F9',
		shadowColor: '#0F172A',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.04,
		shadowRadius: 16,
		elevation: 3,
		marginBottom: 24,
	},
	cardTop: {
		marginBottom: 20,
	},
	cardHeaderRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 12,
	},
	idBadge: {
		flexDirection: 'row',
		alignItems: 'baseline',
	},
	hash: {
		fontSize: 14,
		color: '#94A3B8',
		fontWeight: '600',
	},
	idText: {
		fontSize: 20,
		fontWeight: '800',
		color: '#0F172A',
		marginLeft: 2,
	},
	statusPill: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 100,
		gap: 6,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '700',
	},
	metaRow: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F8FAFC',
		paddingVertical: 8,
		paddingHorizontal: 12,
		borderRadius: 12,
		alignSelf: 'flex-start',
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	metaValue: {
		fontSize: 12,
		color: '#64748B',
		fontWeight: '600',
	},
	metaDivider: {
		width: 1,
		height: 12,
		backgroundColor: '#CBD5E1',
		marginHorizontal: 10,
	},
	cardBody: {
		backgroundColor: '#FAFAFA',
		borderRadius: 16,
		padding: 16,
		marginBottom: 20,
		borderWidth: 1,
		borderColor: '#F1F5F9',
	},
	itemRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	qtyBox: {
		backgroundColor: '#FFFFFF',
		width: 28,
		height: 28,
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E2E8F0',
		marginRight: 12,
	},
	qtyNum: {
		fontSize: 13,
		fontWeight: '700',
		color: '#0F172A',
	},
	itemName: {
		fontSize: 14,
		color: '#334155',
		fontWeight: '500',
		flex: 1,
	},
	moreItems: {
		fontSize: 12,
		color: '#94A3B8',
		fontWeight: '600',
		marginTop: 4,
		textAlign: 'center',
	},
	cardFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingTop: 4,
	},
	totalLabel: {
		fontSize: 11,
		color: '#94A3B8',
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	totalValue: {
		fontSize: 20,
		fontWeight: '800',
		color: '#0F172A',
		marginTop: 2,
	},
	actionBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 14,
		gap: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4,
	},
	actionBtnText: {
		fontSize: 14,
		fontWeight: '700',
	},
	completedBadge: {
		width: 44,
		height: 44,
		borderRadius: 22,
		backgroundColor: '#F1F5F9',
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: 80,
	},
	emptyIconBg: {
		width: 80,
		height: 80,
		backgroundColor: '#F1F5F9',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	emptyTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#0F172A',
		marginBottom: 8,
	},
	emptySub: {
		fontSize: 15,
		color: '#64748B',
	},
});
