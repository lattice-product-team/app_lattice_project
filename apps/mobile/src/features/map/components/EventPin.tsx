import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface EventPinProps {
  id: string | number;
  name: string;
  imageUrl?: string;
  isSelected?: boolean;
  onPress?: () => void;
  color?: string;
}

export const EventPin = ({
  id,
  name,
  imageUrl,
  isSelected,
  onPress,
  color = '#FF3B30',
}: EventPinProps) => {
  
  const theme = useAppTheme();
  const style = useAnimatedStyle(() => {
    const { snappy } = theme.motion.physics;
    return {
      transform: [
        { scale: withSpring(isSelected ? 1.15 : 1, snappy) }
      ],
    };
  });

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={styles.touchArea}
    >
      <Animated.View style={[styles.container, animatedPinStyle]}>
        {/* Main Circular Body */}
        <View style={[styles.circle, { borderColor: color }]}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: color }]}>
              <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
            </View>
          )}
        </View>

        {/* Small pointer tail (optional for aesthetic) */}
        <View style={[styles.tail, { borderTopColor: color }]} />

        {/* Label */}
        {isSelected && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText} numberOfLines={1}>{name}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchArea: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  labelContainer: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: 150,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
