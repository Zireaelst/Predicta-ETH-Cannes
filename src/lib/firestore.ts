import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { User, Prediction, Vote } from '@/types';

// User operations
export const createUser = async (userData: Partial<User>) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      xp: 0,
      level: 1,
      badges: [],
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...userData,
      lastActive: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Prediction operations
export const createPrediction = async (predictionData: Partial<Prediction>) => {
  try {
    const docRef = await addDoc(collection(db, 'predictions'), {
      ...predictionData,
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0,
      isResolved: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating prediction:', error);
    throw error;
  }
};

export const getPredictions = async () => {
  try {
    const q = query(
      collection(db, 'predictions'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
  } catch (error) {
    console.error('Error getting predictions:', error);
    throw error;
  }
};

export const getActivePredictions = async () => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('isResolved', '==', false),
      where('endDate', '>', new Date()),
      orderBy('endDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
  } catch (error) {
    console.error('Error getting active predictions:', error);
    throw error;
  }
};

export const resolvePrediction = async (predictionId: string, outcome: boolean) => {
  try {
    const docRef = doc(db, 'predictions', predictionId);
    await updateDoc(docRef, {
      isResolved: true,
      outcome,
      resolvedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error resolving prediction:', error);
    throw error;
  }
};

// Vote operations
export const castVote = async (voteData: Partial<Vote>) => {
  try {
    // Check if user already voted
    const existingVoteQuery = query(
      collection(db, 'votes'),
      where('userId', '==', voteData.userId),
      where('predictionId', '==', voteData.predictionId)
    );
    const existingVotes = await getDocs(existingVoteQuery);
    
    if (!existingVotes.empty) {
      throw new Error('User has already voted on this prediction');
    }

    // Add vote
    const docRef = await addDoc(collection(db, 'votes'), {
      ...voteData,
      createdAt: serverTimestamp()
    });

    // Update prediction vote counts
    const predictionRef = doc(db, 'predictions', voteData.predictionId!);
    await updateDoc(predictionRef, {
      totalVotes: increment(1),
      [voteData.vote ? 'yesVotes' : 'noVotes']: increment(1)
    });

    return docRef.id;
  } catch (error) {
    console.error('Error casting vote:', error);
    throw error;
  }
};

export const getUserVotes = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'votes'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Vote[];
  } catch (error) {
    console.error('Error getting user votes:', error);
    throw error;
  }
};

// Leaderboard operations
export const getLeaderboard = async (limitCount: number = 10) => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToActivePredictions = (callback: (predictions: Prediction[]) => void) => {
  const q = query(
    collection(db, 'predictions'),
    where('isResolved', '==', false),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const predictions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Prediction[];
    callback(predictions);
  });
};

export const subscribeToUser = (userId: string, callback: (user: User | null) => void) => {
  const docRef = doc(db, 'users', userId);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as User);
    } else {
      callback(null);
    }
  });
};
