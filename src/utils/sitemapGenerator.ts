// Sitemap Generator Utility
// Generates XML sitemap from your posts

import { Post } from '@/types/post';

const SITE_URL = 'https://trendverse-blog.web.app';

// Static pages that should always be in sitemap
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/contact', priority: '0.8', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'yearly' },
];

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

  // Blog posts XML
  const postsXML = posts
    .filter(post => post.status === 'published')
    .map(post => `
  <url>
    <loc>${SITE_URL}/article/${post.id}</loc>
    <lastmod>${post.updatedAt?.split('T')[0] || post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

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
  
  <!-- Static Pages -->${staticPagesXML}
  
  <!-- Blog Posts -->${postsXML}
  
  <!-- Category Pages -->${categoriesXML}
</urlset>`;

  return sitemap;
};

// Download sitemap as file
export const downloadSitemap = (posts: Post[]): void => {
  const sitemap = generateSitemapXML(posts);
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Copy sitemap to clipboard
export const copySitemapToClipboard = async (posts: Post[]): Promise<boolean> => {
  const sitemap = generateSitemapXML(posts);
  try {
    await navigator.clipboard.writeText(sitemap);
    return true;
  } catch (error) {
    console.error('Failed to copy sitemap:', error);
    return false;
  }
};
