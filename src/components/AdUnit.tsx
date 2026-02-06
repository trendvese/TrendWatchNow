import { useEffect, useRef } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: 'banner' | 'sidebar' | 'inline' | 'article';
}

// AdSense Publisher ID - Replace with your actual ID
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';

export default function AdUnit({ 
  slot: _slot, 
  format: _format = 'auto', 
  className = '',
  style = 'inline'
}: AdUnitProps) {
  // These will be used when AdSense is enabled
  void _slot;
  void _format;
  void ADSENSE_CLIENT;
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load ad once
    if (isLoaded.current) return;
    
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  // Style configurations for different ad placements
  const styleConfigs = {
    banner: 'min-h-[90px] md:min-h-[90px]',
    sidebar: 'min-h-[250px]',
    inline: 'min-h-[100px] my-6',
    article: 'min-h-[280px] my-8'
  };

  return (
    <div 
      ref={adRef}
      className={`
        ad-container relative overflow-hidden
        ${styleConfigs[style]}
        ${className}
      `}
    >
      {/* Ad Placeholder - Shows when ads aren't loaded */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <div className="text-center p-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium mb-1">
            Advertisement
          </div>
          <div className="text-[10px] text-gray-300 dark:text-gray-600">
            {style === 'banner' && '728x90 Banner'}
            {style === 'sidebar' && '300x250 Rectangle'}
            {style === 'inline' && 'Responsive Ad'}
            {style === 'article' && 'In-Article Ad'}
          </div>
        </div>
      </div>

      {/* Actual AdSense Code - Uncomment when you have a valid AdSense account */}
      {/*
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      */}
    </div>
  );
}

// Specific ad components for common placements
export function HeaderAd() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      <AdUnit slot="1234567890" format="horizontal" style="banner" />
    </div>
  );
}

export function SidebarAd() {
  return (
    <div className="sticky top-24">
      <AdUnit slot="2345678901" format="rectangle" style="sidebar" />
    </div>
  );
}

export function InArticleAd() {
  return (
    <div className="my-8 -mx-4 sm:mx-0">
      <AdUnit slot="3456789012" format="auto" style="article" />
    </div>
  );
}

export function FeedAd() {
  return (
    <div className="col-span-1 md:col-span-2">
      <AdUnit slot="4567890123" format="auto" style="inline" />
    </div>
  );
}
