import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { UserProfile } from '../types';
import { UserAvatar } from '../../../components/ui/UserAvatar';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar size={110} url={profile.avatarUrl} />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>
          {profile.name}
        </Text>
        <Text style={[styles.bio, { color: theme.colors.text.secondary }]}>
          {profile.bio}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.stats.eventsAttended}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.muted }]}>
            Eventos
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.subtle }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.stats.latticePoints}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.muted }]}>
            Puntos
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.colors.border.subtle }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {profile.stats.savedEvents}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.muted }]}>
            Guardados
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  avatarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
    borderWidth: 1,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontFamily: typography.primary.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  bio: {
    fontSize: 15,
    fontFamily: typography.primary.medium,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    opacity: 0.5,
  },
});
