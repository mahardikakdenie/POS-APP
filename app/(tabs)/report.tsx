import { ThemedText } from '@/components/themed-text';
import { Order } from '@/constants/types/pos';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ReportsScreen() {
	const { state } = usePOS();
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

	const reportData = useMemo(() => {
		const todayStr = new Date().toDateString();

		const todaysOrders = state.orders.filter(
			(o) =>
				new Date(o.date).toDateString() === todayStr &&
				o.status === 'Completed',
		);

		const totalRevenue = todaysOrders.reduce((sum, o) => sum + o.total, 0);

		const avgOrderValue =
			todaysOrders.length > 0 ? totalRevenue / todaysOrders.length : 0;

		const productSales: Record<
			string,
			{ name: string; qty: number; total: number }
		> = {};
		todaysOrders.forEach((order) => {
			order.items.forEach((item) => {
				if (!productSales[item.id]) {
					productSales[item.id] = {
						name: item.name,
						qty: 0,
						total: 0,
					};
				}
				productSales[item.id].qty += item.qty;
				productSales[item.id].total += item.price * item.qty;
			});
		});

		const topProducts = Object.values(productSales)
			.sort((a, b) => b.qty - a.qty)
			.slice(0, 5);

		const typeStats: Record<string, number> = {};
		todaysOrders.forEach((o) => {
			typeStats[o.type] = (typeStats[o.type] || 0) + 1;
		});

		return {
			totalRevenue,
			totalOrders: todaysOrders.length,
			avgOrderValue,
			topProducts,
			typeStats,
			orders: todaysOrders,
		};
	}, [state.orders]);

	return (
		<View style={{ flex: 1 }}>
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}>
				<View style={styles.header}>
					<View>
						<ThemedText style={styles.pageTitle}>
							Daily Recap
						</ThemedText>
						<ThemedText style={styles.pageDate}>
							{new Date().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</ThemedText>
					</View>
					<TouchableOpacity style={styles.printBtn}>
						<Ionicons
							name='print-outline'
							size={20}
							color='#3b82f6'
						/>
						<ThemedText style={styles.printText}>
							Print Report
						</ThemedText>
					</TouchableOpacity>
				</View>

				<View style={styles.kpiContainer}>
					<View style={styles.kpiCard}>
						<View
							style={[
								styles.iconBox,
								{ backgroundColor: '#EFF6FF' },
							]}>
							<Ionicons
								name='cash-outline'
								size={22}
								color='#3B82F6'
							/>
						</View>
						<ThemedText style={styles.kpiLabel}>
							Total Revenue
						</ThemedText>
						<ThemedText style={styles.kpiValue}>
							${reportData.totalRevenue.toFixed(2)}
						</ThemedText>
						<View style={styles.trendRow}>
							<Ionicons
								name='trending-up'
								size={14}
								color='#10B981'
							/>
							<ThemedText style={styles.trendText}>
								Today&apos;s Earnings
							</ThemedText>
						</View>
					</View>

					<View style={styles.kpiCard}>
						<View
							style={[
								styles.iconBox,
								{ backgroundColor: '#F0FDF4' },
							]}>
							<Ionicons
								name='receipt-outline'
								size={22}
								color='#10B981'
							/>
						</View>
						<ThemedText style={styles.kpiLabel}>
							Total Orders
						</ThemedText>
						<ThemedText style={styles.kpiValue}>
							{reportData.totalOrders}
						</ThemedText>
						<ThemedText style={styles.kpiSub}>
							Completed transactions
						</ThemedText>
					</View>

					<View style={styles.kpiCard}>
						<View
							style={[
								styles.iconBox,
								{ backgroundColor: '#FFF7ED' },
							]}>
							<Ionicons
								name='pie-chart-outline'
								size={22}
								color='#F97316'
							/>
						</View>
						<ThemedText style={styles.kpiLabel}>
							Avg. Order Value
						</ThemedText>
						<ThemedText style={styles.kpiValue}>
							${reportData.avgOrderValue.toFixed(2)}
						</ThemedText>
						<ThemedText style={styles.kpiSub}>
							Per customer
						</ThemedText>
					</View>
				</View>

				<View style={styles.rowLayout}>
					<View
						style={[
							styles.sectionCard,
							{ flex: 2, marginRight: 20 },
						]}>
						<View style={styles.sectionHeader}>
							<ThemedText style={styles.sectionTitle}>
								Top Selling Items
							</ThemedText>
							<Ionicons
								name='trophy-outline'
								size={18}
								color='#EAB308'
							/>
						</View>

						{reportData.topProducts.length === 0 ? (
							<View style={styles.emptyState}>
								<ThemedText style={styles.emptyText}>
									No sales data available yet.
								</ThemedText>
							</View>
						) : (
							reportData.topProducts.map((prod, index) => (
								<View key={index} style={styles.rankRow}>
									<View style={styles.rankNumber}>
										<ThemedText style={styles.rankText}>
											{index + 1}
										</ThemedText>
									</View>
									<View style={{ flex: 1 }}>
										<ThemedText style={styles.rankName}>
											{prod.name}
										</ThemedText>
										<View style={styles.progressBarBg}>
											<View
												style={[
													styles.progressBarFill,
													{
														width: `${Math.min((prod.qty / reportData.topProducts[0].qty) * 100, 100)}%`,
													},
												]}
											/>
										</View>
									</View>
									<View style={{ alignItems: 'flex-end' }}>
										<ThemedText style={styles.rankQty}>
											{prod.qty} sold
										</ThemedText>
										<ThemedText style={styles.rankTotal}>
											${prod.total.toFixed(2)}
										</ThemedText>
									</View>
								</View>
							))
						)}
					</View>

					<View style={[styles.sectionCard, { flex: 1 }]}>
						<View style={styles.sectionHeader}>
							<ThemedText style={styles.sectionTitle}>
								Sales by Type
							</ThemedText>
						</View>

						<View style={styles.chartContainer}>
							{['Dine In', 'To Go', 'Delivery'].map((type) => {
								const count = reportData.typeStats[type] || 0;
								const percentage =
									reportData.totalOrders > 0
										? Math.round(
												(count /
													reportData.totalOrders) *
													100,
											)
										: 0;

								return (
									<View key={type} style={styles.typeRow}>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
												marginBottom: 6,
											}}>
											<ThemedText
												style={styles.typeLabel}>
												{type}
											</ThemedText>
											<ThemedText
												style={styles.typeValue}>
												{count} ({percentage}%)
											</ThemedText>
										</View>
										<View style={styles.progressBarBg}>
											<View
												style={[
													styles.progressBarFill,
													{
														width: `${percentage}%`,
														backgroundColor:
															type === 'Dine In'
																? '#3B82F6'
																: type ===
																	  'To Go'
																	? '#F97316'
																	: '#10B981',
													},
												]}
											/>
										</View>
									</View>
								);
							})}
						</View>
					</View>
				</View>

				<View
					style={[
						styles.sectionCard,
						{ marginTop: 24, marginBottom: 40 },
					]}>
					<View style={styles.sectionHeader}>
						<ThemedText style={styles.sectionTitle}>
							Recent Transactions
						</ThemedText>
					</View>

					{reportData.orders.length === 0 ? (
						<View style={styles.emptyState}>
							<ThemedText style={styles.emptyText}>
								No completed orders today.
							</ThemedText>
						</View>
					) : (
						<View>
							<View style={styles.tableHeader}>
								<ThemedText style={[styles.th, { flex: 1 }]}>
									Order ID
								</ThemedText>
								<ThemedText style={[styles.th, { flex: 1 }]}>
									Time
								</ThemedText>
								<ThemedText style={[styles.th, { flex: 1 }]}>
									Type
								</ThemedText>
								<ThemedText
									style={[
										styles.th,
										{ width: 80, textAlign: 'right' },
									]}>
									Amount
								</ThemedText>
							</View>
							{reportData.orders
								.slice()
								.reverse()
								.map((order) => (
									<TouchableOpacity
										key={order.id}
										style={styles.tableRow}
										onPress={() => setSelectedOrder(order)}>
										<ThemedText
											style={[
												styles.td,
												{
													flex: 1,
													fontWeight: '700',
													color: '#3B82F6',
												},
											]}>
											#{order.id}
										</ThemedText>
										<ThemedText
											style={[
												styles.td,
												{ flex: 1, color: '#64748B' },
											]}>
											{new Date(
												order.date,
											).toLocaleTimeString([], {
												hour: '2-digit',
												minute: '2-digit',
											})}
										</ThemedText>
										<View style={{ flex: 1 }}>
											<View style={styles.miniBadge}>
												<ThemedText
													style={
														styles.miniBadgeText
													}>
													{order.type}
												</ThemedText>
											</View>
										</View>
										<ThemedText
											style={[
												styles.td,
												{
													width: 80,
													textAlign: 'right',
													fontWeight: '700',
													color: '#10B981',
												},
											]}>
											${order.total.toFixed(2)}
										</ThemedText>
									</TouchableOpacity>
								))}
						</View>
					)}
				</View>
			</ScrollView>

			<Modal
				animationType='fade'
				transparent={true}
				visible={!!selectedOrder}
				onRequestClose={() => setSelectedOrder(null)}>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<View style={styles.modalHeader}>
							<View>
								<ThemedText style={styles.modalTitle}>
									Transaction Details
								</ThemedText>
								<ThemedText style={styles.modalSubtitle}>
									ID: #{selectedOrder?.id}
								</ThemedText>
							</View>
							<TouchableOpacity
								onPress={() => setSelectedOrder(null)}
								style={styles.closeBtn}>
								<Ionicons
									name='close'
									size={24}
									color='#64748B'
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.modalMeta}>
							<View style={styles.metaCol}>
								<ThemedText style={styles.metaLabel}>
									Date & Time
								</ThemedText>
								<ThemedText style={styles.metaValue}>
									{selectedOrder?.date
										? new Date(
												selectedOrder.date,
											).toLocaleString()
										: '-'}
								</ThemedText>
							</View>
							<View style={styles.metaCol}>
								<ThemedText style={styles.metaLabel}>
									Cashier
								</ThemedText>
								<ThemedText style={styles.metaValue}>
									{selectedOrder?.cashier}
								</ThemedText>
							</View>
							<View style={styles.metaCol}>
								<ThemedText style={styles.metaLabel}>
									Type
								</ThemedText>
								<ThemedText style={styles.metaValue}>
									{selectedOrder?.type}
								</ThemedText>
							</View>
						</View>

						<View style={styles.itemsListHeader}>
							<ThemedText
								style={[styles.listHeaderTxt, { flex: 2 }]}>
								Item
							</ThemedText>
							<ThemedText
								style={[
									styles.listHeaderTxt,
									{ width: 50, textAlign: 'center' },
								]}>
								Qty
							</ThemedText>
							<ThemedText
								style={[
									styles.listHeaderTxt,
									{ width: 80, textAlign: 'right' },
								]}>
								Price
							</ThemedText>
						</View>

						<ScrollView style={styles.itemsScroll}>
							{selectedOrder?.items.map((item, idx) => (
								<View key={idx} style={styles.modalItemRow}>
									<ThemedText
										style={styles.itemName}
										numberOfLines={1}>
										{item.name}
									</ThemedText>
									<ThemedText style={styles.itemQty}>
										{item.qty}
									</ThemedText>
									<ThemedText style={styles.itemTotal}>
										${(item.price * item.qty).toFixed(2)}
									</ThemedText>
								</View>
							))}
						</ScrollView>

						<View style={styles.modalFooter}>
							<View style={styles.summaryRow}>
								<ThemedText style={styles.summaryLabel}>
									Subtotal
								</ThemedText>
								<ThemedText style={styles.summaryVal}>
									${selectedOrder?.subTotal.toFixed(2)}
								</ThemedText>
							</View>
							<View style={styles.summaryRow}>
								<ThemedText style={styles.summaryLabel}>
									Tax
								</ThemedText>
								<ThemedText style={styles.summaryVal}>
									${selectedOrder?.tax.toFixed(2)}
								</ThemedText>
							</View>
							<View style={[styles.summaryRow, styles.totalRow]}>
								<ThemedText style={styles.totalLabel}>
									Total
								</ThemedText>
								<ThemedText style={styles.totalVal}>
									${selectedOrder?.total.toFixed(2)}
								</ThemedText>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F8FAFC', padding: 24 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	pageTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A' },
	pageDate: { fontSize: 14, color: '#64748B', marginTop: 4 },
	printBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		backgroundColor: '#EFF6FF',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
	},
	printText: { color: '#3B82F6', fontWeight: '600' },
	kpiContainer: { flexDirection: 'row', gap: 20, marginBottom: 24 },
	kpiCard: {
		flex: 1,
		backgroundColor: '#FFF',
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: '#F1F5F9',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.02,
		shadowRadius: 10,
		elevation: 1,
	},
	iconBox: {
		width: 40,
		height: 40,
		borderRadius: 10,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	kpiLabel: {
		fontSize: 13,
		fontWeight: '600',
		color: '#64748B',
		marginBottom: 4,
	},
	kpiValue: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
	kpiSub: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
	trendRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
		marginTop: 4,
	},
	trendText: { fontSize: 12, color: '#10B981', fontWeight: '600' },
	rowLayout: { flexDirection: 'row' },
	sectionCard: {
		backgroundColor: '#FFF',
		borderRadius: 16,
		padding: 20,
		borderWidth: 1,
		borderColor: '#F1F5F9',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.02,
		shadowRadius: 5,
		elevation: 1,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
	rankRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
	rankNumber: {
		width: 24,
		height: 24,
		backgroundColor: '#F1F5F9',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},
	rankText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
	rankName: {
		fontSize: 14,
		fontWeight: '600',
		color: '#334155',
		marginBottom: 6,
	},
	rankQty: { fontSize: 12, color: '#64748B', fontWeight: '600' },
	rankTotal: { fontSize: 12, color: '#0F172A', fontWeight: '700' },
	progressBarBg: {
		height: 6,
		backgroundColor: '#F1F5F9',
		borderRadius: 3,
		width: '100%',
	},
	progressBarFill: { height: 6, backgroundColor: '#3B82F6', borderRadius: 3 },
	chartContainer: { gap: 20 },
	typeRow: {},
	typeLabel: { fontSize: 13, color: '#334155', fontWeight: '500' },
	typeValue: { fontSize: 13, color: '#64748B', fontWeight: '600' },
	tableHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#F1F5F9',
		paddingBottom: 12,
		marginBottom: 12,
	},
	th: {
		fontSize: 12,
		color: '#94A3B8',
		fontWeight: '600',
		textTransform: 'uppercase',
	},
	tableRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#F8FAFC',
	},
	td: { fontSize: 13, color: '#334155' },
	miniBadge: {
		backgroundColor: '#F1F5F9',
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
		alignSelf: 'flex-start',
	},
	miniBadgeText: { fontSize: 11, color: '#64748B', fontWeight: '600' },
	emptyState: { padding: 20, alignItems: 'center' },
	emptyText: { color: '#94A3B8', fontStyle: 'italic' },

	// Modal Styles
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContainer: {
		width: 500,
		maxHeight: '80%',
		backgroundColor: '#FFF',
		borderRadius: 20,
		padding: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 24,
		elevation: 10,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 24,
	},
	modalTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
	modalSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
	closeBtn: { padding: 4 },
	modalMeta: {
		flexDirection: 'row',
		backgroundColor: '#F8FAFC',
		padding: 16,
		borderRadius: 12,
		marginBottom: 24,
		gap: 40,
	},
	metaCol: {},
	metaLabel: {
		fontSize: 11,
		color: '#94A3B8',
		textTransform: 'uppercase',
		fontWeight: '600',
		marginBottom: 4,
	},
	metaValue: { fontSize: 14, color: '#334155', fontWeight: '600' },
	itemsListHeader: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#E2E8F0',
		paddingBottom: 8,
		marginBottom: 8,
	},
	listHeaderTxt: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
	itemsScroll: { maxHeight: 300, marginBottom: 24 },
	modalItemRow: {
		flexDirection: 'row',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#F8FAFC',
		alignItems: 'center',
	},
	itemName: { flex: 2, fontSize: 14, color: '#334155', fontWeight: '500' },
	itemQty: { width: 50, textAlign: 'center', fontSize: 14, color: '#64748B' },
	itemTotal: {
		width: 80,
		textAlign: 'right',
		fontSize: 14,
		color: '#0F172A',
		fontWeight: '600',
	},
	modalFooter: {
		borderTopWidth: 1,
		borderTopColor: '#E2E8F0',
		paddingTop: 16,
	},
	summaryRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 8,
	},
	summaryLabel: { fontSize: 13, color: '#64748B' },
	summaryVal: { fontSize: 13, color: '#334155', fontWeight: '600' },
	totalRow: {
		marginTop: 8,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: '#F8FAFC',
	},
	totalLabel: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
	totalVal: { fontSize: 20, fontWeight: '800', color: '#3B82F6' },
});
