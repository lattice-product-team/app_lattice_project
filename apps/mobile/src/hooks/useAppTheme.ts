import { useAppTheme } from '../providers/ThemeProvider';

/**
 * Global hook to access the unified application theme.
 * This theme automatically merges System (Dark/Light) settings
 * with current Event branding.
 */
export { useAppTheme };
export default useAppTheme;
