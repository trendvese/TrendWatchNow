import { useEffect } from 'react';
import { Post } from '@/types/post';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  post?: Post;
}

const SITE_NAME = 'TrendWatch Now';
const SITE_URL = 'https://trendwatchnow.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200';
const DEFAULT_DESCRIPTION = 'Your destination for trending topics - Tech, Mobile, News, Events, Gaming & Lifestyle. Stay ahead with the latest updates.';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
  post
}: SEOHeadProps) {
  
  useEffect(() => {
    // Update document title
    const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Trending Topics & News`;
    document.title = pageTitle;

    // Helper to update or create meta tags
    const updateMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let meta = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Helper to update link tags
    const updateLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Basic Meta Tags
    updateMeta('description', description, true);
    updateMeta('author', post?.author.name || SITE_NAME, true);
    updateMeta('robots', 'index, follow', true);

    // Open Graph Tags
    updateMeta('og:title', title || SITE_NAME);
    updateMeta('og:description', description);
    updateMeta('og:image', image);
    updateMeta('og:url', url);
    updateMeta('og:type', type);
    updateMeta('og:site_name', SITE_NAME);
    updateMeta('og:locale', 'en_US');

    // Twitter Card Tags
    updateMeta('twitter:card', 'summary_large_image', true);
    updateMeta('twitter:title', title || SITE_NAME, true);
    updateMeta('twitter:description', description, true);
    updateMeta('twitter:image', image, true);
    updateMeta('twitter:site', '@trendwatchnow', true);

    // Canonical URL
    updateLink('canonical', url);

    // Article specific meta tags
    if (post && type === 'article') {
      updateMeta('article:published_time', post.date);
      updateMeta('article:author', post.author.name);
      updateMeta('article:section', post.category);
      updateMeta('article:tag', post.category);
    }

    // Structured Data (JSON-LD)
    let script = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = post ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': post.title,
      'description': post.excerpt,
      'image': post.image,
      'author': {
        '@type': 'Person',
        'name': post.author.name
      },
      'publisher': {
        '@type': 'Organization',
        'name': SITE_NAME,
        'logo': {
          '@type': 'ImageObject',
          'url': `${SITE_URL}/logo.png`
        }
      },
      'datePublished': post.date,
      'dateModified': post.date,
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url
      },
      'articleSection': post.category,
      'wordCount': post.content.split(' ').length,
      'interactionStatistic': [
        {
          '@type': 'InteractionCounter',
          'interactionType': 'https://schema.org/ReadAction',
          'userInteractionCount': post.views
        },
        {
          '@type': 'InteractionCounter',
          'interactionType': 'https://schema.org/LikeAction',
          'userInteractionCount': post.reactions
        }
      ]
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': SITE_NAME,
      'url': SITE_URL,
      'description': DEFAULT_DESCRIPTION,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };

    script.textContent = JSON.stringify(structuredData);

  }, [title, description, image, url, type, post]);

  return null;
}
