// Google Analytics 4 (GA4) Utility
// Just update the GA_MEASUREMENT_ID below with your GA4 ID

export const GA_MEASUREMENT_ID = 'G-R34L0FDXRL'; // Replace with your GA4 ID

// Check if GA is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
};

// Track page views
export const trackPageView = (url: string, title?: string): void => {
  if (!isGALoaded()) return;
  
  (window as any).gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
    page_title: title || document.title,
  });
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
): void => {
  if (!isGALoaded()) return;
  
  (window as any).gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Pre-defined events for common actions
export const analytics = {
  // Track article views
  articleView: (articleId: string, articleTitle: string, category: string) => {
    trackEvent('article_view', 'content', articleTitle);
    trackEvent('view_item', category, articleId);
  },

  // Track article share
  articleShare: (articleId: string, platform: string) => {
    trackEvent('share', 'article', `${articleId}_${platform}`);
  },

  // Track article like
  articleLike: (articleId: string) => {
    trackEvent('like', 'article', articleId);
  },

  // Track article bookmark
  articleBookmark: (articleId: string) => {
    trackEvent('bookmark', 'article', articleId);
  },

  // Track newsletter subscribe
  subscribe: (source: string) => {
    trackEvent('subscribe', 'newsletter', source);
  },

  // Track contact form submit
  contactSubmit: () => {
    trackEvent('submit', 'contact_form');
  },

  // Track category filter
  categoryFilter: (category: string) => {
    trackEvent('filter', 'category', category);
  },

  // Track search
  search: (query: string) => {
    trackEvent('search', 'site_search', query);
  },

  // Track social link click
  socialClick: (platform: string) => {
    trackEvent('click', 'social', platform);
  },

  // Track ad click (for monitoring)
  adClick: (adPosition: string) => {
    trackEvent('click', 'advertisement', adPosition);
  },

  // Track outbound link
  outboundLink: (url: string) => {
    trackEvent('click', 'outbound', url);
  },

  // Track scroll depth
  scrollDepth: (percentage: number) => {
    trackEvent('scroll', 'depth', `${percentage}%`, percentage);
  },

  // Track time on page
  timeOnPage: (seconds: number, page: string) => {
    trackEvent('timing', 'engagement', page, seconds);
  },
};

// Initialize GA4 (called once on app load)
export const initGA = (): void => {
  if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.log('📊 Google Analytics: Add your GA4 ID in src/utils/analytics.ts');
    return;
  }

  // Create script elements
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}', {
      page_path: window.location.pathname,
      send_page_view: true
    });
  `;
  document.head.appendChild(script2);

  console.log('📊 Google Analytics initialized');
};
