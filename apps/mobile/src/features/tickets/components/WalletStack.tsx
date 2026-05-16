import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolation,
  FadeIn,
  SharedValue,
} from 'react-native-reanimated';
import { Ticket } from '../../../types/models/auth';
import { TicketCard } from './TicketCard';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUnclaimTicket } from '../../auth/hooks/useAuthActions';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';
import { Trash2 } from 'lucide-react-native';

const { height } = Dimensions.get('window');
const STACK_OFFSET = 60;
const EXPANDED_OFFSET = 180;

interface WalletStackProps {
  tickets: Ticket[];
}

interface WalletItemProps {
  ticket: Ticket;
  index: number;
  totalTickets: number;
  isExpanded: boolean;
  selectedTicketId: string | number | null;
  expandProgress: SharedValue<number>;
  handleSelectTicket: (ticket: Ticket) => void;
  toggleExpand: () => void;
}

const WalletItem: React.FC<WalletItemProps> = ({
  ticket,
  index,
  totalTickets,
  isExpanded,
  selectedTicketId,
  expandProgress,
  handleSelectTicket,
  toggleExpand,
}) => {
  const isSelected = selectedTicketId === ticket.id;
  const isAnySelected = selectedTicketId !== null;

  const animatedStyle = useAnimatedStyle(() => {
    if (isSelected) {
      return {
        transform: [
          { translateY: withSpring(0) },
          { scale: withSpring(1) }
        ],
        opacity: withTiming(1),
      };
    }

    if (isAnySelected) {
      return {
        transform: [{ translateY: withSpring(height) }],
        opacity: withTiming(0),
      };
    }

    const translateY = interpolate(
      expandProgress.value,
      [0, 1],
      [index * STACK_OFFSET, index * EXPANDED_OFFSET],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      expandProgress.value,
      [0, 1],
      [1 - (totalTickets - 1 - index) * 0.05, 1],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
      zIndex: index,
    };
  });

  return (
    <View style={[styles.pressable, isSelected && { position: 'relative', zIndex: 100 }]}>
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <TicketCard
          ticket={ticket}
          index={index}
          isSelected={isSelected}
          onCardPress={() => (isExpanded ? handleSelectTicket(ticket) : toggleExpand())}
        />
      </Animated.View>
    </View>
  );
};

export const WalletStack: React.FC<WalletStackProps> = ({ tickets }) => {
  const theme = useLatticeTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | number | null>(null);
  const expandProgress = useSharedValue(0);
  const { mutateAsync: unclaimTicket } = useUnclaimTicket();
  const isAnySelected = selectedTicketId !== null;

  const toggleExpand = () => {
    if (selectedTicketId) return; 
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    expandProgress.value = withSpring(newExpanded ? 1 : 0, theme.motion.physics.snappy);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    if (selectedTicketId === ticket.id) {
      setSelectedTicketId(null);
    } else {
      setSelectedTicketId(ticket.id);
    }
  };

  const handleUnclaim = (ticketId: number) => {
    Alert.alert(
      'Eliminar Ticket',
      '¿Estás seguro de que quieres eliminar esta entrada de tu Wallet?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await unclaimTicket(String(ticketId));
              setSelectedTicketId(null);
            } catch (e) {
              Alert.alert('Error', 'No se ha podido eliminar la entrada.');
            }
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.stackContainer}>
        {tickets.map((ticket, index) => (
          <WalletItem
            key={ticket.id}
            ticket={ticket}
            index={index}
            totalTickets={tickets.length}
            isExpanded={isExpanded}
            selectedTicketId={selectedTicketId}
            expandProgress={expandProgress}
            handleSelectTicket={handleSelectTicket}
            toggleExpand={toggleExpand}
          />
        ))}
      </View>

      {isAnySelected && (
        <Animated.View entering={FadeIn} style={styles.actionsContainer}>
          <Pressable 
            onPress={() => setSelectedTicketId(null)}
            style={[styles.backButton, { backgroundColor: theme.colors.glass.background }]}
          >
            <Text style={[styles.backText, { color: theme.colors.text.primary }]}>Volver al Wallet</Text>
          </Pressable>

          <Pressable 
            onPress={() => handleUnclaim(Number(selectedTicketId))}
            style={styles.unclaimButton}
          >
            <Trash2 size={20} color={theme.colors.status.error} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  pressable: {
    width: '100%',
    position: 'absolute',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  unclaimButton: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255,59,48,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,59,48,0.2)',
  },
});
