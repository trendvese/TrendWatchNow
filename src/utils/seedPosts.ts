// Seed Posts Utility
// Use this to populate your Firestore with initial posts

import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { posts as defaultPosts } from '../data/posts';

export const seedPosts = async (): Promise<void> => {
  try {
    // Check if posts already exist
    const snapshot = await getDocs(collection(db, 'posts'));
    
    if (snapshot.docs.length > 0) {
      console.log('Posts already exist in Firestore. Skipping seed.');
      return;
    }

    console.log('Seeding posts to Firestore...');
    
    for (const post of defaultPosts) {
      const { id, ...postData } = post;
      await addDoc(collection(db, 'posts'), {
        ...postData,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added: ${post.title}`);
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
};

// Call this function once to seed your database
// You can trigger it from browser console: window.seedPosts()
if (typeof window !== 'undefined') {
  (window as any).seedPosts = seedPosts;
}
