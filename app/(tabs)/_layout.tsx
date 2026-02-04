import { POSProvider } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: any) {
	const pathname = usePathname();

	const menuItems = [
		{ label: 'Point of Sale', path: '/', icon: 'grid', activeIcon: 'grid' },
		{
			label: 'Kitchen / Orders',
			path: '/orders',
			icon: 'receipt-outline',
			activeIcon: 'receipt',
		},
		{
			label: 'Daily Report',
			path: '/report',
			icon: 'bar-chart-outline',
			activeIcon: 'bar-chart',
		},
		{
			label: 'Settings',
			path: '/settings',
			icon: 'settings-outline',
			activeIcon: 'settings',
		},
	];

	return (
		<View style={styles.drawerContainer}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={styles.drawerScroll}>
				<View style={styles.brandContainer}>
					<View style={styles.logoBox}>
						<Ionicons name='storefront' size={24} color='#fff' />
					</View>
					<View>
						<Text style={styles.brandTitle}>Chill Pil</Text>
						<Text style={styles.brandSubtitle}>POS System</Text>
					</View>
				</View>

				<View style={styles.divider} />

				<View style={styles.menuContainer}>
					{menuItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<TouchableOpacity
								key={item.path}
								onPress={() => router.push(item.path as any)}
								activeOpacity={0.7}
								style={[
									styles.menuItem,
									isActive && styles.menuItemActive,
								]}>
								<Ionicons
									name={
										isActive
											? (item.activeIcon as any)
											: (item.icon as any)
									}
									size={22}
									color={isActive ? '#fff' : '#64748b'}
								/>
								<Text
									style={[
										styles.menuLabel,
										isActive && styles.menuLabelActive,
									]}>
									{item.label}
								</Text>
								{isActive && (
									<View style={styles.activeIndicator} />
								)}
							</TouchableOpacity>
						);
					})}
				</View>
			</DrawerContentScrollView>

			<View style={styles.footerContainer}>
				<TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
					<View style={styles.logoutIconBox}>
						<Ionicons
							name='log-out-outline'
							size={20}
							color='#ef4444'
						/>
					</View>
					<Text style={styles.logoutText}>Close Shift</Text>
				</TouchableOpacity>
				<Text style={styles.versionText}>v1.0.2 Mobile</Text>
			</View>
		</View>
	);
}

export default function RootLayout() {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	return (
		<POSProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					drawerContent={(props) => (
						<CustomDrawerContent {...props} />
					)}
					screenOptions={{
						headerShown: false,
						drawerType: isMobile ? 'front' : 'permanent',
						drawerStyle: {
							width: isMobile ? '80%' : 260,
							backgroundColor: '#fff',
							borderRightColor: '#f1f5f9',
							borderRightWidth: isMobile ? 0 : 1,
						},
						overlayColor: isMobile
							? 'rgba(0,0,0,0.5)'
							: 'transparent',
						swipeEnabled: true,
					}}>
					<Drawer.Screen name='index' />
					<Drawer.Screen name='orders' />
					<Drawer.Screen name='report' />
					<Drawer.Screen name='settings' />
				</Drawer>
			</GestureHandlerRootView>
		</POSProvider>
	);
}

const styles = StyleSheet.create({
	drawerContainer: { flex: 1, backgroundColor: '#fff' },
	drawerScroll: { paddingTop: 0 },
	brandContainer: {
		padding: 24,
		paddingTop: Platform.OS === 'ios' ? 60 : 40,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 16,
	},
	logoBox: {
		width: 44,
		height: 44,
		backgroundColor: '#3b82f6',
		borderRadius: 12,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#3b82f6',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	brandTitle: {
		fontSize: 20,
		fontWeight: '800',
		color: '#1e293b',
		letterSpacing: -0.5,
	},
	brandSubtitle: { fontSize: 13, color: '#64748b', fontWeight: '500' },
	divider: {
		height: 1,
		backgroundColor: '#f1f5f9',
		marginHorizontal: 24,
		marginBottom: 16,
	},
	menuContainer: { paddingHorizontal: 16, gap: 8 },
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 14,
		gap: 14,
	},
	menuItemActive: {
		backgroundColor: '#3b82f6',
		shadowColor: '#3b82f6',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 4,
	},
	menuLabel: { fontSize: 15, fontWeight: '600', color: '#64748b' },
	menuLabelActive: { color: '#fff' },
	activeIndicator: {
		width: 4,
		height: 4,
		backgroundColor: '#fff',
		borderRadius: 2,
		marginLeft: 'auto',
	},
	footerContainer: {
		padding: 24,
		borderTopWidth: 1,
		borderTopColor: '#f1f5f9',
		paddingBottom: Platform.OS === 'ios' ? 40 : 24,
	},
	logoutBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fef2f2',
		padding: 12,
		borderRadius: 12,
		gap: 12,
	},
	logoutIconBox: {
		backgroundColor: '#fff',
		padding: 6,
		borderRadius: 8,
	},
	logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 14 },
	versionText: {
		textAlign: 'center',
		marginTop: 16,
		fontSize: 12,
		color: '#cbd5e1',
		fontWeight: '500',
	},
});
