import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

export default function SettingsScreen() {
	const router = useRouter();

	// State untuk pengaturan
	const [bgInput, setBgInput] = useState('');

	const handleUpdateBg = () => {
		if (!bgInput) return Alert.alert('Error', 'Masukkan URL Gambar');
		Alert.alert('Sukses', 'Background diperbarui (Simulasi)');
		// Di sini bisa menggunakan AsyncStorage.setItem('bg', bgInput)
	};

	const handleCloseShift = () => {
		Alert.alert(
			'Konfirmasi',
			'Apakah anda yakin ingin menutup shift sekarang?',
			[
				{ text: 'Batal', style: 'cancel' },
				{
					text: 'Ya, Tutup Shift',
					style: 'destructive',
					onPress: () => Alert.alert('Shift Berhasil Ditutup'),
				},
			],
		);
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.backBtn}>
					<Ionicons name='arrow-back' size={24} color='#1e293b' />
				</TouchableOpacity>
				<ThemedText style={styles.title}>Pengaturan POS</ThemedText>
			</View>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* Menu Utama (Grid) */}
				<View style={styles.section}>
					<ThemedText style={styles.sectionTitle}>
						Aksi Cepat
					</ThemedText>
					<View style={styles.grid}>
						<TouchableOpacity
							style={styles.menuItem}
							onPress={() =>
								Alert.alert(
									'Print',
									'Menghubungkan ke printer...',
								)
							}>
							<Ionicons
								name='print-outline'
								size={32}
								color='#6366f1'
							/>
							<ThemedText style={styles.menuLabel}>
								Cetak Struk
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.menuItem}
							onPress={handleCloseShift}>
							<Ionicons
								name='log-out-outline'
								size={32}
								color='#ef4444'
							/>
							<ThemedText style={styles.menuLabel}>
								Tutup Shift
							</ThemedText>
						</TouchableOpacity>

						<TouchableOpacity style={styles.menuItem}>
							<Ionicons
								name='people-outline'
								size={32}
								color='#10b981'
							/>
							<ThemedText style={styles.menuLabel}>
								Kelola Kasir
							</ThemedText>
						</TouchableOpacity>
					</View>
				</View>

				{/* Kustomisasi POS */}
				<View style={styles.section}>
					<ThemedText style={styles.sectionTitle}>
						Tampilan & Wallpaper
					</ThemedText>
					<View style={styles.card}>
						<ThemedText style={styles.inputLabel}>
							URL Background Image
						</ThemedText>
						<TextInput
							style={styles.input}
							placeholder='https://images.unsplash.com/...'
							value={bgInput}
							onChangeText={setBgInput}
							placeholderTextColor='#94a3b8'
						/>
						<TouchableOpacity
							style={styles.saveBtn}
							onPress={handleUpdateBg}>
							<ThemedText style={styles.saveBtnText}>
								Simpan Perubahan
							</ThemedText>
						</TouchableOpacity>
					</View>
				</View>

				{/* System Info */}
				<View style={styles.footerInfo}>
					<ThemedText style={styles.versionText}>
						Alva POS v1.0.4 - Pro Version
					</ThemedText>
				</View>
			</ScrollView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f1f5f9' },
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 50,
		paddingHorizontal: 40,
		paddingBottom: 20,
		backgroundColor: '#fff',
	},
	backBtn: {
		marginRight: 20,
		padding: 8,
		backgroundColor: '#e2e8f0',
		borderRadius: 12,
	},
	title: { fontSize: 28, fontWeight: '900', color: '#1e293b' },
	scrollContent: { paddingHorizontal: 40, paddingVertical: 20 },
	section: { marginBottom: 30 },
	sectionTitle: {
		fontSize: 18,
		fontWeight: '800',
		color: '#475569',
		marginBottom: 15,
	},
	grid: { flexDirection: 'row', gap: 20 },
	menuItem: {
		flex: 1,
		height: 120,
		backgroundColor: '#fff',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	menuLabel: {
		marginTop: 10,
		fontWeight: '700',
		fontSize: 14,
		color: '#1e293b',
	},
	card: {
		backgroundColor: '#fff',
		padding: 25,
		borderRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	inputLabel: {
		fontSize: 14,
		color: '#64748b',
		marginBottom: 8,
		fontWeight: '600',
	},
	input: {
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#e2e8f0',
		borderRadius: 12,
		padding: 15,
		fontSize: 14,
		color: '#1e293b',
		marginBottom: 15,
	},
	saveBtn: {
		backgroundColor: '#6366f1',
		paddingVertical: 15,
		borderRadius: 12,
		alignItems: 'center',
	},
	saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
	footerInfo: { alignItems: 'center', marginTop: 20, marginBottom: 50 },
	versionText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
});
