import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { 
  Trophy, 
  Medal as MedalIcon, 
  Star, 
  Flame, 
  Crown, 
  Award,
  LucideIcon
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { Medal } from '../types';

interface AchievementRowProps {
  medals: Medal[];
}

const getMedalIcon = (iconName: string): LucideIcon => {
  const map: Record<string, LucideIcon> = {
    trophy: Trophy,
    medal: MedalIcon,
    star: Star,
    flame: Flame,
    fire: Flame,
    crown: Crown,
  };
  return map[iconName.toLowerCase()] || Award;
};

export const AchievementRow = ({ medals }: AchievementRowProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Logros Lattice</Text>
        <Pressable>
          <Text style={[styles.seeAll, { color: theme.colors.brand.primary }]}>Ver todos</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {medals.length === 0 ? (
          <View style={[styles.emptyContainer, { backgroundColor: theme.colors.bg.surface }]}>
            <Text style={[styles.emptyText, { color: theme.colors.text.muted }]}>
              Aún no tienes logros. ¡Asiste a eventos para desbloquearlos!
            </Text>
            <View style={[styles.border, { borderColor: theme.colors.glass.border }]} />
          </View>
        ) : (
          medals.map((medal) => {
            const IconComponent = getMedalIcon(medal.icon);
            return (
              <View key={medal.id} style={styles.medalCard}>
                <View style={styles.medalWrapper}>
                  <LinearGradient
                    colors={
                      medal.isLocked
                        ? [theme.colors.interactive.disabled, theme.colors.bg.elevation]
                        : [theme.colors.brand.primary, theme.colors.brand.primaryVariant]
                    }
                    style={styles.medalGradient}
                  >
                    <View style={[styles.innerCircle, { backgroundColor: theme.colors.bg.surface }]}>
                      <IconComponent
                        size={28}
                        color={medal.isLocked ? theme.colors.text.muted : theme.colors.brand.primary}
                        strokeWidth={2.2}
                      />
                    </View>
                  </LinearGradient>
                  <View
                    style={[
                      styles.outerBorder,
                      {
                        borderColor: medal.isLocked
                          ? theme.colors.border.subtle
                          : theme.colors.brand.primarySurface,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.medalTitle,
                    { color: theme.colors.text.primary },
                    medal.isLocked && { color: theme.colors.text.muted },
                  ]}
                  numberOfLines={1}
                >
                  {medal.title}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: typography.primary.bold,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  medalCard: {
    alignItems: 'center',
    width: 80,
  },
  medalWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  medalGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2, // Space for the gradient border effect
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    borderWidth: 1.5,
    opacity: 0.3,
  },
  medalTitle: {
    fontSize: 11,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    width: '100%',
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 34,
    borderWidth: 1,
  },
  emptyContainer: {
    padding: 20,
    borderRadius: 20,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
  },
});
