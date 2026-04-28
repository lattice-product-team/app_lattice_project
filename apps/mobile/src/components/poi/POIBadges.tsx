import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLatticeTheme } from '../../hooks/useLatticeTheme';

interface POIBadgesProps {
  category: string;
  crowdLevel: string;
  isWheelchairAccessible?: boolean;
  hasPriorityLane?: boolean;
  icon: string;
}

const getCrowdColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'low': return 'text-green-400';
    case 'moderate': return 'text-yellow-400';
    case 'high':
    case 'blocked': return 'text-red-400';
    default: return 'text-white';
  }
};

const getCrowdLabel = (level: string) => {
  switch (level.toLowerCase()) {
    case 'low': return 'Low crowds';
    case 'moderate': return 'Moderate crowds';
    case 'high': return 'High crowds';
    case 'blocked': return 'Access blocked';
    default: return 'Crowd status unknown';
  }
};

export const POIBadges = ({ 
  category, 
  crowdLevel, 
  isWheelchairAccessible, 
  hasPriorityLane,
  icon 
}: POIBadgesProps) => {
  const theme = useLatticeTheme();
  return (
    <View className="flex-row flex-wrap items-center gap-2 mb-2">
      <View className="flex-row items-center px-2 py-0.5 rounded border border-white/10 bg-white/5">
        <Feather name={icon as any} size={10} color={theme.colors.text.muted} style={{ marginRight: 4 }} />
        <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: theme.colors.text.muted }}>
          {category}
        </Text>
      </View>

    <View className="flex-row items-center border border-white/10 px-2 py-0.5 rounded bg-white/5">
      <View
        className={`w-1.5 h-1.5 rounded-full mr-1 ${getCrowdColor(crowdLevel).replace('text-', 'bg-')}`}
      />
      <Text className={`text-[10px] font-medium ${getCrowdColor(crowdLevel)}`}>
        {getCrowdLabel(crowdLevel)}
      </Text>
    </View>

    {isWheelchairAccessible && (
      <View className="bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
        <Feather name="user" size={12} color="#60A5FA" />
      </View>
    )}

    {hasPriorityLane && (
      <View className="bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
        <Feather name="star" size={12} color="#FBBF24" />
      </View>
    )}
    </View>
  );
};
