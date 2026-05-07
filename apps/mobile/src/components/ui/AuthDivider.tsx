import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../hooks/useAppTheme';

interface AuthDividerProps {
  label?: string;
  className?: string;
}

export const AuthDivider = ({ label = 'OR', className = '' }: AuthDividerProps) => {
  const theme = useAppTheme();

  return (
    <View className={`flex-row items-center my-8 px-2 ${className}`}>
      <View className="flex-1 h-[1px]" style={{ backgroundColor: theme.colors.border.subtle }} />
      {label && (
        <Text
          className="mx-5 text-[10px] tracking-[2px]"
          style={{ color: theme.colors.text.muted, fontFamily: 'Inter-Bold' }}
        >
          {label}
        </Text>
      )}
      <View className="flex-1 h-[1px]" style={{ backgroundColor: theme.colors.border.subtle }} />
    </View>
  );
};
