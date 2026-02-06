export interface Post {
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
  status?: 'published' | 'draft';
  createdAt?: any;
  updatedAt?: any;
}

export type CategoryType = Post['category'];
