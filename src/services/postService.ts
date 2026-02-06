// Post Service - Firebase Firestore Operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Post } from '../types/post';

const POSTS_COLLECTION = 'posts';

// Convert Firestore document to Post
const docToPost = (doc: any): Post => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    category: data.category,
    image: data.image,
    author: data.author,
    date: data.date instanceof Timestamp 
      ? data.date.toDate().toISOString().split('T')[0] 
      : data.date,
    readTime: data.readTime,
    trending: data.trending || false,
    views: data.views || 0,
    reactions: data.reactions || 0,
    status: data.status || 'published',
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  };
};

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToPost);
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

// Get published posts only
export const getPublishedPosts = async (): Promise<Post[]> => {
  try {
    // First try to get all posts (simpler query that doesn't require index)
    const q = query(
      collection(db, POSTS_COLLECTION)
    );
    const snapshot = await getDocs(q);
    console.log('Raw Firebase docs:', snapshot.docs.length);
    
    // Filter published posts in memory (avoids index requirement)
    const allPosts = snapshot.docs.map(docToPost);
    const publishedPosts = allPosts.filter(p => p.status === 'published');
    console.log('Published posts:', publishedPosts.length);
    
    // Sort by date (newest first)
    return publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error getting published posts:', error);
    return [];
  }
};

// Get single post by ID
export const getPostById = async (id: string): Promise<Post | null> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docToPost(docSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    return null;
  }
};

// Get posts by category
export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToPost);
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
};

// Get trending posts
export const getTrendingPosts = async (limitCount: number = 5): Promise<Post[]> => {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      where('trending', '==', true),
      where('status', '==', 'published'),
      orderBy('views', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToPost);
  } catch (error) {
    console.error('Error getting trending posts:', error);
    return [];
  }
};

// Create new post
export const createPost = async (post: Omit<Post, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...post,
      views: 0,
      reactions: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

// Update post
export const updatePost = async (id: string, updates: Partial<Post>): Promise<boolean> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating post:', error);
    return false;
  }
};

// Delete post
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};

// Increment views
export const incrementViews = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, { views: currentViews + 1 });
    }
  } catch (error) {
    console.error('Error incrementing views:', error);
  }
};

// Increment reactions
export const incrementReactions = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentReactions = docSnap.data().reactions || 0;
      await updateDoc(docRef, { reactions: currentReactions + 1 });
    }
  } catch (error) {
    console.error('Error incrementing reactions:', error);
  }
};
