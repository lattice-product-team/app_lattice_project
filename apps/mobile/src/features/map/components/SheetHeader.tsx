import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { CircularActionButton } from '../../../components/ui/CircularActionButton';

interface SheetHeaderProps {
  onClose: () => void;
  onShare?: () => void;
}

export const SheetHeader = () => {
  const theme = useAppTheme();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: 'rgba(150, 150, 150, 0.4)' }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 2,
    paddingBottom: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
  },
  handle: {
    width: 72,
    height: 4,
    borderRadius: 2,
  },
});
