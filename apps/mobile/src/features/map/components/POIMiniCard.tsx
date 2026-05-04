import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  Extrapolation,
  interpolate
} from 'react-native-reanimated';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { typography } from '../../../styles/typography';
import { StandardUIPOI } from '../../poi/types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const AnimatedSafeBlurView = Animated.createAnimatedComponent(SafeBlurView);

interface POIMiniCardProps {
  poi: any | null;
  onClose: () => void;
}

export const POIMiniCard = ({ poi, onClose }: POIMiniCardProps) => {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const visibility = useSharedValue(0);

  useEffect(() => {
    if (poi) {
      visibility.value = withSpring(1, { damping: 20, stiffness: 100 });
    } else {
      visibility.value = withSpring(0, { damping: 20, stiffness: 100 });
    }
  }, [poi]);

  const animatedStyle = useAnimatedStyle(() => {
    const bottom = interpolate(visibility.value, [0, 1], [-200, insets.bottom + 12], Extrapolation.CLAMP);
    return {
      bottom,
      opacity: visibility.value,
    };
  });

  // No unmount based on visibility.value to avoid render-time reads

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <AnimatedSafeBlurView 
        tint={theme.colors.glass.tint}
        intensity={100}
        style={[
          styles.content,
          { 
            backgroundColor: 'transparent',
            borderColor: theme.dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)' 
          }
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand.primary }]}>
            <MaterialCommunityIcons name={poi?.categoryIcon || 'map-marker'} size={24} color="white" />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{poi?.displayName}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.muted }]}>{poi?.categoryLabel}</Text>
          </View>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={20} color={theme.colors.text.muted} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable style={[styles.mainAction, { backgroundColor: theme.colors.brand.primary }]}>
            <MaterialCommunityIcons name="directions" size={20} color="white" />
            <Text style={styles.actionText}>Go Now</Text>
          </Pressable>
        </View>
      </AnimatedSafeBlurView>
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
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
