import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Extrapolation,
  interpolate,
  useDerivedValue,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { typography } from '../../../styles/typography';
import { StandardUIPOI } from '../../poi/types';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface POIMiniCardProps {
  poi: any | null;
  onClose: () => void;
}

export const POIMiniCard = ({ poi, onClose }: POIMiniCardProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const visibility = useSharedValue(0);
  const setNavigating = useNavigationStore((s) => s.setNavigating);

  useEffect(() => {
    if (poi?.id) {
      visibility.value = withSpring(1, theme.motion.physics.magnetic);
    } else {
      visibility.value = withSpring(0, theme.motion.physics.magnetic);
    }
  }, [poi?.id]);

  const animatedStyle = useAnimatedStyle(() => {
    const bottom = interpolate(
      visibility.value,
      [0, 1],
      [-200, insets.bottom + 12],
      Extrapolation.CLAMP
    );
    return {
      bottom,
      opacity: visibility.value,
    };
  });

  // No unmount based on visibility.value to avoid render-time reads

  return (
    <Animated.View style={[styles.container, theme.shadows.soft, animatedStyle]}>
      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.glass.background,
            borderColor: theme.colors.glass.border,
          },
        ]}
      >
        {/* Content Layer */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand.primary }]}>
            <MaterialCommunityIcons
              name={poi?.categoryIcon || 'map-marker'}
              size={24}
              color="white"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              {poi?.displayName}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>
              {poi?.categoryLabel}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            style={[
              styles.closeButton,
              {
                backgroundColor: theme.dark ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                borderColor: theme.colors.glass.border,
                ...theme.shadows.soft,
              },
            ]}
          >
            <Feather name="x" size={20} color={theme.colors.text.primary} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => {
              setNavigating(true);
              onClose();
            }}
            style={[styles.mainAction, { backgroundColor: theme.colors.brand.primary }]}
          >
            <MaterialCommunityIcons name="directions" size={20} color="white" />
            <Text style={styles.actionText}>Go Now</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 3000,
  },
  content: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.primary.medium,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  mainAction: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
});
