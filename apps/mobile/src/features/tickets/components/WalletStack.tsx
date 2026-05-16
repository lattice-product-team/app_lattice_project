import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Pressable, Text, Alert } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
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
    // 1. If this specific ticket is selected, it stays at the top
    if (isSelected) {
      return {
        transform: [
          { translateY: withSpring(0) },
          { scale: withSpring(1) }
        ],
        opacity: withSpring(1),
        zIndex: 100,
      };
    }

    // 2. If another ticket is selected, this one hides below screen
    if (isAnySelected) {
      return {
        transform: [
          { translateY: withSpring(SCREEN_HEIGHT) },
          { scale: withSpring(0.9) }
        ],
        opacity: withSpring(0),
        zIndex: 0,
      };
    }

    // 3. Normal Stack / Expanded state logic
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
      transform: [
        { translateY: withSpring(translateY) },
        { scale: withSpring(scale) }
      ],
      opacity: withSpring(1),
      zIndex: index,
    };
  });

  return (
    <View style={styles.pressable}>
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
            <Text style={[styles.backText, { color: theme.colors.text.primary }]}>Cerrar Detalle</Text>
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
});
