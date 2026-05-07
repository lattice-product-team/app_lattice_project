import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSavedLocations, useDeleteSavedLocation } from '../hooks/useSavedLocations';
import * as SafeAreaContext from 'react-native-safe-area-context';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { typography, pageStyles } from '../../../styles/typography';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SavedLocationsManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectMarker: (coords: [number, number], id: number) => void;
}

export const SavedLocationsManager = ({
  isVisible,
  onClose,
  onSelectMarker,
}: SavedLocationsManagerProps) => {
  const theme = useLatticeTheme();
  const { data: savedData, isLoading } = useSavedLocations();
  const deleteMutation = useDeleteSavedLocation();

  const handleDelete = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });
  };

  const handleGoTo = (coords: [number, number], id: number) => {
    onSelectMarker(coords, id);
    onClose();
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <SafeAreaContext.SafeAreaView style={styles.sheetContent}>
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Mis Marcadores</Text>
              <Text style={styles.subtitle}>Gestiona tus lugares guardados en el mapa</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7 }]}
            >
              <Feather name="x" size={24} color="white" />
            </Pressable>
          </View>

          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator color={theme.colors.brand.primary} size="large" />
            </View>
          ) : savedData?.features?.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {savedData.features.map((feature: any) => (
                <View key={feature.properties.id} style={styles.markerItem}>
                  <View style={styles.markerInfo}>
                    <View style={styles.iconWrapper}>
                      <Feather name="map-pin" size={18} color={theme.colors.brand.primary} />
                    </View>
                    <View style={styles.nameContainer}>
                      <Text style={styles.markerName} numberOfLines={1}>
                        {feature.properties.label || 'Marcador sin nombre'}
                      </Text>
                      <Text style={styles.markerCoords}>
                        {feature.geometry.coordinates[1].toFixed(5)},{' '}
                        {feature.geometry.coordinates[0].toFixed(5)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.actions}>
                    <Pressable
                      onPress={() =>
                        handleGoTo(feature.geometry.coordinates, feature.properties.id)
                      }
                      style={({ pressed }) => [
                        styles.actionBtn,
                        styles.goBtn,
                        pressed && { opacity: 0.7 },
                      ]}
                    >
                      <Feather name="navigation" size={16} color="white" />
                      <Text style={styles.actionText}>Ir</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleDelete(feature.properties.id)}
                      style={({ pressed }) => [
                        styles.actionBtn,
                        styles.deleteBtn,
                        pressed && { opacity: 0.7 },
                      ]}
                      disabled={deleteMutation.isPending}
                    >
                      <Feather name="trash-2" size={16} color="white" />
                    </Pressable>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.centerContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="map" size={40} color="rgba(255, 255, 255, 0.1)" />
              </View>
              <Text style={styles.emptyTitle}>No tienes marcadores</Text>
              <Text style={styles.emptySubtitle}>Los lugares que guardes aparecerán aquí.</Text>
            </View>
          )}

          <View style={styles.footer}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.doneButton, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.doneButtonText}>Hecho</Text>
            </Pressable>
          </View>
        </SafeAreaContext.SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  sheetContent: {
    backgroundColor: '#121214',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    height: SCREEN_HEIGHT * 0.85,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    ...pageStyles.title,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    ...pageStyles.subtitle,
    marginTop: 2,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  markerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  markerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  markerName: {
    color: 'white',
    fontSize: 16,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.2,
  },
  markerCoords: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    height: 40,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  goBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    gap: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  deleteBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    width: 40,
    paddingHorizontal: 0,
  },
  actionText: {
    color: 'white',
    fontSize: 13,
    fontFamily: typography.secondary.bold,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 15,
    fontFamily: typography.secondary.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  doneButton: {
    height: 56,
    backgroundColor: '#E10600', // Formula 1 Red - keeping for brand feel
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E10600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 17,
    fontFamily: typography.secondary.bold,
  },
});
