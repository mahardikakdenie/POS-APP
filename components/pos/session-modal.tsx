import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

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
	const [error, setError] = useState(false);

	const handleStart = () => {
		if (!cashierName.trim()) {
			setError(true);
			return;
		}
		onStart();
	};

	return (
		<View style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={styles.keyboardView}>
				<View style={styles.card}>
					<View style={styles.iconContainer}>
						<Ionicons name='storefront' size={40} color='#3b82f6' />
					</View>

					<ThemedText style={styles.title}>
						Start New Session
					</ThemedText>
					<ThemedText style={styles.subtitle}>
						Enter your name to begin taking orders
					</ThemedText>

					<View style={styles.inputContainer}>
						<ThemedText style={styles.label}>
							Cashier Name
						</ThemedText>
						<TextInput
							style={[styles.input, error && styles.inputError]}
							value={cashierName}
							onChangeText={(t) => {
								setCashierName(t);
								setError(false);
							}}
							placeholder='e.g. John Doe'
							placeholderTextColor='#94a3b8'
							autoFocus
						/>
						{error && (
							<ThemedText style={styles.errorText}>
								Name is required
							</ThemedText>
						)}
					</View>

					<TouchableOpacity
						style={[styles.btn, !cashierName && styles.btnDisabled]}
						onPress={handleStart}
						activeOpacity={0.8}
						disabled={!cashierName}>
						<ThemedText style={styles.btnText}>
							Open Register
						</ThemedText>
						<Ionicons name='arrow-forward' size={20} color='#fff' />
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f1f5f9',
		justifyContent: 'center',
		padding: 24,
	},
	keyboardView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		backgroundColor: '#fff',
		width: '100%',
		maxWidth: 400,
		padding: 32,
		borderRadius: 24,
		alignItems: 'center',
		shadowColor: '#64748b',
		shadowOffset: { width: 0, height: 20 },
		shadowOpacity: 0.1,
		shadowRadius: 30,
		elevation: 10,
	},
	iconContainer: {
		width: 80,
		height: 80,
		backgroundColor: '#eff6ff',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
	},
	title: {
		fontSize: 24,
		fontWeight: '800',
		color: '#1e293b',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 15,
		color: '#64748b',
		textAlign: 'center',
		marginBottom: 32,
	},
	inputContainer: { width: '100%', marginBottom: 24 },
	label: {
		fontSize: 14,
		fontWeight: '600',
		color: '#1e293b',
		marginBottom: 8,
		marginLeft: 4,
	},
	input: {
		width: '100%',
		height: 52,
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 12,
		paddingHorizontal: 16,
		fontSize: 16,
		color: '#1e293b',
		backgroundColor: '#f8fafc',
	},
	inputError: { borderColor: '#ef4444', backgroundColor: '#fef2f2' },
	errorText: { color: '#ef4444', fontSize: 12, marginTop: 6, marginLeft: 4 },
	btn: {
		width: '100%',
		height: 56,
		backgroundColor: '#3b82f6',
		borderRadius: 14,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		shadowColor: '#3b82f6',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 6,
	},
	btnDisabled: { backgroundColor: '#cbd5e1', shadowOpacity: 0, elevation: 0 },
	btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
