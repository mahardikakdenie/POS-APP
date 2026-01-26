import { ThemedText } from '@/components/themed-text';
import { Product } from '@/constants/types/pos';
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
	item: Product;
	onPress: (item: Product) => void;
}

export const ProductCard = ({ item, onPress }: Props) => (
	<TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
		<Image
			source={{ uri: item.img }}
			style={styles.img}
			contentFit='cover'
			transition={500}
		/>
		<View style={styles.info}>
			<ThemedText style={styles.name} numberOfLines={2}>
				{item.name}
			</ThemedText>
			<ThemedText style={styles.price}>
				${item.price.toFixed(2)}
			</ThemedText>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 16,
		padding: 12,
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#f8fafc',
		marginBottom: 15,
		marginHorizontal: 6,
		shadowColor: '#64748b',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.04,
		shadowRadius: 6,
		elevation: 1,
	},
	img: {
		width: '100%',
		height: 140,
		borderRadius: 12,
		marginBottom: 12,
		backgroundColor: '#f1f5f9',
	},
	info: {
		alignItems: 'center',
		width: '100%',
		justifyContent: 'space-between',
		flex: 1,
	},
	name: {
		fontSize: 14, // Font sedikit lebih besar karena kartu lebih lega
		fontWeight: '600',
		color: '#334155',
		textAlign: 'center',
		marginBottom: 4,
		height: 40,
		lineHeight: 20,
	},
	price: {
		fontSize: 15,
		fontWeight: '700',
		color: '#3b82f6',
	},
});
