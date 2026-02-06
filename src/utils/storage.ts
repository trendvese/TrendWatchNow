import { DraftPost } from '@/types/admin';
import { Post } from '@/types/post';

const POSTS_KEY = 'trendverse_posts';
const AUTH_KEY = 'trendverse_auth';

// Admin password - In production, use proper authentication!
const ADMIN_PASSWORD = 'admin123';

// Get all posts from localStorage
export function getStoredPosts(): DraftPost[] {
  try {
    const stored = localStorage.getItem(POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save posts to localStorage
export function savePosts(posts: DraftPost[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

// Add a new post
export function addPost(post: DraftPost): void {
  const posts = getStoredPosts();
  posts.unshift(post);
  savePosts(posts);
}

// Update an existing post
export function updatePost(id: string, updates: Partial<DraftPost>): void {
  const posts = getStoredPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() };
    savePosts(posts);
  }
}

// Delete a post
export function deletePost(id: string): void {
  const posts = getStoredPosts();
  savePosts(posts.filter(p => p.id !== id));
}

// Get a single post by ID
export function getPostById(id: string): DraftPost | undefined {
  return getStoredPosts().find(p => p.id === id);
}

// Convert DraftPost to Post format
export function draftToPost(draft: DraftPost): Post {
  return {
    id: draft.id,
    title: draft.title,
    excerpt: draft.excerpt,
    content: draft.content,
    category: draft.category,
    image: draft.image,
    author: draft.author,
    date: draft.date,
    readTime: draft.readTime,
    trending: draft.trending,
    views: draft.views,
    reactions: draft.reactions
  };
}

// Get published posts
export function getPublishedPosts(): Post[] {
  return getStoredPosts()
    .filter(p => p.status === 'published')
    .map(draftToPost);
}

// Authentication
export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'true';
}

// Generate unique ID
export function generateId(): string {
  return `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate read time based on content
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
