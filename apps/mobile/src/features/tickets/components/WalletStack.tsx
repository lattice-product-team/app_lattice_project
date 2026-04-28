import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView , Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  SharedValue
} from 'react-native-reanimated';
import { Ticket } from '../../../types/models/auth';
import { TicketCard } from './TicketCard';
import { useAuthStore } from '../../../store/useAuthStore';
import { useUnclaimTicket } from '../../auth/hooks/useAuthActions';
import { useAppTheme as useLatticeTheme } from '../../../hooks/useAppTheme';

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
  toggleExpand
}) => {
  const isSelected = selectedTicketId === (ticket.id || ticket.code);
  const isAnySelected = selectedTicketId !== null;

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      expandProgress.value,
      [0, 1],
      [index * STACK_OFFSET, index * EXPANDED_OFFSET],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      expandProgress.value,
      [0, 1],
      [1 - (totalTickets - 1 - index) * 0.05, 1],
      Extrapolate.CLAMP
    );

    const opacity = isAnySelected ? (isSelected ? 1 : withTiming(0)) : 1;
    const finalTranslateY = isSelected ? withSpring(0) : translateY;

    return {
      transform: [
        { translateY: finalTranslateY },
        { scale },
        { perspective: 1000 },
      ],
      zIndex: isSelected ? 100 : index,
      opacity,
    };
  });

  return (
    <View 
      style={[styles.pressable, isSelected && { position: 'relative', zIndex: 100 }]}
    >
      <Animated.View style={[styles.cardWrapper, animatedStyle]}>
        <TicketCard 
          ticket={ticket} 
          index={index} 
          onCardPress={() => isExpanded ? handleSelectTicket(ticket) : toggleExpand()}
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
    if (selectedTicketId) return; // Don't toggle stack if a ticket is selected
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    expandProgress.value = withSpring(newExpanded ? 1 : 0, {
      damping: 15,
      stiffness: 100,
    });
  };

  const handleSelectTicket = (ticket: Ticket) => {
    if (selectedTicketId === (ticket.id || ticket.code)) {
      setSelectedTicketId(null);
    } else {
      setSelectedTicketId(ticket.id || ticket.code);
      if (!isExpanded) toggleExpand();
    }
  };

  const selectedTicket = tickets.find(t => (t.id || t.code) === selectedTicketId);

  const handleDelete = (ticket: Ticket) => {
    Alert.alert(
      "Eliminar Entrada",
      "Estàs segur que vols eliminar aquesta entrada de la teva wallet?",
      [
        { text: "Cancel·lar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              const success = await unclaimTicket(ticket.code!);
              if (success) {
                setSelectedTicketId(null);
              } else {
                Alert.alert("Error", "No s'ha pogut eliminar l'entrada.");
              }
            } catch {
              Alert.alert("Error", "Hi ha hagut un problema al connectar amb el servidor.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView 
        contentContainerStyle={[
          styles.container, 
          { 
            minHeight: isAnySelected 
              ? height + 200 
              : (isExpanded ? Math.max(800, tickets.length * (EXPANDED_OFFSET + 50)) : 500)
          }
        ]}
        scrollEnabled={isExpanded || isAnySelected}
      >
        {tickets.map((ticket, index) => (
          <WalletItem 
            key={ticket.id || ticket.code}
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

        {selectedTicket && (
          <Animated.View entering={FadeIn.delay(300)} style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Informació Tècnica</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ID BD</Text>
                <Text style={styles.detailValue}>#{selectedTicket.id}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.muted }]}>ESTAT</Text>
                <View style={styles.statusBadge}>
                  <View style={[styles.statusDot, { backgroundColor: selectedTicket.isActive ? theme.colors.status.success : theme.colors.status.error }]} />
                  <Text style={[styles.statusText, { color: theme.colors.text.primary }]}>{selectedTicket.isActive ? 'ACTIVA' : 'INACTIVA'}</Text>
                </View>
              </View>
            </View>

            <View style={[styles.separator, { backgroundColor: theme.colors.border.subtle }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DATA REGISTRE</Text>
                <Text style={styles.detailValue}>
                  {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={[styles.infoBox, { backgroundColor: theme.colors.status.successSurface }]}>
              <Feather name="shield" size={16} color={theme.colors.status.success} />
              <Text style={[styles.infoBoxText, { color: theme.colors.text.secondary }]}>
                Entrada vinculada correctament al teu compte. Només tu pots utilitzar aquest QR per a l&apos;accés.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.deleteOptionButton, { backgroundColor: theme.colors.status.errorSurface }]} 
              onPress={() => handleDelete(selectedTicket)}
            >
              <Feather name="trash-2" size={18} color={theme.colors.status.error} />
              <Text style={[styles.deleteOptionText, { color: theme.colors.status.error }]}>Eliminar Entrada</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  pressable: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  detailsContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 20, // Sit just below the selected ticket
    paddingBottom: 100,
  },
  detailsTitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  infoBox: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoBoxText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 12,
    flex: 1,
  },
  deleteOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    marginBottom: 20,
  },
  deleteOptionText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
