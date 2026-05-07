import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { useProfileStore } from '../../src/features/profile/store/useProfileStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ProfileHeader } from '../../src/features/profile/components/ProfileHeader';
import { ActionGrid } from '../../src/features/profile/components/ActionGrid';
import { AchievementRow } from '../../src/features/profile/components/AchievementRow';
import { SettingsGroup } from '../../src/features/profile/components/SettingsGroup';
import { PremiumButton } from '../../src/components/ui/PremiumButton';

export default function ProfileScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const { profile, setProfile } = useProfileStore();
  const { user, isGuest, openAuthPrompt } = useAuthStore();
  const scrollY = useSharedValue(0);

  // Sync Auth User to Profile Store
  useEffect(() => {
    if (user && !isGuest) {
      setProfile({
        id: String(user.id),
        name: user.fullName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio || 'Urban explorer discovering the city.',
        stats: user.stats || {
          eventsAttended: 0,
          savedEvents: 0,
          latticePoints: 0,
        },
        medals: user.medals || [],
      });
    }
  }, [user, isGuest, setProfile]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [1, 0], Extrapolation.CLAMP);
    const scale = interpolate(scrollY.value, [-100, 0], [1.2, 1], Extrapolation.CLAMP);
    return { opacity, transform: [{ scale }] };
  });

  // Guest UI State
  if (isGuest) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.bg.main,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
          },
        ]}
      >
        <View style={styles.guestContent}>
          <Text style={[styles.guestTitle, { color: theme.colors.text.primary }]}>
            Guest Explorer
          </Text>
          <Text style={[styles.guestSubtitle, { color: theme.colors.text.secondary }]}>
            Join the community to track your events, earn medals, and personalize your experience.
          </Text>
          <PremiumButton
            label="JOIN LATTICE"
            variant="primary"
            onPress={() => openAuthPrompt('/(main)/profile')}
          />
        </View>
      </View>
    );
  }

  if (!profile) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg.main }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
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
  guestContent: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  guestTitle: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
  },
  guestSubtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Medium',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.8,
  },
  headerWrapper: {
    marginBottom: 20,
  },
  content: {
    gap: 16,
  },
});
