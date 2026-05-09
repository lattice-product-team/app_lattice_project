import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../hooks/useAppTheme';
import { typography } from '../../../styles/typography';
import { DetailMetric } from '../../../types/models/detail';

interface MetricGridProps {
  metrics: DetailMetric[];
}

export const MetricGrid = ({ metrics }: MetricGridProps) => {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      {metrics.map((metric, index) => (
        <View key={`${metric.label}-${index}`} style={styles.metricItem}>
          <Text style={[styles.label, { color: theme.colors.text.muted }]}>
            {metric.label}
          </Text>
          <View style={styles.valueRow}>
            <MaterialCommunityIcons
              name={metric.icon as any}
              size={18}
              color={metric.color || theme.colors.text.primary}
            />
            <Text 
              style={[
                styles.value, 
                { color: metric.color || theme.colors.text.primary }
              ]}
              numberOfLines={1}
            >
              {metric.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 16,
    width: '100%',
  },
  metricItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: typography.primary.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    fontSize: 16,
    fontFamily: typography.primary.bold,
  },
});
