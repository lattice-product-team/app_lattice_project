import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Share } from 'react-native';
import { Bookmark, Share2, Share as ShareIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { StandardUIPOI } from '../../../types/models/poi';
import { Image } from 'expo-image';
import { resolveBannerUrl } from '../../../utils/poiUtils';

interface SavedListContentProps {
  savedItems: StandardUIPOI[];
  onSelectItem: (item: StandardUIPOI) => void;
}

export const SavedListContent = ({ savedItems, onSelectItem }: SavedListContentProps) => {
  const theme = useLatticeTheme();

  const handleShareList = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const names = savedItems.map((i) => i.displayName).join(', ');
      await Share.share({
        message: `Check out my saved events and locations on Lattice!: ${names}`,
      });
    } catch (error) {
      console.error('Error sharing list:', error);
    }
  };

  const handleShareItem = async (item: StandardUIPOI) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out this venue on Lattice: ${item.displayName}`,
      });
    } catch (error) {
      console.error('Error sharing item:', error);
    }
  };

  if (savedItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Bookmark size={64} color="rgba(255,255,255,0.1)" strokeWidth={1.5} />
        <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
          Your list is empty
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.colors.text.muted }]}>
          Save events or venues to see them here and share them with friends.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>My Saved</Text>
        <Pressable
          onPress={handleShareList}
          style={({ pressed }) => [styles.shareAllButton, pressed && { opacity: 0.7 }]}
        >
          <Share2 size={18} color={theme.colors.brand.primary} strokeWidth={2.2} />
          <Text style={[styles.shareAllText, { color: theme.colors.brand.primary }]}>
            Share list
          </Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {savedItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              Haptics.selectionAsync();
              onSelectItem(item);
            }}
            style={({ pressed }) => [
              styles.itemCard,
              { backgroundColor: pressed ? 'rgba(255,255,255,0.05)' : 'transparent' },
            ]}
          >
            <Image
              source={{
                uri: resolveBannerUrl(item.images?.[0]),
              }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text
                style={[styles.itemName, { color: theme.colors.text.primary }]}
                numberOfLines={1}
              >
                {item.displayName}
              </Text>
              <Text style={[styles.itemCategory, { color: theme.colors.text.muted }]}>
                {item.categoryLabel}
              </Text>
            </View>
            <Pressable onPress={() => handleShareItem(item)} style={styles.itemShareButton}>
              <ShareIcon size={20} color="rgba(255,255,255,0.4)" strokeWidth={2.2} />
            </Pressable>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  shareAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(226, 176, 66, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  shareAllText: {
    fontSize: 13,
    fontFamily: typography.secondary.bold,
  },
  list: {
    paddingHorizontal: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.3,
  },
  itemCategory: {
    fontSize: 13,
    fontFamily: typography.secondary.regular,
    marginTop: 2,
  },
  itemShareButton: {
    padding: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: typography.primary.bold,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: typography.secondary.regular,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.7,
  },
});
