import * as React from 'react';
import { View, Text, Pressable, Alert, Modal, ActivityIndicator, InteractionManager } from 'react-native';
import * as SafeAreaContext from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { authService } from '../../src/services/authService';
import { useRouter } from 'expo-router';
import { SettingItem } from '../../src/components/ui/SettingItem';
import { WalletStack } from '../../src/components/ui/WalletStack';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { ThemeGradient } from '../../src/components/ui/ThemeGradient';
import { authStyles } from '../../src/styles/typography';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useLocationStore } from '../../src/store/useLocationStore';
import { EventHistorySection } from '../../src/components/ui/EventHistorySection';
import { useEvents } from '../../src/hooks/queries/useEvents';
import { useLatticeTheme } from '../../src/hooks/useLatticeTheme';

/**
 * Main Profile Screen.
 * Handles user preferences, wallet, and account settings.
 */
export default function ProfileScreen() {
  const { user, tickets, logout, updateUser } = useAuthStore();
  const router = useRouter();
  const theme = useLatticeTheme();
  
  const { 
    avoidStairs, 
    wheelchairAccess,
    avoidGrandstands,
    avoidSlopes,
    updatePreferences 
  } = useLocationStore();

  const { data: events } = useEvents();
  
  const [showWizard, setShowWizard] = React.useState(false);
  const [showWallet, setShowWallet] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleLogout = () => {
    router.replace('/(auth)/welcome');
    InteractionManager.runAfterInteractions(() => {
      logout();
    });
  };

  const savePreferences = async (prefs: { 
    avoidStairs?: boolean, 
    wheelchairAccess?: boolean,
    avoidGrandstands?: boolean,
    avoidSlopes?: boolean 
  }) => {
    updatePreferences(prefs);
    
    if (user) {
      setIsSaving(true);
      try {
        const updatedUser = await authService.updateMe(prefs);
        updateUser(updatedUser);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to sync preferences to backend:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleWizardNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      setShowWizard(false);
      setWizardStep(1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ThemeGradient variant="midnight" />
      
      <AuthLayout 
        showBack 
        onBack={() => router.replace('/(main)')}
      >
        <Animated.View 
          entering={FadeInDown.duration(600)}
          layout={Layout.springify()}
          className="flex-1"
        >
          {/* Profile Header */}
          <View className="items-start mb-16 pt-4">
            <Animated.View 
              entering={FadeInDown.delay(100).duration(600)}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.colors.glass.subtle,
                borderWidth: 1,
                borderColor: theme.colors.glass.subtleBorder,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 40,
              }}
            >
              <Feather name="user" size={40} color={theme.colors.text.primary} />
            </Animated.View>
            
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(600)}
              className="mb-4"
              style={[authStyles.title, { color: theme.colors.text.primary }]}
            >
              {user ? user.fullName : 'El meu Perfil'}
            </Animated.Text>
            
            <Animated.Text 
              entering={FadeInDown.delay(300).duration(600)}
              className="pr-8"
              style={[authStyles.subtitle, { color: theme.colors.text.secondary }]}
            >
              {user ? user.email || `@${user.fullName.replace(/\s+/g, '').toLowerCase()}` : 'Compte de convidat'}
            </Animated.Text>
          </View>

          <Animated.View 
            entering={FadeInDown.delay(400).duration(600)}
            className="gap-y-5 mb-12"
          >
            <PremiumButton 
              onPress={() => Alert.alert('Info', 'Próximamente disponible!')}
              label="EDITAR PERFIL"
              variant="primary"
            />
            
            <PremiumButton 
              onPress={() => {
                if (tickets && tickets.length > 0) {
                  setShowWallet(true);
                } else {
                  router.push('/(main)/scan' as any);
                }
              }}
              label={tickets && tickets.length > 0 ? "MIS ENTRADAS" : "VINCULAR ENTRADA"}
              variant="glass"
              icon="tag-outline"
            />
          </Animated.View>

          {/* Event History Section */}
          <Animated.View entering={FadeInDown.delay(450).duration(600)}>
            <EventHistorySection events={events?.slice(0, 3) || []} />
          </Animated.View>

          {/* Settings Section */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(600)}
            className="mb-12"
          >
            <View 
              style={{
                backgroundColor: theme.colors.glass.subtle,
                borderWidth: 1,
                borderColor: theme.colors.glass.subtleBorder,
                borderRadius: 32,
                overflow: 'hidden',
              }}
            >
              <View 
                style={{
                  paddingHorizontal: 24,
                  paddingVertical: 20,
                  backgroundColor: theme.colors.bg.elevation,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border.subtle,
                }}
              >
                <Text 
                  style={{
                    color: theme.colors.text.muted,
                    fontSize: 12,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  Configuración
                </Text>
              </View>

              <SettingItem 
                label="Rutas y Accesibilidad"
                icon="settings"
                secondaryText="Ajustar preferencias"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowWizard(true);
                }}
                iconBgColor={theme.colors.status.errorSurface}
              />

              <SettingItem 
                label="Apariencia"
                icon="package"
                iconBgColor={theme.colors.overlay.thin}
                onPress={() => Alert.alert('Info', 'Próximamente disponible!')}
              />

              <SettingItem 
                label="Cerrar sesión"
                icon="log-out"
                destructive
                onPress={handleLogout}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </AuthLayout>

      {/* Wallet Modal */}
      <Modal
        visible={showWallet}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowWallet(false)}
      >
        <SafeAreaContext.SafeAreaView 
          style={{ flex: 1, backgroundColor: theme.colors.bg.main }}
        >
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text style={{ color: theme.colors.text.primary, fontSize: 30, fontWeight: '900' }}>Mis Entradas</Text>
            <View className="flex-row gap-x-3">
              <Pressable 
                onPress={() => {
                  setShowWallet(false);
                  router.push('/(main)/scan' as any);
                }}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.brand.primary,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="plus" size={24} color={theme.colors.text.inverse} />
              </Pressable>
              <Pressable 
                onPress={() => setShowWallet(false)}
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: theme.colors.glass.background,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="x" size={24} color={theme.colors.text.primary} />
              </Pressable>
            </View>
          </View>
          
          <View className="flex-1 px-6">
            <WalletStack tickets={tickets} />
          </View>
        </SafeAreaContext.SafeAreaView>
      </Modal>

      {/* Preferences Wizard Modal */}
      <Modal
        visible={showWizard}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWizard(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.colors.overlay.modal, justifyContent: 'end' }}>
          <View 
            style={{ 
              backgroundColor: theme.colors.bg.surface, 
              borderTopLeftRadius: 40, 
              borderTopRightRadius: 40, 
              padding: 32, 
              paddingBottom: 48,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border.subtle,
            }}
          >
            <View className="items-center mb-8">
              <View 
                style={{ 
                  width: 48, 
                  height: 6, 
                  backgroundColor: theme.colors.border.subtle, 
                  borderRadius: 3, 
                  marginBottom: 32 
                }} 
              />
              
              <View className="flex-row gap-x-2 mb-8">
                <View style={{ height: 6, borderRadius: 3, flex: 1, backgroundColor: wizardStep >= 1 ? theme.colors.brand.primary : theme.colors.bg.elevation }} />
                <View style={{ height: 6, borderRadius: 3, flex: 1, backgroundColor: wizardStep >= 2 ? theme.colors.brand.primary : theme.colors.bg.elevation }} />
                <View style={{ height: 6, borderRadius: 3, flex: 1, backgroundColor: wizardStep >= 3 ? theme.colors.brand.primary : theme.colors.bg.elevation }} />
              </View>
            </View>

            <Animated.View 
              key={wizardStep}
              entering={FadeInDown.duration(400)}
              className="items-center"
            >
              {wizardStep === 1 && (
                <View className="items-center w-full">
                  <View 
                    style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 24, 
                      backgroundColor: theme.colors.brand.primarySurface, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 24 
                    }}
                  >
                    <MaterialCommunityIcons name="stairs" size={40} color={theme.colors.brand.primary} />
                  </View>
                  <Text style={{ color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>¿Evitar escaleras?</Text>
                  <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 40, fontSize: 16 }}>Priorizaremos rutas con rampas y ascensores para tu comodidad.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { savePreferences({ avoidStairs: false }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: !avoidStairs ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: !avoidStairs ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: !avoidStairs ? theme.colors.text.inverse : theme.colors.text.secondary }}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { savePreferences({ avoidStairs: true }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: avoidStairs ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: avoidStairs ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: avoidStairs ? theme.colors.text.inverse : theme.colors.text.secondary }}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 2 && (
                <View className="items-center w-full">
                  <View 
                    style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 24, 
                      backgroundColor: theme.colors.brand.primarySurface, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 24 
                    }}
                  >
                    <MaterialCommunityIcons name="layers-outline" size={40} color={theme.colors.brand.primary} />
                  </View>
                  <Text style={{ color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>¿Evitar graderías?</Text>
                  <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 40, fontSize: 16 }}>Evitaremos pasar por zonas de gradas siempre que sea posible.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { savePreferences({ avoidGrandstands: false }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: !avoidGrandstands ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: !avoidGrandstands ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: !avoidGrandstands ? theme.colors.text.inverse : theme.colors.text.secondary }}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { savePreferences({ avoidGrandstands: true }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: avoidGrandstands ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: avoidGrandstands ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: avoidGrandstands ? theme.colors.text.inverse : theme.colors.text.secondary }}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 3 && (
                <View className="items-center w-full">
                  <View 
                    style={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: 24, 
                      backgroundColor: theme.colors.brand.primarySurface, 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      marginBottom: 24 
                    }}
                  >
                    <MaterialCommunityIcons name="slope-uphill" size={40} color={theme.colors.brand.primary} />
                  </View>
                  <Text style={{ color: theme.colors.text.primary, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>¿Evitar pendientes?</Text>
                  <Text style={{ color: theme.colors.text.secondary, textAlign: 'center', marginBottom: 40, fontSize: 16 }}>Buscaremos los caminos más llanos dentro del recinto.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { savePreferences({ avoidSlopes: false }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: !avoidSlopes ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: !avoidSlopes ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: !avoidSlopes ? theme.colors.text.inverse : theme.colors.text.secondary }}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { savePreferences({ avoidSlopes: true }); handleWizardNext(); }}
                      style={{
                        flex: 1,
                        height: 56,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        backgroundColor: avoidSlopes ? theme.colors.brand.primary : theme.colors.bg.elevation,
                        borderColor: avoidSlopes ? theme.colors.brand.primary : theme.colors.border.subtle,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', fontSize: 18, color: avoidSlopes ? theme.colors.text.inverse : theme.colors.text.secondary }}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Animated.View>
            
            <Pressable 
              onPress={() => setShowWizard(false)}
              className="mt-8 items-center"
            >
              <Text style={{ color: theme.colors.text.muted, fontWeight: '500' }}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {isSaving && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: theme.colors.overlay.modal, justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <ActivityIndicator size="large" color={theme.colors.brand.primary} />
        </View>
      )}
    </View>
  );
}

