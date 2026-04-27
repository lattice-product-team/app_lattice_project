import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, LatticeTheme } from '../styles/theme';

/**
 * Hook to access the current Lattice theme.
 * Automatically follows the system's appearance (Light/Dark).
 */
export const useLatticeTheme = (): LatticeTheme => {
  const colorScheme = useColorScheme();
  
  // Return darkTheme for dark mode, lightTheme for light mode
  return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export default useLatticeTheme;


