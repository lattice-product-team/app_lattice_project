import * as React from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, ScrollView, Platform } from 'react-native';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { SafeBlurView } from '../../../components/ui/SafeBlurView';
import { Share as ShareIcon, X, Navigation, Ticket, Calendar } from 'lucide-react-native';
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

    const snapPoints = React.useMemo(() => [220, SCREEN_HEIGHT * 0.45, SCREEN_HEIGHT * 0.88], []);

    if (!poi) return null;

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        detached={true}
        bottomInset={insets.bottom + 20}
        backgroundComponent={CustomBackground}
        handleIndicatorStyle={[
          styles.handleIndicator,
          { backgroundColor: 'rgba(255,255,255,0.3)' },
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
              <ShareIcon size={20} color="white" strokeWidth={2.2} />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.poiTitle} numberOfLines={1}>
                {poi.displayName}
              </Text>
              <Text style={[styles.poiSubtitle, { color: theme.colors.text.muted }]}>
                {metadata.label}
              </Text>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
                onClose();
              }}
              style={styles.headerIconCircle}
            >
              <X size={20} color="white" strokeWidth={2.2} />
            </Pressable>
          </View>

          {/* Action Trident (Fixed) */}
          <View style={styles.fixedActionArea}>
            <View style={styles.tridentRow}>
              {/* Navigate */}
              <Pressable
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                  setNavigating(true);
                }}
                disabled={!routeMetadata}
                style={[
                  styles.tridentButton,
                  { backgroundColor: theme.colors.brand.primary },
                  !routeMetadata && { opacity: 0.6 },
                ]}
              >
                <Navigation size={24} color="#000" strokeWidth={2.5} />
                <Text style={styles.tridentLabelPrimary}>GO</Text>
              </Pressable>

              {/* Tickets */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log('Open Tickets');
                }}
                style={styles.tridentButtonSecondary}
              >
                <SafeBlurView intensity={20} style={styles.buttonBlur}>
                  <Ticket size={22} color={theme.colors.brand.primary} strokeWidth={2.2} />
                </SafeBlurView>
                <Text style={styles.tridentLabelSecondary}>TICKETS</Text>
              </Pressable>

              {/* Calendar */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log('Add to Calendar');
                }}
                style={styles.tridentButtonSecondary}
              >
                <SafeBlurView intensity={20} style={styles.buttonBlur}>
                  <Calendar size={22} color={theme.colors.brand.primary} strokeWidth={2.2} />
                </SafeBlurView>
                <Text style={styles.tridentLabelSecondary}>ADD</Text>
              </Pressable>
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

            {poi.description && (
              <Text style={[styles.description, { color: theme.colors.text.muted }]}>
                {poi.description}
              </Text>
            )}
          </BottomSheetScrollView>
        </View>
      </BottomSheet>
    );
  }
);

PoiDetailSheet.displayName = 'PoiDetailSheet';

const styles = StyleSheet.create({
  sheetContainer: {
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 20,
  },
  blurBackground: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 32,
    overflow: 'hidden',
  },
  innerGlowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
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
  tridentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    marginTop: 10,
    marginBottom: 8,
  },
  tridentButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tridentButtonSecondary: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBlur: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  tridentLabelPrimary: {
    fontSize: 10,
    fontFamily: typography.secondary.bold,
    color: '#000',
    marginTop: 4,
    position: 'absolute',
    bottom: -20,
  },
  tridentLabelSecondary: {
    fontSize: 10,
    fontFamily: typography.secondary.bold,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
    position: 'absolute',
    bottom: -20,
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
