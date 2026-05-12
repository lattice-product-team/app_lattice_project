import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { X, CircleCheck, CloudDownload } from 'lucide-react-native';
import { LatticeEvent } from '../../../types';
import { getEventMetadata } from '../../../utils/poiUtils';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { offlineService } from '../../../services/offlineService';
import * as Haptics from 'expo-haptics';

interface EventSummaryCardProps {
  event: LatticeEvent;
  onClear: () => void;
}

export const EventSummaryCard = ({ event, onClear }: EventSummaryCardProps) => {
  const theme = useAppTheme();
  const metadata = getEventMetadata(event.type);
  const CategoryIcon = metadata.icon;
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsDownloaded(offlineService.isEventDownloaded(event.id));
  }, [event.id]);

  const handleDownload = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsDownloading(true);
      await offlineService.downloadEventPackage(event, (p) => setProgress(p));
      setIsDownloaded(true);
      setIsDownloading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.glass.subtle }]}>
            <CategoryIcon size={24} color={theme.colors.brand.primary} strokeWidth={2.2} />
          </View>
          <View>
            <Text style={[styles.name, { color: theme.colors.text.primary }]}>{event.name}</Text>
            <Text style={[styles.type, { color: theme.colors.text.muted }]}>{metadata.label}</Text>
          </View>
        </View>
        <Pressable onPress={onClear} style={styles.closeButton}>
          <X size={20} color={theme.colors.text.muted} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.actions}>
        <Pressable
          onPress={isDownloaded ? undefined : handleDownload}
          disabled={isDownloading || isDownloaded}
          style={[
            styles.downloadButton,
            { backgroundColor: theme.colors.brand.primary },
            isDownloaded && styles.downloadedButton,
            isDownloading && { backgroundColor: theme.colors.interactive.disabled },
          ]}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={theme.colors.text.inverse} />
          ) : (
            <>
              {isDownloaded ? (
                <CircleCheck size={18} color={theme.colors.text.inverse} strokeWidth={2.2} />
              ) : (
                <CloudDownload size={18} color={theme.colors.text.inverse} strokeWidth={2.2} />
              )}
            </>
          )}
          <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
            {isDownloading
              ? `Descargando ${Math.round(progress * 100)}%`
              : isDownloaded
                ? 'Disponible offline'
                : 'Descargar pack offline'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 24,
    backgroundColor: theme.colors.glass.subtle,
    borderWidth: 1,
    borderColor: theme.colors.glass.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
  },
  type: {
    fontSize: 14,
    fontFamily: typography.secondary.medium,
  },
  closeButton: {
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  downloadedButton: {
    backgroundColor: '#32D74B',
  },
  downloadingButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontFamily: typography.primary.bold,
  },
});
