// Re-export the Post type for convenience
export type { Post } from '@/types/post';

// Import individual posts
import { appleVisionPro2 } from './apple-vision-pro-2';
import { samsungGalaxyS25Ultra } from './samsung-galaxy-s25-ultra';
import { ces2024Highlights } from './ces-2024-highlights';
import { openaiGpt5Announcement } from './openai-gpt5-announcement';
import { digitalMinimalismGenZ } from './digital-minimalism-genz';
import { gta6TrailerRecord } from './gta6-trailer-record';
import { spacexStarshipOrbit } from './spacex-starship-orbit';
import { oneplus13Review } from './oneplus-13-review';

// NEW TRENDING ARTICLES
import { aiWars2025 } from './ai-wars-2025';
import { bitcoinHalving2024 } from './bitcoin-halving-2024-crypto-bull-run';
import { globalConflicts2024 } from './global-conflicts-2024-2025';
import { stockMarket2025 } from './stock-market-2025-predictions';
import { electricVehicleWars2025 } from './electric-vehicle-wars-2025';

// Export individual posts for direct access if needed
export {
  appleVisionPro2,
  samsungGalaxyS25Ultra,
  ces2024Highlights,
  openaiGpt5Announcement,
  digitalMinimalismGenZ,
  gta6TrailerRecord,
  spacexStarshipOrbit,
  oneplus13Review,
  // New trending articles
  aiWars2025,
  bitcoinHalving2024,
  globalConflicts2024,
  stockMarket2025,
  electricVehicleWars2025,
};

// Export all posts as an array (newest/trending first)
export const posts = [
  // High-trending articles
  aiWars2025,
  bitcoinHalving2024,
  globalConflicts2024,
  stockMarket2025,
  electricVehicleWars2025,
  // Other articles
  appleVisionPro2,
  samsungGalaxyS25Ultra,
  ces2024Highlights,
  openaiGpt5Announcement,
  digitalMinimalismGenZ,
  gta6TrailerRecord,
  spacexStarshipOrbit,
  oneplus13Review,
];

// Helper function to get a post by ID
export const getPostById = (id: string) => posts.find(post => post.id === id);

// Helper function to get posts by category
export const getPostsByCategory = (category: string) => 
  posts.filter(post => post.category === category);

// Helper function to get trending posts
export const getTrendingPosts = () => posts.filter(post => post.trending);

// Helper function to get posts sorted by views
export const getPopularPosts = () => 
  [...posts].sort((a, b) => b.views - a.views);

// Helper function to get latest posts
export const getLatestPosts = () => 
  [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
