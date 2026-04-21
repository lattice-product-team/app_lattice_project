import * as React from 'react';
import { View, Text, Pressable, Alert, Modal, ActivityIndicator, InteractionManager } from 'react-native';
import * as SafeAreaContext from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { authService } from '../../src/services/authService';
import { colors } from '../../src/styles/colors';
import { useRouter } from 'expo-router';
import { SettingItem } from '../../src/components/ui/SettingItem';
import { WalletStack } from '../../src/components/ui/WalletStack';
import { AuthLayout } from '../../src/components/ui/AuthLayout';
import { PremiumButton } from '../../src/components/ui/PremiumButton';
import { ThemeGradient } from '../../src/components/ui/ThemeGradient';
import { authStyles } from '../../src/styles/typography';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

/**
 * Main Profile Screen.
 * Handles user preferences, wallet, and account settings.
 */
function ProfileScreen() {
  const { user, token, tickets, logout, setAuth } = useAuthStore();
  const router = useRouter();
  
  // Local state for toggles and wizard
  const [avoidStairs, setAvoidStairs] = React.useState(user?.avoidStairs ?? false);
  const [avoidGrandstands, setAvoidGrandstands] = React.useState(user?.avoidGrandstands ?? false);
  const [avoidSlopes, setAvoidSlopes] = React.useState(user?.avoidSlopes ?? false);
  
  const [showWizard, setShowWizard] = React.useState(false);
  const [showWallet, setShowWallet] = React.useState(false);
  const [wizardStep, setWizardStep] = React.useState(1);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setAvoidStairs(user.avoidStairs ?? false);
      setAvoidGrandstands(user.avoidGrandstands ?? false);
      setAvoidSlopes(user.avoidSlopes ?? false);
    }
  }, [user]);

  const handleLogout = () => {
    // 1. Navigate first to the welcome screen
    router.replace('/(auth)/welcome');
    
    // 2. Clear state ONLY after navigation is complete
    // This prevents Fabric from trying to recycle views that are still animating
    InteractionManager.runAfterInteractions(() => {
      logout();
    });
  };

  const savePreferences = async (prefs: { avoidStairs?: boolean, avoidGrandstands?: boolean, avoidSlopes?: boolean }) => {
    if (!token || !user) return;
    
    setIsSaving(true);
    try {
      const updatedUser = await authService.updateMe(prefs, token);
      setAuth(token, updatedUser);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'No se han podido guardar las preferencias.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleWizardNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      savePreferences({ avoidStairs, avoidGrandstands, avoidSlopes });
      setShowWizard(false);
      setWizardStep(1);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ThemeGradient 
        variant="premium" 
        showBlob={true}
      />
      
      <AuthLayout 
        showBack 
        onBack={() => router.replace('/(main)')}
        transparent
      >
        <Animated.View 
          entering={FadeInDown.duration(600)}
          layout={Layout.springify()}
          className="flex-1"
        >
          {/* Profile Header - Replicated Welcome Style */}
          <View className="items-start mb-16 pt-4">
            <Animated.View 
              entering={FadeInDown.delay(100).duration(600)}
              className="w-20 h-20 rounded-[28px] bg-white items-center justify-center mb-10 shadow-2xl"
            >
              <Feather name="user" size={40} color="#000" />
            </Animated.View>
            
            <Animated.Text 
              entering={FadeInDown.delay(200).duration(600)}
              className="text-white mb-4"
              style={authStyles.title}
            >
              {user ? user.fullName : 'El meu Perfil'}
            </Animated.Text>
            
            <Animated.Text 
              entering={FadeInDown.delay(300).duration(600)}
              className="text-white/50 pr-8"
              style={authStyles.subtitle}
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
              variant="white"
            />
            
            <PremiumButton 
              onPress={() => {
                if (tickets && tickets.length > 0) {
                  setShowWallet(true);
                } else {
                  router.push('/scan' as any);
                }
              }}
              label={tickets && tickets.length > 0 ? "MIS ENTRADAS" : "VINCULAR ENTRADA"}
              variant="glass"
              icon="tag-outline"
            />
          </Animated.View>

          {/* Settings Section */}
          <Animated.View 
            entering={FadeInDown.delay(500).duration(600)}
            className="mb-12"
          >
            <View className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
              <View className="px-6 py-5 bg-white/5 border-b border-white/5">
                <Text className="text-white/30 text-xs font-bold uppercase tracking-[2px]">Configuración</Text>
              </View>

              <SettingItem 
                label="Rutas y Accesibilidad"
                icon="settings"
                secondaryText="Ajustar preferencias"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setShowWizard(true);
                }}
                iconBgColor="rgba(255, 59, 48, 0.1)"
              />

              <SettingItem 
                label="Apariencia"
                icon="package"
                iconBgColor="rgba(255, 255, 255, 0.1)"
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
        <SafeAreaContext.SafeAreaView className="flex-1 bg-background">
          <View className="flex-row items-center justify-between px-6 py-4">
            <Text className="text-white text-3xl font-black">Mis Entradas</Text>
            <View className="flex-row gap-x-3">
              <Pressable 
                onPress={() => {
                  setShowWallet(false);
                  router.push('/scan' as any);
                }}
                className="w-10 h-10 bg-primary rounded-full items-center justify-center"
              >
                <Feather name="plus" size={24} color="white" />
              </Pressable>
              <Pressable 
                onPress={() => setShowWallet(false)}
                className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
              >
                <Feather name="x" size={24} color="white" />
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
        <View className="flex-1 bg-black/90 justify-end">
          <View className="bg-[#1C1C1E] rounded-t-[40px] p-8 pb-12 border-t border-white/10">
            <View className="items-center mb-8">
              <View className="w-12 h-1.5 bg-white/20 rounded-full mb-8" />
              
              <View className="flex-row gap-x-2 mb-8">
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 1 ? 'bg-primary' : 'bg-white/10'}`} />
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 2 ? 'bg-primary' : 'bg-white/10'}`} />
                <View className={`h-1.5 rounded-full flex-1 ${wizardStep >= 3 ? 'bg-primary' : 'bg-white/10'}`} />
              </View>
            </View>

            <Animated.View 
              key={wizardStep}
              entering={FadeInDown.duration(400)}
              className="items-center"
            >
              {wizardStep === 1 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="stairs" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar escaleras?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Priorizaremos rutas con rampas y ascensores para tu comodidad.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidStairs(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidStairs ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidStairs ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidStairs(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidStairs ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidStairs ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 2 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="layers-outline" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar graderías?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Evitaremos pasar por zonas de gradas siempre que sea posible.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidGrandstands(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidGrandstands ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidGrandstands ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidGrandstands(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidGrandstands ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidGrandstands ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {wizardStep === 3 && (
                <View className="items-center w-full">
                  <View className="w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6">
                    <MaterialCommunityIcons name="slope-uphill" size={40} color={colors.primary} />
                  </View>
                  <Text className="text-white text-2xl font-bold text-center mb-4">¿Evitar pendientes?</Text>
                  <Text className="text-muted text-center mb-10 text-base">Buscaremos los caminos más llanos dentro del recinto.</Text>
                  
                  <View className="flex-row gap-x-4 w-full">
                    <Pressable 
                      onPress={() => { setAvoidSlopes(false); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${!avoidSlopes ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${!avoidSlopes ? 'text-white' : 'text-white/60'}`}>No</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => { setAvoidSlopes(true); handleWizardNext(); }}
                      className={`flex-1 h-14 rounded-2xl items-center justify-center border ${avoidSlopes ? 'bg-primary border-primary' : 'bg-white/5 border-white/10'}`}
                    >
                      <Text className={`font-bold text-lg ${avoidSlopes ? 'text-white' : 'text-white/60'}`}>Sí</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            </Animated.View>
            
            <Pressable 
              onPress={() => setShowWizard(false)}
              className="mt-8 items-center"
            >
              <Text className="text-white/40 font-medium">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {isSaving && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
}

export default ProfileScreen;
