import { POSProvider } from '@/context/POSContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CustomDrawerContent(props: any) {
	const pathname = usePathname();

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={{ paddingTop: 0 }}>
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
					<DrawerItem
						label='Daily Report'
						icon={({ color, size }) => (
							<Ionicons
								name={
									pathname === '/report'
										? 'bar-chart'
										: 'bar-chart-outline'
								}
								size={size}
								color={color}
							/>
						)}
						onPress={() => router.push('/report')}
						focused={pathname === '/report'}
						activeTintColor='#fff'
						activeBackgroundColor='#3b82f6'
						inactiveTintColor='#64748b'
						style={{ borderRadius: 12 }}
					/>
					<DrawerItem
						label='Settings'
						icon={({ color, size }) => (
							<Ionicons
								name={
									pathname === '/orders'
										? 'settings'
										: 'settings-outline'
								}
								size={size}
								color={color}
							/>
						)}
						onPress={() => router.push('/settings')}
						focused={pathname === '/settings'}
						activeTintColor='#fff'
						activeBackgroundColor='#3b82f6'
						inactiveTintColor='#64748b'
						style={{ borderRadius: 12 }}
					/>
				</View>
			</DrawerContentScrollView>

			<View
				style={{
					paddingHorizontal: 12,
					paddingBottom: 20,
					borderTopWidth: 1,
					borderTopColor: '#f1f5f9',
				}}>
				<DrawerItem
					label='Close Shift'
					icon={({ size }) => (
						<Ionicons
							name='log-out-outline'
							size={size}
							color='#ef4444'
						/>
					)}
					labelStyle={{ color: '#ef4444', fontWeight: '600' }}
					onPress={() => {}}
					style={{ borderRadius: 12, marginTop: 12 }}
				/>
			</View>
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
					<Drawer.Screen name='report' />
					<Drawer.Screen name='settings' />
				</Drawer>
			</GestureHandlerRootView>
		</POSProvider>
	);
}
