import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { semanticColors } from '../../../styles/semanticColors';
import { CategoryChip } from '../../../components/ui/CategoryChip';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SearchFiltersProps {
  activeCategory: string | null;
  onSelectCategory?: (category: string) => void;
  animatedPosition: SharedValue<number>;
}

export const SearchFilters = ({
  activeCategory,
  onSelectCategory,
  animatedPosition,
}: SearchFiltersProps) => {
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const collapsedPos = SCREEN_HEIGHT - (insets.bottom + 84);

    const opacity = interpolate(
      animatedPosition.value,
      [collapsedPos - 50, collapsedPos - 5],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <CategoryChip
          label="Música"
          isSelected={activeCategory === 'music'}
          activeColor={semanticColors.categories.music}
          onPress={() => onSelectCategory?.('music')}
        />
        <CategoryChip
          label="Comida"
          isSelected={activeCategory === 'food'}
          activeColor={semanticColors.categories.food}
          onPress={() => onSelectCategory?.('food')}
        />
        <CategoryChip
          label="Info"
          isSelected={activeCategory === 'services'}
          activeColor={semanticColors.categories.services}
          onPress={() => onSelectCategory?.('services')}
        />
        <CategoryChip
          label="Tiendas"
          isSelected={activeCategory === 'shopping'}
          activeColor={semanticColors.categories.shopping}
          onPress={() => onSelectCategory?.('shopping')}
        />
        <CategoryChip
          label="Parking"
          isSelected={activeCategory === 'parking'}
          activeColor={semanticColors.categories.parking}
          onPress={() => onSelectCategory?.('parking')}
        />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 12,
  },
});
