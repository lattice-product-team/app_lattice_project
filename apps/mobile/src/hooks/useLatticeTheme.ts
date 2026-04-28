import { useAppTheme } from './useAppTheme';
import { LatticeTheme } from '../styles/theme';

/**
 * Legacy hook redirected to useAppTheme for consistent branding.
 * @deprecated Use useAppTheme instead.
 */
export const useLatticeTheme = (): LatticeTheme => {
  return useAppTheme();
};

export default useLatticeTheme;
