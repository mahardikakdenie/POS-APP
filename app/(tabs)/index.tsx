import { CartSidebar } from '@/components/pos/cart-sidebar';
import { ProductCard } from '@/components/pos/product-card';
import { SessionModal } from '@/components/pos/session-modal';
import { ThemedText } from '@/components/themed-text';
import { CATEGORIES } from '@/constants/menuData';
import { usePOS } from '@/context/POSContext'; // <-- Import dari Context
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
	FlatList,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const formatData = (data: any[], numColumns: number) => {
	const numberOfFullRows = Math.floor(data.length / numColumns);
	let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
	if (numberOfElementsLastRow !== 0) {
		while (numberOfElementsLastRow !== numColumns) {
			data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
			numberOfElementsLastRow++;
		}
	}
	return data;
};

export default function POSScreen() {
	const { state, actions } = usePOS();
	const numColumns = 3;

	if (!state.isSessionActive) {
		return (
			<SessionModal
				cashierName={state.cashierName}
				setCashierName={actions.setCashierName}
				onStart={actions.startSession}
			/>
		);
	}

	return (
		<View style={styles.container}>
			{/* Left Section */}
			<View style={styles.leftSection}>
				<View style={styles.header}>
					<View>
						<ThemedText style={styles.headerTitle}>
							Welcome, {state.cashierName}
						</ThemedText>
						<ThemedText style={styles.headerDate}>
							{new Date().toDateString()}
						</ThemedText>
					</View>
					<View style={styles.searchBar}>
						<Ionicons name='search' size={20} color='#94a3b8' />
						<TextInput
							style={styles.searchInput}
							placeholder='Search menu...'
							value={state.searchQuery}
							onChangeText={actions.setSearchQuery}
						/>
					</View>
				</View>

				<View style={styles.categoriesContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 12 }}>
						{CATEGORIES.map((cat) => (
							<TouchableOpacity
								key={cat.id}
								style={[
									styles.catItem,
									state.selectedCat === cat.id &&
										styles.catItemActive,
								]}
								onPress={() => actions.setSelectedCat(cat.id)}>
								<Ionicons
									name={cat.icon as any}
									size={18}
									color={
										state.selectedCat === cat.id
											? '#fff'
											: '#64748b'
									}
								/>
								<ThemedText
									style={[
										styles.catText,
										state.selectedCat === cat.id &&
											styles.catTextActive,
									]}>
									{cat.label}
								</ThemedText>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				<FlatList
					key={'grid-3'}
					data={formatData([...state.filteredProducts], numColumns)}
					numColumns={numColumns}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingBottom: 20 }}
					columnWrapperStyle={{ gap: 15 }}
					renderItem={({ item }) => {
						if (item.empty)
							return <View style={[styles.itemInvisible]} />;
						return (
							<ProductCard
								item={item}
								onPress={actions.addToCart}
							/>
						);
					}}
				/>
			</View>

			{/* Right Section */}
			<CartSidebar
				orderId={state.orderId}
				cart={state.cart}
				orderType={state.orderType}
				setOrderType={actions.setOrderType}
				updateQty={actions.updateQty}
				summary={state.summary}
				onPlaceOrder={actions.placeOrder}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, flexDirection: 'row', backgroundColor: '#f8fafc' },
	leftSection: { flex: 1, padding: 24 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	headerTitle: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
	headerDate: { fontSize: 14, color: '#64748b', marginTop: 4 },
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		height: 48,
		borderRadius: 12,
		width: 300,
		borderWidth: 1,
		borderColor: '#e2e8f0',
	},
	searchInput: { flex: 1, marginLeft: 12, fontSize: 15 },
	categoriesContainer: { marginBottom: 24, height: 50 },
	catItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: '#fff',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		gap: 8,
	},
	catItemActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
	catText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
	catTextActive: { color: '#fff' },
	itemInvisible: {
		flex: 1,
		backgroundColor: 'transparent',
		marginHorizontal: 6,
		marginBottom: 15,
	},
});
