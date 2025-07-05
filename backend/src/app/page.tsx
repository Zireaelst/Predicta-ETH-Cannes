'use client'
import React, { useState, useEffect } from 'react';
import { 
  createUser, 
  createPrediction, 
  getActivePredictions, 
  createVote, 
  getUserVote,
  getLeaderboard,
  checkAndResolveExpiredPredictions,
  getUserByEmail,
  getUserResolvedPredictions
} from '../services/firebase';
import { Prediction, LeaderboardEntry } from '../types';

export default function Home() {
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [resolvedPredictions, setResolvedPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showResolved, setShowResolved] = useState(false);

  // Form states
  const [userEmail, setUserEmail] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<'yes' | 'no'>('yes');

  useEffect(() => {
    loadPredictions();
    loadLeaderboard();

    // Leaderboard'u her 10 saniyede bir güncelle (canlı güncelleme)
    const leaderboardInterval = setInterval(() => {
      console.log('🔄 Leaderboard otomatik güncelleniyor...');
      loadLeaderboard();
    }, 10000); // 10 saniye

    // Tahminleri her 15 saniyede bir güncelle + otomatik sonuçlandırma
    const predictionsInterval = setInterval(async () => {
      console.log('🔄 Tahminler otomatik güncelleniyor...');
      await checkAndResolveExpiredPredictions(); // Süresi dolmuş tahminleri kontrol et
      loadPredictions();
      loadLeaderboard(); // Sonuçlandırma sonrası leaderboard güncelle
      if (currentUserId) {
        loadResolvedPredictions(); // Geçmiş tahminleri de güncelle
      }
    }, 15000); // 15 saniye

    // Cleanup function
    return () => {
      clearInterval(leaderboardInterval);
      clearInterval(predictionsInterval);
    };
  }, []);

  const loadPredictions = async () => {
    try {
      const data = await getActivePredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Tahminler yüklenemedi:', error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Leaderboard yüklenemedi:', error);
    }
  };

  const loadResolvedPredictions = async () => {
    if (!currentUserId) return;
    try {
      console.log('📜 Geçmiş tahminler yükleniyor...');
      const data = await getUserResolvedPredictions(currentUserId);
      setResolvedPredictions(data);
      console.log(`✅ ${data.length} geçmiş tahmin yüklendi`);
    } catch (error) {
      console.error('Geçmiş tahminler yüklenemedi:', error);
    }
  };

  const handleCreateUser = async () => {
    if (!userEmail) {
      alert('Lütfen e-posta adresinizi girin!');
      return;
    }
    
    // Basit email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert('Lütfen geçerli bir e-posta adresi girin!');
      return;
    }
    
    setLoading(true);
    try {
      console.log(`🔐 Giriş işlemi başlatılıyor: ${userEmail}`);
      
      // 1. Email ile mevcut kullanıcı kontrolü yap
      const existingUser = await getUserByEmail(userEmail);
      
      if (existingUser) {
        // Mevcut kullanıcı ile giriş yap
        setCurrentUserId(existingUser.id);
        setUserEmail('');
        
        console.log(`🔓 Mevcut hesap ile giriş yapıldı: ${existingUser.id}`);
        
        // Verileri yenile
        await loadPredictions();
        await loadLeaderboard();
        await loadResolvedPredictions();
        
        alert(`🔓 Hoş geldin!\n👤 Mevcut hesabınla giriş yapıldı\n💎 Mevcut XP: ${existingUser.xp}\n✅ Doğru Tahmin: ${existingUser.correctPredictions}\n📊 Toplam Tahmin: ${existingUser.totalPredictions}`);
      } else {
        // Yeni kullanıcı oluştur
        const userId = await createUser({
          email: userEmail,
          xp: 0,
          correctPredictions: 0,
          totalPredictions: 0,
          badges: []
        });
        setCurrentUserId(userId);
        setUserEmail('');
        
        console.log(`✨ Yeni hesap oluşturuldu: ${userId}`);
        
                 // Verileri yenile
         await loadPredictions();
         await loadLeaderboard();
         await loadResolvedPredictions();
         
         alert(`✨ Hoş geldin!\n👤 Yeni hesabın oluşturuldu\n🎯 Başlangıç XP: 0\n\n💡 Tahmin oluşturun veya mevcut tahminlere oy verin!`);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş hatası: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrediction = async () => {
    if (!newQuestion || !endDate || !currentUserId) return;
    setLoading(true);
    try {
      await createPrediction({
        creatorId: currentUserId,
        question: newQuestion,
        description: newDescription,
        endDate: new Date(endDate),
        status: 'active',
        result: null,
        correctAnswer: correctAnswer
      });
      setNewQuestion('');
      setNewDescription('');
      setEndDate('');
      setCorrectAnswer('yes');
      await loadPredictions();
      alert('Tahmin oluşturuldu!');
    } catch (error) {
      alert('Hata: ' + error);
    } finally {
      setLoading(false)
    }
  };

  const handleVote = async (predictionId: string, choice: 'yes' | 'no') => {
    if (!currentUserId) {
      alert('Önce giriş yapın!');
      return;
    }
    setLoading(true);
    try {
      console.log(`🗳️ Oy verme işlemi başlıyor: ${choice}`);
      
      await createVote({
        userId: currentUserId,
        predictionId,
        choice
      });
      
      // Tahminleri yenile
      await loadPredictions();
      
      // Leaderboard'u da yenile (canlı güncelleme için)
      await loadLeaderboard();
      
      // Geçmiş tahminleri de yenile (eğer bir tahmin sonuçlandıysa)
      await loadResolvedPredictions();
      
      alert(`✅ Oyunuz kaydedildi: ${choice === 'yes' ? 'EVET' : 'HAYIR'}\n\n💎 +5 XP kazandınız! (Oy verme ödülü)\n🏆 Tahmin doğru çıkarsa +10 XP daha alacaksınız!\n\n📊 Toplam potansiyel: 15 XP`);
      
      console.log(`✅ Oy verme tamamlandı, leaderboard güncellendi`);
    } catch (error) {
      console.error('Oy verme hatası:', error);
      alert('Hata: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const createTestPrediction = async () => {
    if (!currentUserId) {
      alert('Önce giriş yapın!');
      return;
    }
    setLoading(true);
    try {
      await createPrediction({
        creatorId: currentUserId,
        question: 'Bitcoin 2024 yıl sonunda 100.000$ olacak mı?',
        description: 'Bitcoin\'in bu yıl sonunda 100.000 doları geçeceğini düşünüyor musunuz?',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
        status: 'active',
        result: null,
        correctAnswer: 'yes' // Test için varsayılan
      });
      await loadPredictions();
      alert('Test tahmini oluşturuldu!');
    } catch (error) {
      alert('Hata: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const createQuickTestPrediction = async () => {
    if (!currentUserId) {
      alert('Önce giriş yapın!');
      return;
    }
    setLoading(true);
    try {
      await createPrediction({
        creatorId: currentUserId,
        question: '⚡ Hızlı Test: Bu tahmin 2 dakika sonra otomatik sonuçlandırılacak!',
        description: 'Otomatik sonuçlandırma sistemini test etmek için. Doğru cevap: EVET',
        endDate: new Date(Date.now() + 2 * 60 * 1000), // 2 dakika sonra
        status: 'active',
        result: null,
        correctAnswer: 'yes' // Test için doğru cevap
      });
      await loadPredictions();
      alert('⚡ Hızlı test tahmini oluşturuldu!\n\n🕒 2 dakika sonra otomatik sonuçlandırılacak\n✅ Doğru cevap: EVET\n🎯 Hemen oy verin ve sistemi test edin!');
    } catch (error) {
      alert('Hata: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const checkMyXP = async () => {
    if (!currentUserId) {
      alert('Önce giriş yapın!');
      return;
    }
    try {
      // Geçmiş tahminleri yenile
      await loadResolvedPredictions();
      
      const { getUser } = await import('../services/firebase');
      const userData = await getUser(currentUserId);
      if (userData) {
        alert(`🎯 XP Durumunuz:\n💎 Toplam XP: ${userData.xp}\n✅ Doğru Tahmin: ${userData.correctPredictions}\n📊 Toplam Tahmin: ${userData.totalPredictions}\n🏆 Başarı Oranı: ${userData.totalPredictions > 0 ? Math.round((userData.correctPredictions / userData.totalPredictions) * 100) : 0}%\n\n📜 Geçmiş tahminlerinizi aşağıdan görebilirsiniz!`);
      } else {
        alert('Kullanıcı verisi bulunamadı!');
      }
    } catch (error) {
      alert('XP kontrol hatası: ' + error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">
            🔮 Predicta - Sosyal Tahmin Platformu
          </h1>
          <a
            href="/admin"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md"
          >
            🔧 Admin Paneli
          </a>
        </div>

        {/* Kullanıcı Girişi */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">👤 Kullanıcı İşlemleri</h2>
          <p className="text-sm text-gray-600 mb-4">
            📧 E-posta adresinizi girin - mevcut hesap varsa giriş yapılır, yoksa yeni hesap oluşturulur
          </p>
          <div className="flex gap-4 items-center">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={handleCreateUser}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {loading ? '🔄 Kontrol ediliyor...' : '🔐 Giriş Yap / Hesap Oluştur'}
            </button>
          </div>
          {currentUserId && (
            <div className="mt-2 space-y-2">
              <p className="text-green-600">✅ Giriş yapıldı! User ID: {currentUserId}</p>
              <button
                onClick={checkMyXP}
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
              >
                🎯 XP Durumumu Kontrol Et
              </button>
            </div>
          )}
        </div>

        {/* Tahmin Oluşturma */}
        {currentUserId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📝 Tahmin Oluştur</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tahmin sorusu (ör: Bitcoin 2024 sonunda 100k$ olacak mı?)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <textarea
                placeholder="Açıklama (isteğe bağlı)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2"
              />
              <div className="border border-orange-300 rounded-lg p-4 bg-orange-50">
                <label className="block text-sm font-medium text-orange-800 mb-2">
                  🔒 Doğru Cevap (Gizli - Süre dolduğunda otomatik sonuçlandırma)
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="yes"
                      checked={correctAnswer === 'yes'}
                      onChange={(e) => setCorrectAnswer(e.target.value as 'yes' | 'no')}
                      className="mr-2"
                    />
                    <span className="text-green-700 font-medium">✅ EVET</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      checked={correctAnswer === 'no'}
                      onChange={(e) => setCorrectAnswer(e.target.value as 'yes' | 'no')}
                      className="mr-2"
                    />
                    <span className="text-red-700 font-medium">❌ HAYIR</span>
                  </label>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  ⚡ Bu bilgi gizli tutulur ve otomatik sonuçlandırma için kullanılır
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleCreatePrediction}
                  disabled={loading}
                  className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Tahmin Oluştur
                </button>
                <button
                  onClick={createTestPrediction}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  🧪 Test Tahmini (30 gün)
                </button>
                <button
                  onClick={createQuickTestPrediction}
                  disabled={loading}
                  className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  ⚡ Hızlı Test (2 dk)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Aktif Tahminler */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">🎯 Aktif Tahminler</h2>
          {predictions.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 text-lg mb-4">Henüz aktif tahmin bulunmuyor.</p>
              {currentUserId && (
                <p className="text-blue-600">Yukarıdan yeni bir tahmin oluşturun! 👆</p>
              )}
              {!currentUserId && (
                <p className="text-orange-600">Tahmin oluşturmak için önce giriş yapın! 👆</p>
              )}
            </div>
          ) : (
            <div className="grid gap-6">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <h3 className="font-bold text-xl mb-3 text-gray-800">{prediction.question}</h3>
                  {prediction.description && (
                    <p className="text-gray-600 mb-4 text-base">{prediction.description}</p>
                  )}
                  
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="text-sm text-gray-500 space-y-1">
                      <p className="font-medium">📅 Bitiş: {prediction.endDate.toLocaleDateString('tr-TR')} {prediction.endDate.toLocaleTimeString('tr-TR')}</p>
                      <p className="font-medium">📊 Toplam Oy: {prediction.totalVotes} (Evet: {prediction.yesVotes}, Hayır: {prediction.noVotes})</p>
                      <p className="text-xs text-purple-600">⚡ Otomatik sonuçlandırma: Süre dolduğunda</p>
                      <p className="text-xs text-orange-600">🔒 Doğru cevap gizli - Creator tarafından belirlendi</p>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {/* Oy Verme Butonları */}
                      <div className="flex gap-3">
                        {currentUserId ? (
                          <>
                            <button
                              onClick={() => handleVote(prediction.id, 'yes')}
                              disabled={loading}
                              className="bg-green-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md"
                            >
                              ✅ EVET
                            </button>
                            <button
                              onClick={() => handleVote(prediction.id, 'no')}
                              disabled={loading}
                              className="bg-red-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center gap-2 shadow-md"
                            >
                              ❌ HAYIR
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-3">
                                                         <button
                               onClick={() => alert('💎 Oy vermek için önce giriş yapın!\n\n🎁 Her oy için +5 XP kazanabilirsiniz!\n🏆 Doğru tahmin için +10 XP bonus!')}
                               className="bg-gray-400 text-white px-8 py-3 rounded-lg font-bold text-lg cursor-not-allowed shadow-md"
                             >
                               ✅ EVET
                             </button>
                             <button
                               onClick={() => alert('💎 Oy vermek için önce giriş yapın!\n\n🎁 Her oy için +5 XP kazanabilirsiniz!\n🏆 Doğru tahmin için +10 XP bonus!')}
                               className="bg-gray-400 text-white px-8 py-3 rounded-lg font-bold text-lg cursor-not-allowed shadow-md"
                             >
                               ❌ HAYIR
                             </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Geçmiş Tahminler (Sadece giriş yapan kullanıcı için) */}
        {currentUserId && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">📜 Geçmiş Tahminlerim</h2>
              <button
                onClick={() => setShowResolved(!showResolved)}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                {showResolved ? '👁️ Gizle' : '👁️ Göster'} ({resolvedPredictions.length})
              </button>
            </div>
            
            {showResolved && (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {resolvedPredictions.length === 0 ? (
                  <div className="text-center p-8">
                    <p className="text-gray-500 text-lg mb-2">Henüz sonuçlanmış tahmin bulunmuyor.</p>
                    <p className="text-blue-600 text-sm">Oy verin ve tahminlerin sonuçlanmasını bekleyin!</p>
                  </div>
                ) : (
                  resolvedPredictions.map((prediction) => (
                    <div 
                      key={prediction.id} 
                      className={`border-2 rounded-xl p-4 transition-colors ${
                        prediction.isCorrect 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-red-300 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-800 flex-1">{prediction.question}</h3>
                        <div className="text-right ml-4">
                          <span className={`text-2xl font-bold ${prediction.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {prediction.isCorrect ? '🎉 DOĞRU!' : '😞 YANLIŞ'}
                          </span>
                          <p className="text-sm font-bold text-purple-600">💎 +{prediction.xpEarned} XP</p>
                        </div>
                      </div>
                      
                      {prediction.description && (
                        <p className="text-gray-600 mb-3 text-sm">{prediction.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="bg-blue-100 p-3 rounded">
                          <p className="font-medium text-blue-800">🗳️ Benim Oyum</p>
                          <p className="text-blue-600 font-bold">
                            {prediction.userVote === 'yes' ? '✅ EVET' : '❌ HAYIR'}
                          </p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded">
                          <p className="font-medium text-gray-800">🎯 Doğru Cevap</p>
                          <p className="text-gray-600 font-bold">
                            {prediction.result === 'yes' ? '✅ EVET' : '❌ HAYIR'}
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded">
                          <p className="font-medium text-purple-800">📅 Oy Tarihi</p>
                          <p className="text-purple-600 text-xs">
                            {prediction.voteDate.toLocaleDateString('tr-TR')} <br/>
                            {prediction.voteDate.toLocaleTimeString('tr-TR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">🏆 Liderlik Tablosu</h2>
            <div className="text-sm text-gray-500">
              <p>🔄 Canlı güncelleme aktif</p>
              <p className="text-xs">Son: {lastUpdate.toLocaleTimeString('tr-TR')}</p>
            </div>
          </div>
          {leaderboard.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-gray-500 text-lg mb-2">Henüz sıralama bulunmuyor.</p>
              <p className="text-blue-600 text-sm">Tahmin oluşturun ve oy verin!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={entry.userId} className={`flex justify-between items-center p-4 rounded-lg transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300' :
                  index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50 border-2 border-gray-300' :
                  index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-50 border-2 border-orange-300' :
                  'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-xl ${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-600' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-700'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <div>
                      <p className="font-medium">User {entry.userId.slice(0, 8)}...</p>
                      {entry.userId === currentUserId && (
                        <p className="text-xs text-blue-600 font-semibold">👤 SİZ</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-600' :
                      index === 2 ? 'text-orange-600' :
                      'text-gray-700'
                    }`}>
                      💎 {entry.xp} XP
                    </p>
                    <p className="text-sm text-gray-600">
                      ✅ {entry.correctPredictions}/{entry.totalPredictions} ({entry.successRate}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Yardım */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Nasıl Kullanılır?</h3>
          <ol className="text-blue-700 space-y-1">
            <li>1. <strong>E-posta ile giriş yapın</strong> - mevcut hesap varsa otomatik giriş</li>
            <li>2. Yeni tahmin oluştururken <strong>gizli doğru cevabı</strong> belirleyin</li>
            <li>3. Mevcut tahminlere oy verin - <strong>Her oy için +5 XP</strong> (anında)</li>
            <li>4. <strong>Süre dolduğunda otomatik sonuçlandırma</strong> yapılır</li>
            <li>5. <strong>Doğru tahmin için +10 XP bonus</strong> (otomatik)</li>
            <li>6. Toplam: Doğru tahmin = 15 XP, Yanlış tahmin = 5 XP</li>
            <li>7. Liderlik tablosu canlı güncellenir (10 saniyede bir)</li>
            <li>8. Admin panelinden manuel sonuçlandırma da yapılabilir</li>
            <li>9. <strong>Aynı email ile tekrar giriş = aynı hesap</strong> 🔐</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
