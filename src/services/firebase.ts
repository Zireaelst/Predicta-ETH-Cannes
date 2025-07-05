import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, Prediction, Vote, LeaderboardEntry } from '../types/firebase';

// Client-side guard
const isClient = typeof window !== 'undefined';

// Kullanıcı işlemleri
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
  if (!isClient) throw new Error('Firebase operations are only available on the client side');
  
  try {
    const userDoc = {
      privyId: userData.privyId || '',
      walletAddress: userData.walletAddress || '',
      email: userData.email || '',
      createdAt: Timestamp.now(),
      xp: 0,
      correctPredictions: 0,
      totalPredictions: 0,
      badges: []
    };
    
    console.log('🔥 Kullanıcı oluşturuluyor:', userDoc);
    
    const userRef = await addDoc(collection(db, 'users'), userDoc);
    
    console.log('✅ Kullanıcı oluşturuldu, ID:', userRef.id);
    
    return userRef.id;
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    throw error;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  if (!isClient) throw new Error('Firebase operations are only available on the client side');
  
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Kullanıcı alma hatası:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!isClient) throw new Error('Firebase operations are only available on the client side');
  
  try {
    console.log(`🔍 Email ile kullanıcı aranıyor: ${email}`);
    
    const q = query(
      collection(db, 'users'),
      where('email', '==', email),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data();
      const user = {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as User;
      
      console.log(`✅ Mevcut kullanıcı bulundu: ${user.id}`);
      return user;
    }
    
    console.log(`❌ Bu email ile kullanıcı bulunamadı: ${email}`);
    return null;
  } catch (error) {
    console.error('Email ile kullanıcı arama hatası:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    throw error;
  }
};

// Tahmin işlemleri
export const createPrediction = async (predictionData: Omit<Prediction, 'id' | 'createdAt' | 'totalVotes' | 'yesVotes' | 'noVotes'>): Promise<string> => {
  try {
    const predictionDoc = {
      ...predictionData,
      endDate: Timestamp.fromDate(predictionData.endDate),
      createdAt: Timestamp.now(),
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0
    };
    
    const predictionRef = await addDoc(collection(db, 'predictions'), predictionDoc);
    
    console.log('✅ Tahmin oluşturuldu, ID:', predictionRef.id);
    
    return predictionRef.id;
  } catch (error) {
    console.error('Tahmin oluşturma hatası:', error);
    throw error;
  }
};

export const getActivePredictions = async (): Promise<Prediction[]> => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate()
      } as Prediction;
    });
  } catch (error) {
    console.error('Aktif tahminler alma hatası:', error);
    throw error;
  }
};

// Oy işlemleri
export const createVote = async (voteData: Omit<Vote, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const voteDoc = {
      ...voteData,
      createdAt: Timestamp.now()
    };
    
    const voteRef = await addDoc(collection(db, 'votes'), voteDoc);
    
    // Tahmin için oy sayılarını güncelle
    const predictionRef = doc(db, 'predictions', voteData.predictionId);
    const updateData = {
      totalVotes: increment(1),
      ...(voteData.choice === 'yes' ? { yesVotes: increment(1) } : { noVotes: increment(1) })
    };
    
    await updateDoc(predictionRef, updateData);
    
    console.log('✅ Oy oluşturuldu, ID:', voteRef.id);
    
    return voteRef.id;
  } catch (error) {
    console.error('Oy oluşturma hatası:', error);
    throw error;
  }
};

export const getUserVote = async (userId: string, predictionId: string): Promise<Vote | null> => {
  try {
    const q = query(
      collection(db, 'votes'),
      where('userId', '==', userId),
      where('predictionId', '==', predictionId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const voteDoc = querySnapshot.docs[0];
      const data = voteDoc.data();
      return {
        id: voteDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as Vote;
    }
    
    return null;
  } catch (error) {
    console.error('Kullanıcı oyu alma hatası:', error);
    throw error;
  }
};

// Leaderboard işlemleri
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const successRate = data.totalPredictions > 0 
        ? Math.round((data.correctPredictions / data.totalPredictions) * 100)
        : 0;
        
      return {
        userId: doc.id,
        xp: data.xp,
        correctPredictions: data.correctPredictions,
        totalPredictions: data.totalPredictions,
        successRate
      } as LeaderboardEntry;
    });
  } catch (error) {
    console.error('Leaderboard alma hatası:', error);
    throw error;
  }
};
