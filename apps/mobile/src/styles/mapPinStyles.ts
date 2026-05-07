import { StyleSheet } from 'react-native';

export const mapPinStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    // Remove fixed height/width to prevent 'floating' effect
    paddingBottom: 0,
  },
  pinFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // Elevation for Android
    elevation: 4,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    maxWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Stem (optional, for that pin look)
  stem: {
    width: 2,
    height: 8,
    backgroundColor: '#FFFFFF',
    marginTop: -1,
  },
});
