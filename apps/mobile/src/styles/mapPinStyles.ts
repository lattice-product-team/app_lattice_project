import { StyleSheet } from 'react-native';

export const mapPinStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120, // Increased width to accommodate longer names
    minHeight: 44,
  },

  pinFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow removed per user request
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
    marginTop: 6,
    maxWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 12,
    fontFamily: 'Outfit-Bold',
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowRadius: 0,
    letterSpacing: 0.6,
  },
  // Stem no longer used
  stem: {
    display: 'none',
  },
});
