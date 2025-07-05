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
import { User, Prediction, Vote, LeaderboardEntry } from '../types';

// Kullanıcı işlemleri
export const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<string> => {
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
    const predictionRef = await addDoc(collection(db, 'predictions'), {
      ...predictionData,
      createdAt: Timestamp.now(),
      totalVotes: 0,
      yesVotes: 0,
      noVotes: 0,
      endDate: Timestamp.fromDate(predictionData.endDate)
    });
    console.log(`🎯 Tahmin oluşturuldu: ${predictionRef.id}, Doğru cevap: ${predictionData.correctAnswer}`);
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
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        endDate: data.endDate.toDate()
      } as Prediction;
    });
  } catch (error) {
    console.error('Aktif tahminleri alma hatası:', error);
    throw error;
  }
};

export const getPrediction = async (predictionId: string): Promise<Prediction | null> => {
  try {
    const predictionDoc = await getDoc(doc(db, 'predictions', predictionId));
    if (predictionDoc.exists()) {
      const data = predictionDoc.data();
      return {
        id: predictionDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        endDate: data.endDate.toDate()
      } as Prediction;
    }
    return null;
  } catch (error) {
    console.error('Tahmin alma hatası:', error);
    throw error;
  }
};

export const resolvePrediction = async (predictionId: string, result: 'yes' | 'no'): Promise<void> => {
  try {
    await updateDoc(doc(db, 'predictions', predictionId), {
      status: 'resolved',
      result: result
    });
    
    // Doğru tahmin yapanları bul ve XP ver
    await distributeXP(predictionId, result);
  } catch (error) {
    console.error('Tahmin sonuçlandırma hatası:', error);
    throw error;
  }
};

// Oy işlemleri
export const createVote = async (voteData: Omit<Vote, 'id' | 'createdAt'>): Promise<string> => {
  try {
    console.log(`🗳️ Oy veriliyor: Kullanıcı ${voteData.userId}, Tahmin ${voteData.predictionId}, Seçim: ${voteData.choice}`);
    
    // Önce kullanıcının bu tahmin için oy verip vermediğini kontrol et
    const existingVoteQuery = query(
      collection(db, 'votes'),
      where('userId', '==', voteData.userId),
      where('predictionId', '==', voteData.predictionId)
    );
    const existingVotes = await getDocs(existingVoteQuery);
    
    if (!existingVotes.empty) {
      throw new Error('Bu tahmin için zaten oy kullandınız');
    }

    // Oy oluştur
    const voteRef = await addDoc(collection(db, 'votes'), {
      ...voteData,
      createdAt: Timestamp.now()
    });

    console.log(`✅ Oy başarıyla kaydedildi: ${voteRef.id}`);

    // 🎯 OY VERME ÖDÜLÜ: Her oy için 5 XP ver!
    console.log(`💎 Oy verme ödülü veriliyor: Kullanıcı ${voteData.userId} → +5 XP`);
    
    try {
      const voterRef = doc(db, 'users', voteData.userId);
      const voterDoc = await getDoc(voterRef);
      
      if (voterDoc.exists()) {
        const voterData = voterDoc.data();
        const currentXP = voterData.xp || 0;
        const currentTotal = voterData.totalPredictions || 0;
        
        console.log(`📊 Kullanıcı ${voteData.userId} - Mevcut XP: ${currentXP}`);
        
        await updateDoc(voterRef, {
          xp: currentXP + 5, // Her oy için 5 XP
          totalPredictions: currentTotal + 1 // Toplam tahmin sayısını artır
        });
        
        console.log(`✅ Oy verme ödülü verildi! Kullanıcı ${voteData.userId} - YENİ XP: ${currentXP + 5}`);
      } else {
        console.error(`❌ Oy veren kullanıcı ${voteData.userId} dökümanı bulunamadı!`);
      }
    } catch (xpError) {
      console.error(`❌ Oy verme XP hatası:`, xpError);
    }

    // Tahmin istatistiklerini güncelle
    const predictionRef = doc(db, 'predictions', voteData.predictionId);
    const predictionDoc = await getDoc(predictionRef);
    
    if (predictionDoc.exists()) {
      const predictionData = predictionDoc.data();
      const currentTotal = predictionData.totalVotes || 0;
      const currentChoice = predictionData[`${voteData.choice}Votes`] || 0;
      
      await updateDoc(predictionRef, {
        totalVotes: currentTotal + 1,
        [`${voteData.choice}Votes`]: currentChoice + 1
      });
      
      console.log(`📊 Tahmin istatistikleri güncellendi - Toplam: ${currentTotal + 1}, ${voteData.choice}: ${currentChoice + 1}`);
    }

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
      where('predictionId', '==', predictionId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
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

// XP dağıtım fonksiyonu
const distributeXP = async (predictionId: string, correctResult: 'yes' | 'no'): Promise<void> => {
  try {
    console.log(`🎯 XP dağıtımı başlıyor - Tahmin: ${predictionId}, Doğru sonuç: ${correctResult}`);
    
    // Doğru oy veren kullanıcıları bul
    const correctVotesQuery = query(
      collection(db, 'votes'),
      where('predictionId', '==', predictionId),
      where('choice', '==', correctResult)
    );
    const correctVotes = await getDocs(correctVotesQuery);
    
    console.log(`✅ Doğru oy veren kullanıcı sayısı: ${correctVotes.docs.length}`);

    // Tüm oyları bul (totalPredictions için)
    const allVotesQuery = query(
      collection(db, 'votes'),
      where('predictionId', '==', predictionId)
    );
    const allVotes = await getDocs(allVotesQuery);
    
    console.log(`📊 Toplam oy sayısı: ${allVotes.docs.length}`);

    // 🏆 DOĞRU TAHMİN BONUS: Doğru oy veren kullanıcılara ek 10 XP ver!
    for (const voteDoc of correctVotes.docs) {
      const vote = voteDoc.data();
      const userRef = doc(db, 'users', vote.userId);
      
      console.log(`🏆 DOĞRU TAHMİN BONUS: Kullanıcı ${vote.userId} için ek 10 XP veriliyor...`);
      
      try {
        // Önce kullanıcının mevcut verilerini al
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentXP = userData.xp || 0;
          const currentCorrect = userData.correctPredictions || 0;
          
          console.log(`📊 Kullanıcı ${vote.userId} - Mevcut XP: ${currentXP}, Doğru tahmin: ${currentCorrect}`);
          
          // Ek 10 XP ver ve doğru tahmin sayısını artır
          await updateDoc(userRef, {
            xp: currentXP + 10, // Ek 10 XP (zaten oy verirken 5 XP almıştı)
            correctPredictions: currentCorrect + 1
          });
          
          console.log(`✅ DOĞRU TAHMİN BONUS! Kullanıcı ${vote.userId} - YENİ XP: ${currentXP + 10} (+10 bonus), Doğru tahmin: ${currentCorrect + 1}`);
          console.log(`🎉 Toplam kazanım: 5 XP (oy) + 10 XP (doğru bonus) = 15 XP!`);
        } else {
          console.error(`❌ Kullanıcı ${vote.userId} dökümanı bulunamadı!`);
        }
      } catch (userError) {
        console.error(`❌ Kullanıcı ${vote.userId} XP güncelleme hatası:`, userError);
      }
    }

    // ℹ️ NOT: totalPredictions artık oy verirken güncelleniyor, burada tekrar artırmaya gerek yok
    console.log(`ℹ️ totalPredictions zaten oy verirken güncellendi, tekrar artırılmadı`)
    
    console.log(`🎉 XP dağıtımı tamamlandı!`);
  } catch (error) {
    console.error('XP dağıtım hatası:', error);
    throw error;
  }
};

// Leaderboard
// Otomatik sonuçlandırma - Süresi dolmuş tahminleri kontrol et
export const checkAndResolveExpiredPredictions = async (): Promise<void> => {
  try {
    console.log('⏰ Süresi dolmuş tahminler kontrol ediliyor...');
    
    const now = new Date();
    const q = query(
      collection(db, 'predictions'),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    const predictions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        endDate: data.endDate.toDate()
      } as Prediction;
    });
    
    let resolvedCount = 0;
    
    for (const prediction of predictions) {
      if (prediction.endDate <= now) {
        console.log(`⏰ Süresi dolmuş tahmin bulundu: ${prediction.id} - Doğru cevap: ${prediction.correctAnswer}`);
        
        // Otomatik sonuçlandır
        await updateDoc(doc(db, 'predictions', prediction.id), {
          status: 'resolved',
          result: prediction.correctAnswer
        });
        
        // XP dağıt
        await distributeXP(prediction.id, prediction.correctAnswer);
        
        resolvedCount++;
        console.log(`✅ Tahmin otomatik sonuçlandırıldı: ${prediction.id} - Sonuç: ${prediction.correctAnswer}`);
      }
    }
    
    if (resolvedCount > 0) {
      console.log(`🎉 Toplam ${resolvedCount} tahmin otomatik sonuçlandırıldı!`);
    } else {
      console.log('✅ Süresi dolmuş tahmin bulunamadı.');
    }
  } catch (error) {
    console.error('Otomatik sonuçlandırma hatası:', error);
  }
};

// Kullanıcının sonuçlanmış tahminlerini getir
export const getUserResolvedPredictions = async (userId: string): Promise<any[]> => {
  try {
    console.log(`📜 Kullanıcının geçmiş tahminleri getiriliyor: ${userId}`);
    
    // 1. Kullanıcının oylarını al
    const votesQuery = query(
      collection(db, 'votes'),
      where('userId', '==', userId)
    );
    const votesSnapshot = await getDocs(votesQuery);
    
    // 2. Sonuçlanmış tahminleri al
    const resolvedQuery = query(
      collection(db, 'predictions'),
      where('status', '==', 'resolved')
    );
    const resolvedSnapshot = await getDocs(resolvedQuery);
    
    // 3. Kullanıcının oyladığı ve sonuçlanmış tahminleri eşleştir
    const userVotes = votesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        predictionId: data.predictionId,
        choice: data.choice,
        createdAt: data.createdAt.toDate()
      } as Vote;
    });
    
    const resolvedPredictions = resolvedSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        endDate: data.endDate.toDate()
      } as Prediction;
    });
    
    // 4. Kullanıcının katıldığı sonuçlanmış tahminleri birleştir
    const userResolvedPredictions = [];
    
    for (const vote of userVotes) {
      const prediction = resolvedPredictions.find(p => p.id === vote.predictionId);
      if (prediction) {
        const isCorrect = vote.choice === prediction.result;
        const xpEarned = isCorrect ? 15 : 5; // Doğru: 15 XP, Yanlış: 5 XP
        
        userResolvedPredictions.push({
          ...prediction,
          userVote: vote.choice,
          isCorrect,
          xpEarned,
          voteDate: vote.createdAt
        });
      }
    }
    
    // 5. Tarihine göre sırala (en yeni önce)
    userResolvedPredictions.sort((a, b) => b.voteDate.getTime() - a.voteDate.getTime());
    
    console.log(`✅ ${userResolvedPredictions.length} geçmiş tahmin bulundu`);
    return userResolvedPredictions;
  } catch (error) {
    console.error('Geçmiş tahminler alma hatası:', error);
    throw error;
  }
};

export const getLeaderboard = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const successRate = data.totalPredictions > 0 
        ? (data.correctPredictions / data.totalPredictions) * 100 
        : 0;
      
      return {
        userId: doc.id,
        xp: data.xp,
        correctPredictions: data.correctPredictions,
        totalPredictions: data.totalPredictions,
        successRate: Math.round(successRate)
      } as LeaderboardEntry;
    });
    
    // Frontend'de sırala (XP'ye göre azalan)
    return users.sort((a, b) => b.xp - a.xp);
  } catch (error) {
    console.error('Leaderboard alma hatası:', error);
    throw error;
  }
}; 