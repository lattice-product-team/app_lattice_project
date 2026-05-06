/**
 * Simple utility to track and log Time to Interactive (TTI)
 * during the application startup sequence.
 */
let startTime = Date.now();

export const startupMetrics = {
  /**
   * Resets the timer (call this as early as possible in RootLayout)
   */
  start: () => {
    startTime = Date.now();
  },

  /**
   * Logs the time elapsed since 'start' was called.
   */
  markInteractive: (label: string = 'App') => {
    const duration = Date.now() - startTime;
    console.log(`🚀 [Metrics] ${label} Interactive in ${duration}ms`);
    return duration;
  }
};
