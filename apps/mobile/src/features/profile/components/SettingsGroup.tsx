import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'expo-router';

interface SettingsItemProps {
  icon: string;
  label: string;
  value?: string;
  isLast?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

const SettingsItem = ({ icon, label, value, isLast, onPress, destructive }: SettingsItemProps) => {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? theme.colors.interactive.pressed : 'transparent',
      })}
    >
      <View style={styles.itemContainer}>
        <View style={styles.iconBox}>
          <Feather
            name={icon as any}
            size={20}
            color={destructive ? theme.colors.status.error : theme.colors.brand.primary}
          />
        </View>

        <View style={styles.contentRow}>
          <Text
            style={[
              styles.label,
              { color: destructive ? theme.colors.status.error : theme.colors.text.primary },
            ]}
          >
            {label}
          </Text>
          <View style={styles.rightSide}>
            {value && (
              <Text style={[styles.value, { color: theme.colors.text.muted }]}>{value}</Text>
            )}
            <Feather name="chevron-right" size={18} color={theme.colors.text.muted} />
          </View>
        </View>

        {!isLast && (
          <View
            style={[
              styles.separator,
              {
                backgroundColor: theme.colors.border.subtle,
                position: 'absolute',
                bottom: 0,
                right: 0,
                left: 62,
              },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
};

export const SettingsGroup = () => {
  const theme = useAppTheme();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro de que quieres salir de Lattice?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          useAuthStore.getState().logout();
        },
      },
    ]);
  };

  const handlePress = (label: string) => {
    console.log(`Setting ${label} pressed`);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.groupTitle, { color: theme.colors.text.muted }]}>
        Cuenta y Seguridad
      </Text>

      <View style={[styles.groupCard, { backgroundColor: theme.colors.bg.surface }]}>
        <SettingsItem
          icon="user"
          label="Información Personal"
          onPress={() => handlePress('Información Personal')}
        />
        <SettingsItem
          icon="shield"
          label="Privacidad y Seguridad"
          onPress={() => handlePress('Privacidad y Seguridad')}
        />
        <SettingsItem
          icon="bell"
          label="Notificaciones"
          isLast
          onPress={() => handlePress('Notificaciones')}
        />
        <View style={[styles.cardBorder, { borderColor: theme.colors.glass.border }]} />
      </View>

      <Text style={[styles.groupTitle, { color: theme.colors.text.muted }]}>Soporte</Text>

      <View style={[styles.groupCard, { backgroundColor: theme.colors.bg.surface }]}>
        <SettingsItem
          icon="help-circle"
          label="Centro de Ayuda"
          onPress={() => handlePress('Centro de Ayuda')}
        />
        <SettingsItem
          icon="info"
          label="Términos de Servicio"
          isLast
          onPress={() => handlePress('Términos de Servicio')}
        />
        <View style={[styles.cardBorder, { borderColor: theme.colors.glass.border }]} />
      </View>

      <View style={[styles.groupCard, { backgroundColor: theme.colors.bg.surface, marginTop: 12 }]}>
        <SettingsItem
          icon="log-out"
          label="Cerrar Sesión"
          destructive
          isLast
          onPress={handleLogout}
        />
        <View style={[styles.cardBorder, { borderColor: theme.colors.glass.border }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  groupTitle: {
    fontSize: 13,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: 16,
    marginBottom: 12,
    marginTop: 32,
    opacity: 0.6,
  },
  groupCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    height: 60,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingRight: 16,
    marginLeft: 14,
  },
  label: {
    fontSize: 16,
    fontFamily: typography.primary.medium,
    letterSpacing: -0.3,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    fontFamily: typography.primary.regular,
  },
  separator: {
    height: 0.5,
    width: '100%',
  },
  cardBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    pointerEvents: 'none',
  },
});
