import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  where,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source: string;
}

const COLLECTION_NAME = 'subscribers';

// Add a new subscriber
export async function addSubscriber(email: string, source: string = 'website'): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    // Get all subscribers and check for duplicates manually (avoids index requirement)
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const normalizedEmail = email.toLowerCase().trim();
    
    let existingDoc: any = null;
    querySnapshot.forEach((docSnapshot) => {
      if (docSnapshot.data().email === normalizedEmail) {
        existingDoc = { id: docSnapshot.id, ...docSnapshot.data() };
      }
    });
    
    if (existingDoc) {
      if (existingDoc.status === 'unsubscribed') {
        // Reactivate subscription
        await updateDoc(doc(db, COLLECTION_NAME, existingDoc.id), {
          status: 'active',
          subscribedAt: Timestamp.now()
        });
        return { success: true, message: 'Welcome back! Your subscription has been reactivated.' };
      }
      return { success: false, message: 'This email is already subscribed!' };
    }
    
    // Add new subscriber
    await addDoc(collection(db, COLLECTION_NAME), {
      email: normalizedEmail,
      subscribedAt: Timestamp.now(),
      status: 'active',
      source
    });
    
    return { success: true, message: 'Successfully subscribed! 🎉' };
  } catch (error) {
    console.error('Error adding subscriber:', error);
    // Provide more specific error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Full error details:', errorMessage);
    return { success: false, message: 'Failed to subscribe. Please try again.' };
  }
}

// Get all subscribers
export async function getAllSubscribers(): Promise<Subscriber[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('subscribedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      email: doc.data().email,
      subscribedAt: doc.data().subscribedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      status: doc.data().status || 'active',
      source: doc.data().source || 'website'
    }));
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
}

// Get active subscribers count
export async function getActiveSubscribersCount(): Promise<number> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'active'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error counting subscribers:', error);
    return 0;
  }
}

// Unsubscribe (soft delete)
export async function unsubscribe(id: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      status: 'unsubscribed'
    });
    return true;
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return false;
  }
}

// Delete subscriber permanently
export async function deleteSubscriber(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return false;
  }
}

// Export subscribers as CSV
export function exportSubscribersCSV(subscribers: Subscriber[]): string {
  const headers = ['Email', 'Subscribed Date', 'Status', 'Source'];
  const rows = subscribers.map(sub => [
    sub.email,
    new Date(sub.subscribedAt).toLocaleDateString(),
    sub.status,
    sub.source
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}
