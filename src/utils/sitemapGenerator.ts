import { Post } from '@/types/post';
import { posts as staticPosts } from '@/data/posts';
import { categories } from '@/data/categories';

const DOMAIN = 'https://trendwatchnow.com';

// Generate a URL-friendly slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 60) // Limit length
    .replace(/-$/, ''); // Remove trailing hyphen
};

// Safe date formatter that handles various date formats
const formatDate = (date: unknown): string => {
  try {
    // If it's a Firestore Timestamp
    if (date && typeof date === 'object' && 'seconds' in date) {
      const timestamp = date as { seconds: number };
      return new Date(timestamp.seconds * 1000).toISOString().split('T')[0];
    }
    
    // If it's a Date object
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    
    // If it's a string
    if (typeof date === 'string') {
      // Already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Try to parse it
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }
    }
    
    // If it's a number (unix timestamp)
    if (typeof date === 'number') {
      return new Date(date).toISOString().split('T')[0];
    }
    
    // Fallback to today
    return new Date().toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export const generateSitemap = (firebasePosts: Post[] = []): string => {
  const today = new Date().toISOString().split('T')[0];
  
  // Create a map to track unique posts by slug (to avoid duplicates)
  const uniquePosts = new Map<string, { slug: string; date: string }>();
  
  // Add static posts (use slug field if available, otherwise generate from title)
  staticPosts.forEach(post => {
    // Use the slug field directly if available
    const slug = post.slug || generateSlug(post.title);
    if (!uniquePosts.has(slug)) {
      uniquePosts.set(slug, {
        slug,
        date: formatDate(post.date)
      });
    }
  });
  
  // Add Firebase posts (filter only published)
  const publishedFirebasePosts = firebasePosts.filter(p => p.status === 'published' || !p.status);
  
  publishedFirebasePosts.forEach(post => {
    const slug = post.slug || generateSlug(post.title);
    // Only add if not already present, or update if Firebase version is newer
    if (!uniquePosts.has(slug)) {
      uniquePosts.set(slug, {
        slug,
        date: formatDate(post.updatedAt || post.createdAt || post.date)
      });
    }
  });
  
  // Generate post URLs
  const postUrls = Array.from(uniquePosts.values())
    .map(post => `  <url>
    <loc>${DOMAIN}/article/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`)
    .join('\n');
  
  // Generate category URLs
  const categoryUrls = Object.keys(categories)
    .map(categoryId => `  <url>
    <loc>${DOMAIN}/category/${categoryId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
    .join('\n');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${DOMAIN}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Static Pages -->
  <url>
    <loc>${DOMAIN}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${DOMAIN}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${DOMAIN}/terms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${DOMAIN}/disclaimer</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Category Pages -->
${categoryUrls}

  <!-- Blog Posts -->
${postUrls}
</urlset>`;

  return sitemap;
};

// Download sitemap as a file
export const downloadSitemap = (firebasePosts: Post[] = []): void => {
  try {
    const sitemap = generateSitemap(firebasePosts);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download sitemap:', error);
    alert('Failed to generate sitemap. Please try again.');
  }
};

// Copy sitemap to clipboard
export const copySitemapToClipboard = async (firebasePosts: Post[] = []): Promise<boolean> => {
  try {
    const sitemap = generateSitemap(firebasePosts);
    
    // Try modern clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(sitemap);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = sitemap;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy sitemap:', error);
    alert('Failed to copy sitemap. Please try again.');
    return false;
  }
};
