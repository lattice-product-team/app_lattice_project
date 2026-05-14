import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Search, XCircle, Mic } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSpring, 
  withSequence, 
  withTiming,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Voice from '@react-native-voice/voice';
import { useMicrophonePermissions } from 'expo-camera';
import { NativeModules } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';
import { UserAvatar } from './UserAvatar';
import { typography } from '../../styles/typography';

interface FloatingSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onProfilePress?: () => void;
  onPress?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  avatarUrl?: string | null;
  isGuest?: boolean;
  editable?: boolean;
  onMicPress?: () => void;
}

export const FloatingSearchBar = React.memo(
  React.forwardRef<TextInput, FloatingSearchBarProps>(
    (
      {
        value,
        onChangeText,
        onFocus,
        onProfilePress,
        onPress,
        onSubmit,
        placeholder = 'Search events, stages, food...',
        avatarUrl,
        isGuest,
        editable = true,
        onMicPress,
      },
      ref
    ) => {
      const theme = useAppTheme();
      const [isListening, setIsListening] = React.useState(false);
      const [permission, requestPermission] = useMicrophonePermissions();
      const pulseValue = useSharedValue(1);

      // Use a ref for onChangeText to keep listeners stable without re-registering
      const onChangeTextRef = React.useRef(onChangeText);
      React.useEffect(() => {
        onChangeTextRef.current = onChangeText;
      }, [onChangeText]);

      // Setup Speech Recognition - Only once on mount
      React.useEffect(() => {
        console.log('[Voice] Initializing listeners...');
        
        Voice.onSpeechStart = (e: any) => {
          console.log('[Voice] === EVENT: onSpeechStart ===', e);
          setIsListening(true);
        };

        Voice.onSpeechEnd = (e: any) => {
          console.log('[Voice] === EVENT: onSpeechEnd ===', e);
          setIsListening(false);
          pulseValue.value = withSpring(1);
        };

        Voice.onSpeechResults = (e: any) => {
          console.log('[Voice] === EVENT: onSpeechResults ===', e.value);
          if (e.value && e.value.length > 0) {
            onChangeTextRef.current(e.value[0]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        };

        Voice.onSpeechError = (e: any) => {
          console.error('[Voice] === EVENT: onSpeechError ===', e.error);
          setIsListening(false);
          pulseValue.value = withSpring(1);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        };

        return () => {
          console.log('[Voice] Cleaning up listeners...');
          try {
            if (Voice) {
              Voice.onSpeechStart = undefined;
              Voice.onSpeechEnd = undefined;
              Voice.onSpeechResults = undefined;
              Voice.onSpeechError = undefined;
              
              Voice.destroy().then(() => {
                console.log('[Voice] Destroyed successfully');
              }).catch((err) => {
                console.log('[Voice] Destroy error (ignored):', err);
              });
            }
          } catch (e) {
            console.log('[Voice] Cleanup error suppressed:', e);
          }
        };
      }, []);

      const isOperationInProgress = React.useRef(false);

      const startListening = React.useCallback(async () => {
        if (!Voice || isOperationInProgress.current) return;
        
        try {
          isOperationInProgress.current = true;
          const currentPermission = await requestPermission();
          if (!currentPermission.granted) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
          }

          await new Promise(resolve => setTimeout(resolve, 1000));

          if (onMicPress) onMicPress();
          
          await Voice.start();
          setIsListening(true);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (e) {
          console.error('[Voice] Critical start error:', e);
          setIsListening(false);
        } finally {
          isOperationInProgress.current = false;
        }
      }, [onMicPress, requestPermission]);

      const stopListening = React.useCallback(async () => {
        if (!Voice || isOperationInProgress.current) return;

        try {
          isOperationInProgress.current = true;
          await Voice.stop();
          setIsListening(false);
          pulseValue.value = withSpring(1);
        } catch (e) {
          console.error('Failed to stop Voice:', e);
        } finally {
          isOperationInProgress.current = false;
        }
      }, [pulseValue]);

      const toggleListening = React.useCallback(async () => {
        if (isListening) {
          await stopListening();
        } else {
          await startListening();
        }
      }, [isListening, startListening, stopListening]);

      const micAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseValue.value }],
        opacity: interpolate(pulseValue.value, [1, 1.3], [0.9, 1]),
      }));

      const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(pulseValue.value, [1, 1.3], [1, 2]) }],
        opacity: interpolate(pulseValue.value, [1, 1.3], [0.3, 0]),
      }));

      return (
        <View style={styles.innerContainer}>
          <Search size={20} color={theme.colors.text.primary} strokeWidth={2.2} style={styles.icon} />

          <Pressable
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={onPress}
            disabled={editable}
          >
            <TextInput
              ref={ref}
              value={value}
              onChangeText={onChangeText}
              onFocus={onFocus}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, { color: theme.colors.text.primary }]}
              selectionColor={theme.colors.brand.primary}
              returnKeyType="search"
              onSubmitEditing={onSubmit}
              editable={editable}
              pointerEvents={editable ? 'auto' : 'none'}
            />
          </Pressable>

          {value.length > 0 && (
            <Pressable onPress={() => onChangeText('')} style={styles.clearButton}>
              <XCircle size={18} color={theme.colors.text.muted} strokeWidth={2.2} />
            </Pressable>
          )}

          <View style={styles.rightActions}>
            <View style={styles.micContainer}>
              {isListening && (
                <Animated.View 
                  style={[
                    styles.micRing, 
                    { backgroundColor: theme.colors.brand.primary },
                    ringStyle
                  ]} 
                />
              )}
              <Pressable 
                style={styles.micButton}
                onPress={toggleListening}
              >
                <Animated.View style={micAnimatedStyle}>
                  <Mic 
                     size={22} 
                     color={isListening ? theme.colors.brand.primary : theme.colors.text.primary} 
                     strokeWidth={isListening ? 3 : 2.2} 
                  />
                </Animated.View>
              </Pressable>
            </View>

            <View style={[styles.verticalDivider, { backgroundColor: theme.colors.border.subtle }]} />

            <Pressable style={styles.profileButton} onPress={onProfilePress}>
              <UserAvatar size={32} url={avatarUrl} isGuest={isGuest} />
            </Pressable>
          </View>
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 12,
    opacity: 0.8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: typography.secondary.medium,
    paddingVertical: 0,
    letterSpacing: -0.2,
  },
  clearButton: {
    padding: 4,
    marginRight: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  micRing: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  micButton: {
    padding: 4,
    zIndex: 10,
  },
  verticalDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 4,
  },
  profileButton: {
    padding: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
});
