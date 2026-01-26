import { POSProvider } from '@/context/POSContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import 'react-native-reanimated';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const { width } = useWindowDimensions();

	const MIN_WIDTH = 768;
	const isScreenValid = width >= MIN_WIDTH;
	if (!isScreenValid) {
		return (
			<View style={styles.guardContainer}>
				<View style={styles.guardCard}>
					<View style={styles.iconBg}>
						<Ionicons
							name='tablet-landscape-outline'
							size={48}
							color='#3b82f6'
						/>
					</View>
					<Text style={styles.guardTitle}>
						Tampilan Tidak Didukung
					</Text>
					<Text style={styles.guardMessage}>
						Mohon maaf, aplikasi POS ini didesain khusus untuk layar
						**Tablet** atau **Desktop** demi kenyamanan transaksi.
					</Text>
					<View style={styles.separator} />
					<Text style={styles.guardSuggestion}>
						Silakan akses aplikasi ini menggunakan perangkat dengan
						lebar layar minimal {MIN_WIDTH}px.
					</Text>
				</View>
				<StatusBar style='dark' />
			</View>
		);
	}

	return (
		<POSProvider>
			<ThemeProvider
				value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack>
					<Stack.Screen
						name='(tabs)'
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name='modal'
						options={{ presentation: 'modal', title: 'Modal' }}
					/>
				</Stack>
				<StatusBar style='auto' />
			</ThemeProvider>
		</POSProvider>
	);
}

const styles = StyleSheet.create({
	guardContainer: {
		flex: 1,
		backgroundColor: '#f1f5f9',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	guardCard: {
		backgroundColor: '#fff',
		padding: 32,
		borderRadius: 24,
		alignItems: 'center',
		maxWidth: 400,
		width: '100%',
		shadowColor: '#64748b',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.1,
		shadowRadius: 20,
		elevation: 10,
	},
	iconBg: {
		width: 80,
		height: 80,
		backgroundColor: '#eff6ff',
		borderRadius: 40,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
	},
	guardTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#1e293b',
		marginBottom: 12,
		textAlign: 'center',
	},
	guardMessage: {
		fontSize: 15,
		color: '#64748b',
		textAlign: 'center',
		lineHeight: 22,
	},
	separator: {
		height: 1,
		width: '100%',
		backgroundColor: '#e2e8f0',
		marginVertical: 20,
	},
	guardSuggestion: {
		fontSize: 13,
		color: '#94a3b8',
		textAlign: 'center',
		fontStyle: 'italic',
	},
});
