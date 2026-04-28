import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SaveLocationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isLoading?: boolean;
}

export const SaveLocationModal = ({ 
  isVisible, 
  onClose, 
  onSave,
  isLoading 
}: SaveLocationModalProps) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        </Pressable>

        <Animated.View 
          entering={ZoomIn} 
          exiting={FadeOut}
          style={styles.modalView}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Feather name="map-pin" size={32} color="#E10600" />
            </View>
          </View>

          <Text style={styles.modalTitle}>Guardar ubicación</Text>
          <Text style={styles.modalSubtitle}>Dale un nombre a este marcador para encontrarlo más tarde.</Text>

          <TextInput
            style={styles.input}
            placeholder="Ej: Mi tribuna favorita..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            value={name}
            onChangeText={setName}
            autoFocus
            selectionColor="#E10600"
          />

          <View style={styles.buttonRow}>
            <Pressable 
              style={[styles.button, styles.buttonCancel]} 
              onPress={onClose}
            >
              <Text style={styles.textCancel}>Cancelar</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.button, 
                styles.buttonSave,
                !name.trim() && styles.buttonDisabled
              ]} 
              onPress={handleSave}
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.textSave}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalView: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#1C1C1E',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 20,
    color: 'white',
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  buttonSave: {
    backgroundColor: '#E10600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textCancel: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  textSave: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  }
});
