import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface QuickActionProps {
  icon: string;
  label: string;
  sublabel?: string;
  onPress: () => void;
  isRed?: boolean;
}

const QuickAction = ({ icon, label, sublabel, onPress, color }: QuickActionProps & { color: string }) => {
  const theme = useLatticeTheme();
  return (
    <View style={styles.actionItem}>
      <Pressable 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.actionButton,
          { 
            backgroundColor: pressed ? theme.colors.overlay.modal : theme.colors.overlay.thin,
            borderColor: pressed ? theme.colors.border.strong : theme.colors.border.subtle,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          }
        ]}
        className="items-center justify-center mb-2"
      >
        <Feather name={icon as any} size={24} color={color} />
      </Pressable>
      <Text style={[styles.actionLabel, { color: theme.colors.text.primary }]} numberOfLines={1}>{label}</Text>
      {sublabel ? (
        <Text style={[styles.actionSublabel, { color: theme.colors.text.secondary }]} numberOfLines={1}>{sublabel}</Text>
      ) : null}
    </View>
  );
};

export const QuickActions = () => {
  const theme = useLatticeTheme();
  
  return (
    <View style={styles.container}>
      <View className="flex-row items-center mb-4">
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Favoritos</Text>
        <Feather name="chevron-right" size={14} color={theme.colors.text.muted} className="ml-1 mt-0.5" />
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <QuickAction 
          icon="home" 
          label="Casa" 
          sublabel="Añadir" 
          color={theme.colors.status.info}
          onPress={() => console.log('Home pressed')} 
        />
        <QuickAction 
          icon="briefcase" 
          label="Trabajo" 
          sublabel="Añadir" 
          color={theme.colors.status.warning}
          onPress={() => console.log('Work pressed')} 
        />
        <QuickAction 
          icon="plus" 
          label="Añadir" 
          color={theme.colors.text.muted}
          onPress={() => console.log('Add pressed')} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingRight: 20,
  },
  actionItem: {
    minWidth: 70,
    alignItems: 'center',
    marginRight: 12,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 20, // Increased to 20px
    borderWidth: 1.5,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionSublabel: {
    fontSize: 10,
    marginTop: 1,
  },
});
