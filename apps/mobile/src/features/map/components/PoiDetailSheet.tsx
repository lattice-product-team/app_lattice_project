import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StandardUIPOI } from '../../../types/models/poi';
import { RouteGeoJSON } from '../../../types';
import { useNavigationStore } from '../../navigation/store/useNavigationStore';
import { Image } from 'expo-image';
import { getCategoryMetadata } from '../../../utils/poiUtils';
import { typography } from '../../../styles/typography';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { colors as primitiveColors } from '@app/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PoiDetailSheetProps {
  poi: StandardUIPOI | null;
  route?: RouteGeoJSON | null;
  onClose: () => void;
  translateY: SharedValue<number>;
}

const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return (
    <SafeBlurView intensity={85} tint="dark" style={[style, styles.blurBackground]}>
      <View style={styles.innerGlowBorder} />
    </SafeBlurView>
  );
};

export const PoiDetailSheet = React.forwardRef<BottomSheet, PoiDetailSheetProps>(
  ({ poi, onClose, translateY }: PoiDetailSheetProps, ref) => {
    const theme = useLatticeTheme();
    const insets = useSafeAreaInsets();
    const { setNavigating, routeMetadata } = useNavigationStore();

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
        handleIndicatorStyle={[
          styles.handleIndicator,
          { backgroundColor: 'rgba(255,255,255,0.3)' }
        ]}
        handleStyle={styles.handle}
        animatedPosition={translateY}
        enablePanDownToClose
        onClose={onClose}
        onChange={(index) => {
          if (index >= 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        overDragResistanceFactor={0}
        style={styles.sheetContainer}
      >
        <View style={styles.container}>
          {/* Header (Fixed) */}
          <View style={styles.poiHeader}>
            <Pressable
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              style={styles.headerIconCircle}
            >
              <Feather name="share" size={20} color="white" />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.poiTitle} numberOfLines={1}>
                {poi.displayName}
              </Text>
              <Text style={[styles.poiSubtitle, { color: theme.colors.text.muted }]}>{metadata.label}</Text>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }}
              style={styles.headerIconCircle}
            >
              <Feather name="x" size={20} color="white" />
            </Pressable>
          </View>

          {/* Action Buttons Row (Fixed) */}
          <View style={styles.fixedActionArea}>
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
                  { backgroundColor: theme.colors.brand.primary },
                  !routeMetadata && { opacity: 0.6 },
                ]}
              >
                <MaterialCommunityIcons name="walk" size={28} color={theme.colors.text.inverse} />
                <Text style={[styles.actionCardValuePrimary, { color: theme.colors.text.inverse }]}>
                  {routeMetadata ? formatDuration(routeMetadata.duration) : '...'}
                </Text>
                <Text style={[styles.actionCardLabelPrimary, { color: theme.colors.text.inverse }]}>IR AHORA</Text>
              </Pressable>

              {/* Info Action: Distancia */}
              <View style={styles.actionCard}>
                <View style={styles.iconContainer}>
                  <Feather name="map-pin" size={18} color={theme.colors.text.muted} />
                </View>
                <Text style={styles.actionCardLabel}>Distancia</Text>
                <Text style={styles.actionCardValue}>
                  {routeMetadata ? formatDistance(routeMetadata.distance) : '...'}
                </Text>
              </View>

              {/* Info Action: Horario */}
              <View style={styles.actionCard}>
                <View style={styles.iconContainer}>
                  <Feather name="clock" size={18} color={theme.colors.text.muted} />
                </View>
                <Text style={styles.actionCardLabel}>Horario</Text>
                <Text style={[styles.actionCardValue, { color: theme.colors.status.success }]}>Abierto</Text>
              </View>
            </View>
          </View>

          <BottomSheetScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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

            {poi.description && <Text style={[styles.description, { color: theme.colors.text.muted }]}>{poi.description}</Text>}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  }
);

PoiDetailSheet.displayName = 'PoiDetailSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: Platform.OS === 'ios' ? 8 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  blurBackground: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    pointerEvents: 'none',
  },
  handleIndicator: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  handle: {
    paddingTop: 8,
    paddingBottom: 0,
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
    color: 'white',
    fontSize: 20,
    fontFamily: typography.primary.bold,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  poiSubtitle: {
    // color handled dynamically
    fontSize: 13,
    fontFamily: typography.secondary.medium,
    marginTop: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  fixedActionArea: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  actionCard: {
    flex: 1,
    height: 95,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  actionCardPrimary: {
    backgroundColor: primitiveColors.brand.primary,
    borderColor: 'transparent',
  },
  iconContainer: {
    marginBottom: 4,
  },
  actionCardLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    fontFamily: typography.secondary.bold,
  },
  actionCardLabelPrimary: {
    color: '#000000',
    fontSize: 10,
    fontFamily: typography.secondary.bold,
  },
  actionCardValue: {
    color: 'white',
    fontSize: 15,
    fontFamily: typography.primary.bold,
    marginTop: 1,
  },
  actionCardValuePrimary: {
    color: '#000000',
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
    fontSize: 14,
    lineHeight: 22,
    marginTop: 24,
    fontFamily: typography.secondary.regular,
  },
});
