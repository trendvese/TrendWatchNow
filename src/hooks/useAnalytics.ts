import { useEffect, useRef } from 'react';
import { trackPageView, initGA, analytics } from '@/utils/analytics';

// Hook to track page views automatically
export const usePageTracking = (currentPage: string, pageTitle?: string): void => {
  const prevPage = useRef<string>('');

  useEffect(() => {
    // Initialize GA on first load
    initGA();
  }, []);

  useEffect(() => {
    // Track page view when page changes
    if (currentPage !== prevPage.current) {
      trackPageView(currentPage, pageTitle);
      prevPage.current = currentPage;
    }
  }, [currentPage, pageTitle]);
};

// Hook to track scroll depth
export const useScrollTracking = (): void => {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      // Track at 25%, 50%, 75%, 100%
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          analytics.scrollDepth(milestone);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};

// Hook to track time on page
export const useTimeTracking = (pageName: string): void => {
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      if (timeSpent > 5) { // Only track if more than 5 seconds
        analytics.timeOnPage(timeSpent, pageName);
      }
    };
  }, [pageName]);
};

export { analytics };
