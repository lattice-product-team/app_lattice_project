import { StyleSheet } from 'react-native';

export const mapPinStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 64,
    height: 64,
  },

  pinFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventPinSize: {
    width: 48,
    height: 48,
  },
  poiPinSize: {
    width: 40,
    height: 40,
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
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8, // Stronger halo
    letterSpacing: 0.6,
  },
  // Stem no longer used
  stem: {
    display: 'none',
  },
});
