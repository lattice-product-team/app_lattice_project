import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useSearchEvents, SearchEvent } from '../hooks/useSearchEvents';

interface SearchExperienceProps {
  query: string;
  onSelectResult: (query: string, coordinates?: [number, number]) => void;
}

export const SearchExperience = ({ query, onSelectResult }: SearchExperienceProps) => {
  const theme = useAppTheme();
  const { history, removeSearch, clearHistory } = useSearchHistory();
  const { events, loading } = useSearchEvents(query);

  const isQueryEmpty = !query || query.trim() === '';

  const renderHistoryItem = ({ item }: { item: string }) => (
    <Pressable 
      style={styles.itemRow}
      onPress={() => onSelectResult(item)}
    >
      <View style={styles.iconContainer}>
        <Feather name="clock" size={18} color={theme.colors.text.muted} />
      </View>
      <Text style={[styles.itemText, { color: theme.colors.text.primary }]}>{item}</Text>
      <Pressable onPress={() => removeSearch(item)} style={styles.removeButton}>
        <Feather name="x" size={16} color={theme.colors.text.muted} />
      </Pressable>
    </Pressable>
  );

  const renderEventItem = ({ item }: { item: SearchEvent }) => (
    <Pressable 
      style={styles.itemRow}
      onPress={() => onSelectResult(item.name, item.center?.coordinates)}
    >
      <View style={styles.eventImageContainer}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
        ) : (
          <View style={[styles.eventPlaceholder, { backgroundColor: theme.colors.glass.subtle }]}>
            <MaterialCommunityIcons name="calendar-star" size={20} color={theme.colors.brand.primary} />
          </View>
        )}
      </View>
      <View style={styles.eventInfo}>
        <Text style={[styles.itemText, { color: theme.colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.subText, { color: theme.colors.text.muted }]}>{item.type}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={theme.colors.text.muted} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {isQueryEmpty && history.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>RECENT SEARCHES</Text>
            <Pressable onPress={clearHistory}>
              <Text style={[styles.clearText, { color: theme.colors.brand.primary }]}>Clear All</Text>
            </Pressable>
          </View>
          {history.map((item, index) => (
            <View key={`history-${index}`}>
              {renderHistoryItem({ item })}
              {index < history.length - 1 && <View style={[styles.divider, { backgroundColor: theme.colors.glass.border }]} />}
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>
            {isQueryEmpty ? 'AVAILABLE EVENTS' : 'SEARCH RESULTS'}
          </Text>
        </View>
        
        {loading ? (
          <Text style={[styles.statusText, { color: theme.colors.text.muted }]}>Loading...</Text>
        ) : events.length > 0 ? (
          events.map((item, index) => (
            <View key={`event-${item.id}`}>
              {renderEventItem({ item })}
              {index < events.length - 1 && <View style={[styles.divider, { backgroundColor: theme.colors.glass.border }]} />}
            </View>
          ))
        ) : (
          <Text style={[styles.statusText, { color: theme.colors.text.muted }]}>No results found</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    letterSpacing: 0.5,
  },
  clearText: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  iconContainer: {
    width: 36,
    alignItems: 'flex-start',
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: typography.primary.medium,
  },
  subText: {
    fontSize: 13,
    fontFamily: typography.primary.regular,
  },
  removeButton: {
    padding: 4,
  },
  divider: {
    height: 0.5,
    marginLeft: 36,
  },
  eventImageContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  eventPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  statusText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: typography.primary.medium,
  },
});
