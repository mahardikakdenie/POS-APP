import { ThemedText } from '@/components/themed-text';
import { Product } from '@/constants/types/pos';
import { Image } from 'expo-image';
import {
	StyleSheet,
	TouchableOpacity,
	View,
	useWindowDimensions,
} from 'react-native';

interface Props {
	item: Product;
	onPress: (item: Product) => void;
}

export const ProductCard = ({ item, onPress }: Props) => {
	const { width } = useWindowDimensions();
	const isMobile = width < 768;

	return (
		<TouchableOpacity
			style={styles.card}
			activeOpacity={0.9}
			onPress={() => onPress(item)}>
			<View style={styles.imgContainer}>
				<Image
					source={{ uri: item.img }}
					style={styles.img}
					contentFit='cover'
					transition={200}
				/>
				<View style={styles.addBtn}>
					<ThemedText style={styles.plusIcon}>+</ThemedText>
				</View>
			</View>

			<View style={styles.info}>
				<ThemedText
					style={[styles.name, isMobile && styles.nameMobile]}
					numberOfLines={2}>
					{item.name}
				</ThemedText>
				<ThemedText style={styles.price}>
					${item.price.toFixed(2)}
				</ThemedText>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 10,
		borderWidth: 1,
		borderColor: '#f1f5f9',
		shadowColor: '#64748b',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.06,
		shadowRadius: 12,
		elevation: 4,
		marginBottom: 8,
	},
	imgContainer: {
		position: 'relative',
		marginBottom: 12,
	},
	img: {
		width: '100%',
		height: 130,
		borderRadius: 16,
		backgroundColor: '#f8fafc',
	},
	addBtn: {
		position: 'absolute',
		bottom: 8,
		right: 8,
		backgroundColor: '#fff',
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	plusIcon: {
		fontSize: 18,
		fontWeight: '600',
		color: '#3b82f6',
		marginTop: -2,
	},
	info: {
		paddingHorizontal: 4,
		paddingBottom: 4,
	},
	name: {
		fontSize: 15,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 6,
		lineHeight: 20,
		height: 40,
	},
	nameMobile: {
		fontSize: 14,
	},
	price: {
		fontSize: 16,
		fontWeight: '800',
		color: '#3b82f6',
	},
});
