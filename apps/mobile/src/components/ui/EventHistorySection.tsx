import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LatticeEvent } from '../../types';
import { getEventMetadata } from '../../utils/poiUtils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { typography } from '../../styles/typography';

interface EventHistorySectionProps {
  events: LatticeEvent[];
}

export const EventHistorySection = ({ events }: EventHistorySectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial de Eventos</Text>
        <Pressable>
          <Text style={styles.seeAll}>Ver todos</Text>
        </Pressable>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.map((event) => {
          const metadata = getEventMetadata(event.type);
          return (
            <View key={event.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: `${metadata.color}15` }]}>
                <MaterialCommunityIcons name={metadata.icon as any} size={24} color={metadata.color} />
              </View>
              <Text style={styles.eventName} numberOfLines={1}>{event.name}</Text>
              <Text style={styles.eventDate}>Agosto 2024</Text>
            </View>
          );
        })}
        {events.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aún no has asistido a ningún evento</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: typography.primary.bold,
  },
  seeAll: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    fontFamily: typography.secondary.medium,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    width: 140,
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  eventName: {
    color: 'white',
    fontSize: 14,
    fontFamily: typography.primary.bold,
    marginBottom: 4,
  },
  eventDate: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
    fontFamily: typography.secondary.regular,
  },
  emptyState: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 14,
    fontFamily: typography.secondary.medium,
  }
});
