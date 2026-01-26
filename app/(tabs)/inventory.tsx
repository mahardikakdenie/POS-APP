import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function InventoryScreen() {
	return (
		<ThemedView style={styles.container}>
			<ThemedText style={styles.title}>Manajemen Stok</ThemedText>
			<ScrollView style={styles.list}>
				<View style={styles.itemCard}>
					<ThemedText style={{ fontWeight: '700' }}>
						Americano
					</ThemedText>
					<ThemedText style={{ color: '#6366f1' }}>
						45 Unit
					</ThemedText>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#e2e8f0', padding: 40 },
	title: {
		fontSize: 24,
		fontWeight: '900',
		color: '#1e293b',
		marginBottom: 20,
	},
	list: { flex: 1 },
	itemCard: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 15,
		marginBottom: 10,
	},
});
