import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedScrollHandler, 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useProfileStore } from '../../src/features/profile/store/useProfileStore';
import { ProfileHeader } from '../../src/features/profile/components/ProfileHeader';
import { ActionGrid } from '../../src/features/profile/components/ActionGrid';
import { AchievementRow } from '../../src/features/profile/components/AchievementRow';
import { SettingsGroup } from '../../src/features/profile/components/SettingsGroup';

export default function ProfileScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useProfileStore();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 50],
      [1, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.2, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  if (!profile) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ 
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerWrapper}>
          <ProfileHeader profile={profile} />
        </View>

        <View style={styles.content}>
          <ActionGrid />
          <AchievementRow medals={profile.medals} />
          <SettingsGroup />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    marginBottom: 20,
  },
  content: {
    gap: 16,
  },
});
