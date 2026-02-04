import { CartSidebar } from '@/components/pos/cart-sidebar';
import { ProductCard } from '@/components/pos/product-card';
import { SessionModal } from '@/components/pos/session-modal';
import { ThemedText } from '@/components/themed-text';
import { CATEGORIES } from '@/constants/menuData';
import { usePOS } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	FlatList,
	Modal,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	useWindowDimensions,
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
	const { width } = useWindowDimensions();
	const [cartVisible, setCartVisible] = useState(false);

	const isMobile = width < 768;
	const numColumns = isMobile ? 2 : 3;

	if (!state.isSessionActive) {
		return (
			<SessionModal
				cashierName={state.cashierName}
				setCashierName={actions.setCashierName}
				onStart={actions.startSession}
			/>
		);
	}

	const CartModal = () => (
		<Modal
			animationType='slide'
			transparent={false}
			visible={cartVisible}
			onRequestClose={() => setCartVisible(false)}
			presentationStyle='pageSheet'>
			<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
				<CartSidebar onClose={() => setCartVisible(false)} />
			</SafeAreaView>
		</Modal>
	);

	const BottomFloatingBar = () => {
		if (state.cart.length === 0) return null;
		return (
			<View style={styles.floatingBarContainer}>
				<TouchableOpacity
					style={styles.floatingBar}
					activeOpacity={0.9}
					onPress={() => setCartVisible(true)}>
					<View style={styles.floatingInfo}>
						<View style={styles.badge}>
							<ThemedText style={styles.badgeText}>
								{state.cart.length}
							</ThemedText>
						</View>
						<View>
							<ThemedText style={styles.floatingLabel}>
								Total
							</ThemedText>
							<ThemedText style={styles.floatingTotal}>
								${state.summary.total.toFixed(2)}
							</ThemedText>
						</View>
					</View>
					<View style={styles.viewOrderBtn}>
						<ThemedText style={styles.viewOrderText}>
							View Cart
						</ThemedText>
						<Ionicons
							name='chevron-forward'
							size={20}
							color='#fff'
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<View style={styles.container}>
			<StatusBar barStyle='dark-content' />
			<View style={styles.leftSection}>
				<View style={[styles.header, isMobile && styles.headerMobile]}>
					<View>
						<ThemedText style={styles.headerTitle}>
							Hello, {state.cashierName} 👋
						</ThemedText>
						<ThemedText style={styles.headerDate}>
							Ready to make some sales?
						</ThemedText>
					</View>
					<View
						style={[
							styles.searchBar,
							isMobile && styles.searchBarMobile,
						]}>
						<Ionicons name='search' size={20} color='#94a3b8' />
						<TextInput
							style={styles.searchInput}
							placeholder='Search menu...'
							placeholderTextColor='#94a3b8'
							value={state.searchQuery}
							onChangeText={actions.setSearchQuery}
						/>
					</View>
				</View>

				<View style={styles.categoriesContainer}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
						{CATEGORIES.map((cat) => (
							<TouchableOpacity
								key={cat.id}
								activeOpacity={0.8}
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
					key={isMobile ? 'grid-2' : 'grid-3'}
					data={formatData([...state.filteredProducts], numColumns)}
					numColumns={numColumns}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingBottom: isMobile ? 120 : 40,
					}}
					columnWrapperStyle={{ gap: 16 }}
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

			{!isMobile ? (
				<CartSidebar />
			) : (
				<>
					<BottomFloatingBar />
					<CartModal />
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, flexDirection: 'row', backgroundColor: '#f8fafc' },
	leftSection: { flex: 1, padding: 24, paddingBottom: 0 },
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 24,
	},
	headerMobile: {
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: 16,
		marginTop: Platform.OS === 'android' ? 30 : 0,
	},
	headerTitle: {
		fontSize: 26,
		fontWeight: '800',
		color: '#1e293b',
		letterSpacing: -0.5,
	},
	headerDate: { fontSize: 15, color: '#64748b', marginTop: 4 },
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: 16,
		height: 52,
		borderRadius: 16,
		width: 320,
		borderWidth: 1,
		borderColor: '#f1f5f9',
		shadowColor: '#64748b',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 2,
	},
	searchBarMobile: { width: '100%' },
	searchInput: {
		flex: 1,
		marginLeft: 12,
		fontSize: 16,
		fontWeight: '500',
		color: '#1e293b',
	},
	categoriesContainer: { marginBottom: 24, height: 44 },
	catItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: '#fff',
		borderRadius: 30,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		gap: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.03,
		shadowRadius: 4,
	},
	catItemActive: {
		backgroundColor: '#3b82f6',
		borderColor: '#3b82f6',
		elevation: 2,
	},
	catText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
	catTextActive: { color: '#fff' },
	itemInvisible: {
		flex: 1,
		backgroundColor: 'transparent',
		marginHorizontal: 8,
	},

	floatingBarContainer: {
		position: 'absolute',
		bottom: 30,
		left: 20,
		right: 20,
		zIndex: 50,
	},
	floatingBar: {
		backgroundColor: '#1e293b',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: 20,
		shadowColor: '#1e293b',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 10,
	},
	floatingInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
	badge: {
		backgroundColor: '#3b82f6',
		width: 36,
		height: 36,
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	badgeText: { color: '#fff', fontWeight: '800', fontSize: 16 },
	floatingLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
	floatingTotal: { color: '#fff', fontWeight: '700', fontSize: 18 },
	viewOrderBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
		backgroundColor: 'rgba(255,255,255,0.1)',
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 12,
	},
	viewOrderText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});
