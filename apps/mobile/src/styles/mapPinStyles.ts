import { StyleSheet } from 'react-native';

export const mapPinStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 120, // Enough space for pin + label
    height: 80,  // Enough space for pin + label
    paddingBottom: 2, // Tiny nudge for visual breathing room
  },
  pinFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // Minimal flat shadow for depth without neon
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventPinSize: {
    width: 44,
    height: 44,
  },
  poiPinSize: {
    width: 32,
    height: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelBadge: {
    marginTop: 4, // Back to vertical
    maxWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 13, // Uniform size for both
    fontWeight: '600',
    textAlign: 'center',
  },
  // Stem no longer used
  stem: {
    display: 'none',
  },
});
