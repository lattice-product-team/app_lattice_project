import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  useFonts as useOutfitFonts,
} from '@expo-google-fonts/outfit';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts as useJakartaFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts as useInterFonts,
} from '@expo-google-fonts/inter';
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_700Bold,
  useFonts as useCormorantFonts,
} from '@expo-google-fonts/cormorant-garamond';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { typography } from '../styles/typography';

export function useAppFonts() {
  const [outfitLoaded, outfitError] = useOutfitFonts({
    [typography.primary.regular]: Outfit_400Regular,
    [typography.primary.medium]: Outfit_500Medium,
    [typography.primary.semibold]: Outfit_600SemiBold,
    [typography.primary.bold]: Outfit_700Bold,
  });

  const [jakartaLoaded, jakartaError] = useJakartaFonts({
    [typography.secondary.regular]: PlusJakartaSans_400Regular,
    [typography.secondary.medium]: PlusJakartaSans_500Medium,
    [typography.secondary.bold]: PlusJakartaSans_700Bold,
    [typography.secondary.extraBold]: PlusJakartaSans_800ExtraBold,
  });

  const [interLoaded, interError] = useInterFonts({
    [typography.sans.regular]: Inter_400Regular,
    [typography.sans.medium]: Inter_500Medium,
    [typography.sans.semibold]: Inter_600SemiBold,
    [typography.sans.bold]: Inter_700Bold,
  });

  const [cormorantLoaded, cormorantError] = useCormorantFonts({
    [typography.serif.light]: CormorantGaramond_300Light,
    [typography.serif.regular]: CormorantGaramond_400Regular,
    [typography.serif.medium]: CormorantGaramond_500Medium,
    [typography.serif.bold]: CormorantGaramond_700Bold,
  });

  const loaded = outfitLoaded && jakartaLoaded && interLoaded && cormorantLoaded;
  const error = outfitError || jakartaError || interError || cormorantError;

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { loaded, error };
}
