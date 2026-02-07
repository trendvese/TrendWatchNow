// Sitemap Generator Utility
// Generates XML sitemap from your posts

import { Post } from '@/types/post';

const SITE_URL = 'https://trendwatchnow.com';

// Static pages that should always be in sitemap
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
];

// Helper function to safely convert any date format to YYYY-MM-DD string
const formatDateSafe = (dateValue: unknown): string => {
  const today = new Date().toISOString().split('T')[0];
  
  // If no value, return today
  if (!dateValue) return today;
  
  try {
    // If it's already a string in YYYY-MM-DD format
    if (typeof dateValue === 'string') {
      // Check if it contains 'T' (ISO format)
      if (dateValue.includes('T')) {
        return dateValue.split('T')[0];
      }
      // Already in YYYY-MM-DD format
      return dateValue;
    }
    
    // If it's a Firebase Timestamp (has toDate method)
    if (dateValue && typeof dateValue === 'object') {
      // Check for Firestore Timestamp
      if ('toDate' in dateValue && typeof (dateValue as { toDate: () => Date }).toDate === 'function') {
        const timestamp = dateValue as { toDate: () => Date };
        return timestamp.toDate().toISOString().split('T')[0];
      }
      
      // Check for seconds property (Firestore Timestamp structure)
      if ('seconds' in dateValue) {
        const seconds = (dateValue as { seconds: number }).seconds;
        return new Date(seconds * 1000).toISOString().split('T')[0];
      }
    }
    
    // If it's a Date object
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // If it's a number (Unix timestamp in milliseconds)
    if (typeof dateValue === 'number') {
      return new Date(dateValue).toISOString().split('T')[0];
    }
    
    return today;
  } catch (error) {
    console.warn('Error formatting date:', error);
    return today;
  }
};

// Generate sitemap XML from posts
export const generateSitemapXML = (posts: Post[]): string => {
  const today = new Date().toISOString().split('T')[0];
  
  // Static pages XML
  const staticPagesXML = STATIC_PAGES.map(page => `
  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  // Blog posts XML - only published posts
  const publishedPosts = posts.filter(post => post.status === 'published' || !post.status);
  const postsXML = publishedPosts.map(post => {
    // Safely format the date
    const postDate = formatDateSafe(post.updatedAt) || formatDateSafe(post.date) || today;
    
    return `
  <url>
    <loc>${SITE_URL}/article/${post.id}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('');

  // Category pages XML
  const categories = ['tech', 'mobile', 'news', 'events', 'lifestyle', 'gaming', 'finance', 'sports', 'entertainment', 'health', 'science', 'politics'];
  const categoriesXML = categories.map(cat => `
  <url>
    <loc>${SITE_URL}/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  // Complete sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Generated automatically on ${today} -->
  <!-- Total posts: ${publishedPosts.length} -->
  
  <!-- Static Pages -->${staticPagesXML}
  
  <!-- Blog Posts -->${postsXML}
  
  <!-- Category Pages -->${categoriesXML}
</urlset>`;

  return sitemap;
};

// Download sitemap as file
export const downloadSitemap = (posts: Post[]): boolean => {
  try {
    const sitemap = generateSitemapXML(posts);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a')
    link.href = url;
    link.download = 'sitemap.xml';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Failed to download sitemap:', error);
    alert('Failed to download sitemap. Please try again.');
    return false;
  }
};

// Copy sitemap to clipboard
export const copySitemapToClipboard = async (posts: Post[]): Promise<boolean> => {
  try {
    const sitemap = generateSitemapXML(posts);
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(sitemap);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = sitemap;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (!successful) {
      throw new Error('execCommand copy failed');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to copy sitemap:', error);
    alert('Failed to copy sitemap. Please try the download option instead.');
    return false;
  }
};

// Preview sitemap in console (for debugging)
export const previewSitemap = (posts: Post[]): void => {
  const sitemap = generateSitemapXML(posts);
  console.log('=== SITEMAP PREVIEW ===');
  console.log(sitemap);
  console.log('=== END SITEMAP ===');
};
