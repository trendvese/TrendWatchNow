export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

export interface DraftPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'tech' | 'mobile' | 'news' | 'events' | 'lifestyle' | 'gaming' | 'finance' | 'sports' | 'entertainment' | 'health' | 'science' | 'politics';
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: number;
  trending: boolean;
  views: number;
  reactions: number;
  status: 'draft' | 'published';
  createdAt?: string;
  updatedAt?: string;
}

export type PostStatus = 'draft' | 'published' | 'all';
