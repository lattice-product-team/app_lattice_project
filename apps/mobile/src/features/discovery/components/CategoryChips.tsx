import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { Music, MapPin, Coffee, GlassWater } from 'lucide-react-native';
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
  'glass-martini': GlassWater,
  palette: MapPin,
  tent: Coffee, // Fallbacks
};

export const CategoryChips = React.memo(({ categories, activeCategory, onSelect }: Props) => {
  const theme = useAppTheme();

  return (
    <View className="mb-6">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {categories.map((cat) => {
          const Icon = IconMap[cat.icon] || MapPin;
          const isActive = activeCategory === cat.id;

          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelect(cat.id)}
              className="items-center"
              style={{ width: 72 }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: isActive ? theme.colors.text.primary : theme.colors.glass.background,
                  borderColor: theme.colors.glass.border,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                <Icon
                  size={24}
                  color={isActive ? theme.colors.bg.surface : theme.colors.text.primary}
                  strokeWidth={2}
                />
              </View>
              <Text
                style={{
                  fontFamily: typography.primary.medium,
                  fontSize: 12,
                  color: isActive ? theme.colors.text.primary : theme.colors.text.muted,
                  textAlign: 'center',
                }}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});
