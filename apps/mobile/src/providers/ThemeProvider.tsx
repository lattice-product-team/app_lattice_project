import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LatticeTheme, darkTheme, lightTheme } from '../styles/theme';
import { useEventStore } from '../features/event/store/useEventStore';
import { colors as primitiveColors } from '@app/theme';

const ThemeContext = createContext<LatticeTheme>(darkTheme);

/**
 * ThemeProvider handles the unification of:
 * 1. System Appearance (Light/Dark mode)
 * 2. Event-specific branding (Dynamic brand colors based on event type)
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const { selectedEvent } = useEventStore();

  const theme = useMemo(() => {
    // 1. Get base theme from system appearance
    const baseTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

    // 2. Resolve brand color override from event context
    let brandPrimary = baseTheme.colors.brand.primary;
    
    if (selectedEvent?.type) {
      const type = selectedEvent.type as keyof typeof primitiveColors.category;
      const eventColor = primitiveColors.category[type] || primitiveColors.brand.primary;
      brandPrimary = eventColor;
    }

    // 3. Construct the final theme object with overrides
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        brand: {
          ...baseTheme.colors.brand,
          primary: brandPrimary,
          // We can also derive variants here if needed
        },
      },
    };
  }, [colorScheme, selectedEvent]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useAppTheme is the single source of truth for all styling in the app.
 * It replaces useLatticeTheme and useEventTheme.
 */
export const useAppTheme = () => useContext(ThemeContext);
