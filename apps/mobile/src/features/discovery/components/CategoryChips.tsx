import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import {
  Headphones,
  Music,
  UtensilsCrossed,
  Beer,
  ShoppingBag,
  Star,
  Zap,
  Trophy,
  Sparkles,
  MapPin
} from 'lucide-react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface Props {
  categories: Category[];
  activeCategory?: string;
  onSelect: (id: string) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  music: Music,
  headphones: Headphones,
  utensils: UtensilsCrossed,
  beer: Beer,
  'shopping-bag': ShoppingBag,
  star: Star,
  stage: Music,
  restaurant: UtensilsCrossed,
  bar: Beer,
  shop: ShoppingBag,
  meetup_point: Star,
  cpu: Zap,
  trophy: Trophy,
  sparkles: Sparkles,
};

const LabelMap: Record<string, string> = {
  stage: 'Escenarios',
  restaurant: 'Gastronomía',
  bar: 'Bebidas',
  shop: 'Tiendas',
  meetup_point: 'Zonas VIP',
};

export const CategoryChips = React.memo(({ categories, activeCategory, onSelect }: Props) => {
  const theme = useAppTheme();

  return (
    <View style={{ marginBottom: 24 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {categories.map((cat) => {
          const Icon = IconMap[cat.icon] || IconMap[cat.id] || MapPin;
          const isActive = activeCategory === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              style={{ alignItems: 'center', minWidth: 72, paddingHorizontal: 4 }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isActive
                    ? theme.colors.brand.primary
                    : theme.colors.glass.background,
                  borderColor: theme.colors.glass.border,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                <Icon
                  size={24}
                  color={isActive ? theme.colors.bg.main : theme.colors.text.primary}
                  strokeWidth={2}
                />
              </View>
              <Text
                style={{
                  fontFamily: typography.primary.medium,
                  fontSize: 12,
                  color: isActive ? theme.colors.brand.primary : theme.colors.text.muted,
                  textAlign: 'center',
                }}
              >
                {LabelMap[cat.id] || cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});
