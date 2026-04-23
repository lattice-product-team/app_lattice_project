import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../ui/SafeBlurView';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UIPOI } from '../../types/models/poi';
import { RouteGeoJSON } from '../../types';
import { useMapStore } from '../../store/useMapStore';
import { Image } from 'expo-image';
import { getCategoryMetadata } from '../../utils/poiUtils';
import { typography } from '../../styles/typography';
import { colors } from '../../styles/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PoiDetailSheetProps {
  poi: UIPOI | null;
  route: RouteGeoJSON | null;
  onClose: () => void;
  translateY: SharedValue<number>;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <SafeBlurView intensity={90} tint="light" style={[style, styles.blurBackground]}>
      <View style={styles.premiumBorder} />
    </SafeBlurView>
  );
};

export const PoiDetailSheet = React.forwardRef<BottomSheet, PoiDetailSheetProps>(
  ({ poi, onClose, translateY }: PoiDetailSheetProps, ref) => {
    const insets = useSafeAreaInsets();
    const setNavigating = useMapStore((s) => s.setNavigating);
    const routeMetadata = useMapStore((s) => s.routeMetadata);

    const metadata = React.useMemo(() => getCategoryMetadata(poi?.category), [poi?.category]);

    const formatDistance = (m: number) => {
      if (m >= 1000) return `${(m / 1000).toFixed(1)} km`;
      return `${Math.round(m)} m`;
    };

    const formatDuration = (s: number) => {
      const mins = Math.round(s / 60);
      if (mins < 1) return '< 1 min';
      return `${mins} min`;
    };

    const snapPoints = React.useMemo(
      () => [
        insets.bottom + 320, 
        SCREEN_HEIGHT * 0.6, 
        SCREEN_HEIGHT - insets.top - 20,
      ],
      [insets.bottom, insets.top]
    );

    if (!poi) return null;

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backgroundComponent={CustomBackground}
        handleIndicatorStyle={styles.handleIndicator}
        animatedPosition={translateY}
        enablePanDownToClose
        onClose={onClose}
        overDragResistanceFactor={0}
        style={styles.sheetContainer}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.poiHeader}>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={styles.headerIconCircle}
            >
              <Feather name="share" size={20} color={colors.black} />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.poiTitle} numberOfLines={1}>
                {poi.name}
              </Text>
              <Text style={styles.poiSubtitle}>{metadata.label}</Text>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }}
              style={styles.headerIconCircle}
            >
              <Feather name="x" size={20} color={colors.black} />
            </Pressable>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Action Buttons Row */}
            <View style={styles.actionRow}>
              {/* Main Action: IR AHORA */}
              <Pressable
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setNavigating(true);
                }}
                disabled={!routeMetadata}
                style={[
                  styles.actionCard,
                  styles.actionCardPrimary,
                  !routeMetadata && { opacity: 0.6 },
                ]}
              >
                <MaterialCommunityIcons name="walk" size={28} color={colors.solar[900]} />
                <Text style={styles.actionCardValuePrimary}>
                  {routeMetadata ? formatDuration(routeMetadata.duration) : '...'}
                </Text>
                <Text style={styles.actionCardLabelPrimary}>IR AHORA</Text>
              </Pressable>

              {/* Info Action: Distancia */}
              <View style={styles.actionCard}>
                <View style={styles.iconContainer}>
                  <Feather name="map-pin" size={18} color={colors.muted} />
                </View>
                <Text style={styles.actionCardLabel}>Distancia</Text>
                <Text style={styles.actionCardValue}>
                  {routeMetadata ? formatDistance(routeMetadata.distance) : '...'}
                </Text>
              </View>

              {/* Info Action: Horario */}
              <View style={styles.actionCard}>
                <View style={styles.iconContainer}>
                  <Feather name="clock" size={18} color={colors.muted} />
                </View>
                <Text style={styles.actionCardLabel}>Horario</Text>
                <Text style={[styles.actionCardValue, { color: '#27AE60' }]}>Abierto</Text>
              </View>
            </View>

            {/* Photos */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photoList}
            >
              {(poi.images && poi.images.length > 0
                ? poi.images
                : [
                    'https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=800&auto=format&fit=crop',
                  ]
              ).map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img }}
                  style={styles.photo}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>

            {poi.description && <Text style={styles.description}>{poi.description}</Text>}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  }
);

PoiDetailSheet.displayName = 'PoiDetailSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: Platform.OS === 'ios' ? 10 : 0,
  },
  blurBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  handleIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    width: 40,
    height: 5,
    borderRadius: 2.5,
    marginTop: 10,
  },
  container: {
    flex: 1,
  },
  poiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  poiTitle: {
    color: colors.black,
    fontSize: 20,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  poiSubtitle: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: typography.secondary.medium,
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 8,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    height: 95,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  iconContainer: {
    marginBottom: 4,
  },
  actionCardLabel: {
    color: colors.muted,
    fontSize: 10,
    fontFamily: typography.secondary.bold,
  },
  actionCardLabelPrimary: {
    color: colors.solar[900],
    fontSize: 10,
    fontFamily: typography.secondary.bold,
  },
  actionCardValue: {
    color: colors.black,
    fontSize: 15,
    fontFamily: typography.primary.bold,
    marginTop: 1,
  },
  actionCardValuePrimary: {
    color: colors.solar[900],
    fontSize: 15,
    fontFamily: typography.primary.bold,
    marginTop: 1,
  },
  photoList: {
    gap: 12,
    paddingRight: 20,
  },
  photo: {
    width: 260,
    height: 160,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 24,
    fontFamily: typography.secondary.regular,
  },
  premiumBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    pointerEvents: 'none',
  },
});
