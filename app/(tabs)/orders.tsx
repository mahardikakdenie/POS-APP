import { ThemedText } from '@/components/themed-text';
import { Order, OrderStatus } from '@/constants/types/pos';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';

const getStatusTheme = (status: OrderStatus) => {
	switch (status) {
		case 'Pending':
			return {
				bg: '#fff7ed',
				border: '#f97316',
				text: '#c2410c',
				icon: 'time-outline',
				label: 'New Order',
				btnBg: '#f97316',
				btnText: '#ffffff',
				actionLabel: 'Start Cooking',
			};
		case 'Preparing':
			return {
				bg: '#eff6ff',
				border: '#3b82f6',
				text: '#1d4ed8',
				icon: 'flame-outline',
				label: 'Cooking',
				btnBg: '#3b82f6',
				btnText: '#ffffff',
				actionLabel: 'Mark Ready',
			};
		case 'Ready':
			return {
				bg: '#f0fdf4',
				border: '#22c55e',
				text: '#15803d',
				icon: 'restaurant-outline',
				label: 'Ready to Serve',
				btnBg: '#22c55e',
				btnText: '#ffffff',
				actionLabel: 'Complete Order',
			};
		case 'Completed':
			return {
				bg: '#f8fafc',
				border: '#94a3b8',
				text: '#475569',
				icon: 'checkmark-done-outline',
				label: 'Completed',
				btnBg: '#e2e8f0',
				btnText: '#475569',
				actionLabel: 'Archived',
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

	const handleAction = (order: Order) => {
		if (order.status === 'Pending')
			actions.updateOrderStatus(order.id, 'Preparing');
		else if (order.status === 'Preparing')
			actions.updateOrderStatus(order.id, 'Ready');
		else if (order.status === 'Ready')
			actions.updateOrderStatus(order.id, 'Completed');
	};

	const renderTicket = ({ item }: { item: Order }) => {
		const theme = getStatusTheme(item.status);

		return (
			<View
				style={[
					styles.ticketContainer,
					{ borderTopColor: theme.border },
				]}>
				<View style={styles.ticketHeader}>
					<View style={styles.ticketIdRow}>
						<ThemedText style={styles.ticketId}>
							#{item.id}
						</ThemedText>
						<View
							style={[
								styles.statusBadge,
								{ backgroundColor: theme.bg },
							]}>
							<Ionicons
								name={theme.icon as any}
								size={14}
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

					<View style={styles.customerRow}>
						<View style={styles.customerInfo}>
							<Ionicons name='person' size={16} color='#64748b' />
							<ThemedText
								style={styles.customerName}
								numberOfLines={1}>
								{item.customerName || 'Guest'}
							</ThemedText>
						</View>
						<View
							style={[
								styles.typeTag,
								item.type === 'Dine In'
									? styles.tagDineIn
									: styles.tagToGo,
							]}>
							<ThemedText
								style={[
									styles.typeText,
									item.type === 'Dine In'
										? styles.textDineIn
										: styles.textToGo,
								]}>
								{item.type}{' '}
								{item.tableNo ? `- T${item.tableNo}` : ''}
							</ThemedText>
						</View>
					</View>
					<ThemedText style={styles.timeText}>
						{new Date(item.date).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</ThemedText>
				</View>

				<View style={styles.divider} />

				<ScrollView style={styles.itemList} nestedScrollEnabled>
					{item.items.map((prod, idx) => (
						<View key={idx} style={styles.itemRow}>
							<View style={styles.qtyBox}>
								<ThemedText style={styles.qtyText}>
									{prod.qty}
								</ThemedText>
							</View>
							<ThemedText style={styles.itemName}>
								{prod.name}
							</ThemedText>
						</View>
					))}
				</ScrollView>

				{item.status !== 'Completed' ? (
					<TouchableOpacity
						style={[
							styles.actionBtn,
							{ backgroundColor: theme.btnBg },
						]}
						onPress={() => handleAction(item)}
						activeOpacity={0.9}>
						<ThemedText
							style={[
								styles.actionBtnText,
								{ color: theme.btnText },
							]}>
							{theme.actionLabel}
						</ThemedText>
						<Ionicons
							name='arrow-forward'
							size={18}
							color={theme.btnText}
						/>
					</TouchableOpacity>
				) : (
					<View style={styles.completedFooter}>
						<Ionicons
							name='checkmark-circle'
							size={20}
							color='#10b981'
						/>
						<ThemedText style={styles.completedText}>
							Order Completed
						</ThemedText>
					</View>
				)}
			</View>
		);
	};

	return (
		<View style={styles.screen}>
			<View style={styles.header}>
				<View>
					<ThemedText style={styles.pageTitle}>
						Kitchen Display System
					</ThemedText>
					<ThemedText style={styles.pageSubtitle}>
						Manage and track incoming orders
					</ThemedText>
				</View>
				<View style={styles.tabs}>
					<TouchableOpacity
						style={[
							styles.tabBtn,
							activeTab === 'Active' && styles.tabActive,
						]}
						onPress={() => setActiveTab('Active')}>
						<ThemedText
							style={[
								styles.tabText,
								activeTab === 'Active' && styles.tabTextActive,
							]}>
							Active
						</ThemedText>
						{state.orders.filter((o) => o.status !== 'Completed')
							.length > 0 && (
							<View style={styles.badge}>
								<ThemedText style={styles.badgeText}>
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
							styles.tabBtn,
							activeTab === 'History' && styles.tabActive,
						]}
						onPress={() => setActiveTab('History')}>
						<ThemedText
							style={[
								styles.tabText,
								activeTab === 'History' && styles.tabTextActive,
							]}>
							History
						</ThemedText>
					</TouchableOpacity>
				</View>
			</View>

			<FlatList
				data={filteredOrders}
				keyExtractor={(item) => item.id}
				renderItem={renderTicket}
				numColumns={3}
				contentContainerStyle={styles.gridContent}
				columnWrapperStyle={styles.gridGap}
				showsVerticalScrollIndicator={false}
				ListEmptyComponent={
					<View style={styles.emptyState}>
						<Ionicons
							name='restaurant-outline'
							size={64}
							color='#cbd5e1'
						/>
						<ThemedText style={styles.emptyTitle}>
							All caught up!
						</ThemedText>
						<ThemedText style={styles.emptySub}>
							No {activeTab.toLowerCase()} orders at the moment.
						</ThemedText>
					</View>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	screen: { flex: 1, backgroundColor: '#f1f5f9', padding: 24 },

	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	pageTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
	pageSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },

	tabs: {
		flexDirection: 'row',
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 4,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	tabBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		gap: 8,
	},
	tabActive: { backgroundColor: '#0f172a' },
	tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
	tabTextActive: { color: '#fff' },
	badge: {
		backgroundColor: '#ef4444',
		paddingHorizontal: 6,
		borderRadius: 10,
		minWidth: 20,
		alignItems: 'center',
	},
	badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

	gridContent: { paddingBottom: 40 },
	gridGap: { gap: 20 },

	ticketContainer: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 16,
		borderTopWidth: 6,
		padding: 16,
		shadowColor: '#0f172a',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 12,
		elevation: 3,
		marginBottom: 20,
		minHeight: 320,
	},
	ticketHeader: { marginBottom: 12 },
	ticketIdRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	ticketId: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
	statusBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 6,
		gap: 4,
	},
	statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },

	customerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 4,
	},
	customerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		flex: 1,
	},
	customerName: { fontSize: 15, fontWeight: '600', color: '#334155' },

	typeTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
	tagDineIn: { backgroundColor: '#dbeafe' },
	tagToGo: { backgroundColor: '#ffedd5' },
	typeText: { fontSize: 12, fontWeight: '700' },
	textDineIn: { color: '#1e40af' },
	textToGo: { color: '#9a3412' },

	timeText: { fontSize: 12, color: '#94a3b8', marginTop: 4 },

	divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },

	itemList: { flex: 1, marginBottom: 16 },
	itemRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	qtyBox: {
		width: 32,
		height: 32,
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	qtyText: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
	itemName: {
		fontSize: 16,
		color: '#334155',
		fontWeight: '500',
		flex: 1,
		lineHeight: 22,
	},

	actionBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 14,
		borderRadius: 12,
		gap: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	actionBtnText: { fontSize: 14, fontWeight: '700' },

	completedFooter: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		gap: 8,
		backgroundColor: '#f0fdf4',
		borderRadius: 12,
	},
	completedText: { color: '#15803d', fontWeight: '600' },

	emptyState: { alignItems: 'center', marginTop: 100, opacity: 0.6 },
	emptyTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#0f172a',
		marginTop: 16,
	},
	emptySub: { fontSize: 15, color: '#64748b', marginTop: 4 },
});
