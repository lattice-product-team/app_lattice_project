import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';

interface SheetHeaderProps {
  title: string;
  subtitle: string;
  logoUrl?: string;
  categoryIcon?: string;
  onClose: () => void;
  onShare?: () => void;
}

export const SheetHeader = ({
  title,
  subtitle,
  logoUrl,
  categoryIcon,
  onClose,
  onShare,
}: SheetHeaderProps) => {
  const theme = useAppTheme();
  
  // Reference background: Dark navy/midnight
  const bgColor = '#0B1B32';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <LinearGradient
        colors={[bgColor, 'rgba(11, 27, 50, 0.7)', 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Top Actions Bar */}
      <View style={styles.topActions}>
        <Pressable 
          onPress={onShare} 
          style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
        >
          <Feather name="upload" size={20} color="white" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pressable 
          onPress={onClose} 
          style={[styles.actionCircle, { backgroundColor: 'rgba(255,255,255,0.15)' }]}
        >
          <Feather name="x" size={20} color="white" />
        </Pressable>
      </View>

      {/* Main Branding Section */}
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          {logoUrl ? (
            <Image 
              source={{ uri: logoUrl }} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          ) : (
            <View style={styles.iconPlaceholder}>
              <MaterialCommunityIcons 
                name={(categoryIcon as any) || 'map-marker'} 
                size={40} 
                color="white" 
              />
            </View>
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    zIndex: 10,
  },
  actionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  logo: {
    width: '80%',
    height: '80%',
  },
  iconPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A73E8', // Brand blue fallback
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontFamily: typography.primary.bold,
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: typography.primary.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
