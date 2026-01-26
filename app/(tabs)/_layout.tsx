import { POSProvider } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// ... (Kode CustomDrawerContent Anda yang sebelumnya tetap sama) ...
function CustomDrawerContent(props: any) {
	const pathname = usePathname();
	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ paddingTop: 0 }}>
				{/* Logo Area */}
				<View
					style={{
						padding: 24,
						flexDirection: 'row',
						alignItems: 'center',
						gap: 12,
					}}>
					<View
						style={{
							width: 40,
							height: 40,
							backgroundColor: '#3b82f6',
							borderRadius: 10,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Ionicons name='storefront' size={24} color='#fff' />
					</View>
					<Text
						style={{
							fontSize: 18,
							fontWeight: '700',
							color: '#1e293b',
						}}>
						Chill Pil POS
					</Text>
				</View>
				<View
					style={{
						height: 1,
						backgroundColor: '#f1f5f9',
						marginHorizontal: 24,
						marginBottom: 16,
					}}
				/>

				{/* Menu Items */}
				<View style={{ paddingHorizontal: 12 }}>
					<DrawerItem
						label='Point of Sale'
						icon={({ color, size }) => (
							<Ionicons
								name={
									pathname === '/' ? 'grid' : 'grid-outline'
								}
								size={size}
								color={color}
							/>
						)}
						onPress={() => router.push('/')}
						focused={pathname === '/'}
						activeTintColor='#fff'
						activeBackgroundColor='#3b82f6'
						inactiveTintColor='#64748b'
						style={{ borderRadius: 12 }}
					/>
					<DrawerItem
						label='Kitchen / Orders'
						icon={({ color, size }) => (
							<Ionicons
								name={
									pathname === '/orders'
										? 'receipt'
										: 'receipt-outline'
								}
								size={size}
								color={color}
							/>
						)}
						onPress={() => router.push('/orders')}
						focused={pathname === '/orders'}
						activeTintColor='#fff'
						activeBackgroundColor='#3b82f6'
						inactiveTintColor='#64748b'
						style={{ borderRadius: 12 }}
					/>
				</View>
			</DrawerContentScrollView>
		</View>
	);
}

export default function RootLayout() {
	return (
		<POSProvider>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<Drawer
					drawerContent={(props) => (
						<CustomDrawerContent {...props} />
					)}
					screenOptions={{
						headerShown: false,
						drawerType: 'permanent',
						drawerStyle: {
							width: 240,
							borderRightColor: '#f1f5f9',
						},
					}}>
					<Drawer.Screen name='index' />
					<Drawer.Screen name='orders' />
				</Drawer>
			</GestureHandlerRootView>
		</POSProvider>
	);
}
