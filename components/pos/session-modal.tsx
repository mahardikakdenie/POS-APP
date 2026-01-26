// components/pos/SessionModal.tsx
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
	cashierName: string;
	setCashierName: (name: string) => void;
	onStart: () => void;
}

export const SessionModal = ({
	cashierName,
	setCashierName,
	onStart,
}: Props) => {
	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<View style={styles.iconBg}>
					<Ionicons name='person' size={32} color='#3b82f6' />
				</View>
				<ThemedText style={styles.title}>Start Shift</ThemedText>
				<TextInput
					style={styles.input}
					placeholder='Cashier Name'
					placeholderTextColor='#94a3b8'
					value={cashierName}
					onChangeText={setCashierName}
				/>
				<TouchableOpacity style={styles.btn} onPress={onStart}>
					<ThemedText style={styles.btnText}>
						Open Register
					</ThemedText>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f1f5f9',
	},
	card: {
		width: 400,
		backgroundColor: '#fff',
		padding: 40,
		borderRadius: 24,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 5,
	},
	iconBg: {
		width: 64,
		height: 64,
		backgroundColor: '#eff6ff',
		borderRadius: 32,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 24,
	},
	input: {
		width: '100%',
		backgroundColor: '#f8fafc',
		padding: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		fontSize: 16,
		color: '#1e293b',
		marginBottom: 24,
	},
	btn: {
		width: '100%',
		backgroundColor: '#3b82f6',
		padding: 16,
		borderRadius: 12,
		alignItems: 'center',
	},
	btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
