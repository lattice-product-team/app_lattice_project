import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
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
  
  return (
    <View style={styles.container}>
      
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
    paddingTop: 8,
    paddingBottom: 20,
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
  textContainer: {
    alignItems: 'center',
    marginTop: -8,
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
