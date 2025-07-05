'use client'
import React, { useState, useEffect } from 'react';
import { 
  getActivePredictions, 
  resolvePrediction, 
  getLeaderboard,
  getUser,
  createPrediction 
} from '../../services/firebase';
import { Prediction, LeaderboardEntry } from '../../types';

export default function AdminPanel() {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Admin şifresi (basit demo için)
  const ADMIN_PASSWORD = 'predicta2025';

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadData();
      
      // Admin panelinde daha sık güncelleme (5 saniye)
      const interval = setInterval(() => {
        console.log('🔄 Admin paneli otomatik güncelleniyor...');
        loadData();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAdminLoggedIn]);

  const loadData = async () => {
    try {
      const [predictionsData, leaderboardData] = await Promise.all([
        getActivePredictions(),
        getLeaderboard(20) // Admin panelinde daha fazla göster
      ]);
      
      setPredictions(predictionsData);
      setLeaderboard(leaderboardData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Admin veri yükleme hatası:', error);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setAdminPassword('');
      alert('✅ Admin girişi başarılı!');
    } else {
      alert('❌ Yanlış admin şifresi!');
    }
  };

  const handleAdminResolve = async (predictionId: string, result: 'yes' | 'no') => {
    setLoading(true);
    try {
      console.log(`🔧 Admin tahmin sonuçlandırıyor: ${predictionId} - Sonuç: ${result}`);
      
      await resolvePrediction(predictionId, result);
      await loadData(); // Verileri yenile
      
      alert(`🎉 Admin tarafından sonuçlandırıldı!\n✅ Sonuç: ${result === 'yes' ? 'EVET' : 'HAYIR'}\n💎 Doğru tahmin yapanlar 10 XP bonus kazandı!\n🏆 Leaderboard güncellendi!`);
    } catch (error) {
      console.error('Admin sonuçlandırma hatası:', error);
      alert('❌ Hata: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const getUserDetails = async (userId: string) => {
    try {
      const user = await getUser(userId);
      if (user) {
        alert(`👤 Kullanıcı Detayları:\n\n🆔 ID: ${userId}\n📧 Email: ${user.email || 'Belirtilmemiş'}\n💎 XP: ${user.xp}\n✅ Doğru Tahmin: ${user.correctPredictions}\n📊 Toplam Tahmin: ${user.totalPredictions}\n🏆 Başarı Oranı: ${user.totalPredictions > 0 ? Math.round((user.correctPredictions / user.totalPredictions) * 100) : 0}%`);
      }
    } catch (error) {
      alert('❌ Kullanıcı detayları alınamadı: ' + error);
    }
  };

  const createDemoData = async () => {
    setLoading(true);
    try {
      const demoQuestions = [
        {
          question: 'Bitcoin 2024 yıl sonunda 100.000$ olacak mı?',
          description: 'Bitcoin\'in bu yıl sonunda 100.000 doları geçeceğini düşünüyor musunuz?',
          days: 30
        },
        {
          question: 'Türkiye Euro 2024\'te finale kalacak mı?',
          description: 'Türk Milli Takımı\'nın Euro 2024\'te finale kalma şansı var mı?',
          days: 15
        },
        {
          question: 'ChatGPT-5 2024 yılında çıkacak mı?',
          description: 'OpenAI\'ın yeni GPT modeli bu yıl içinde yayınlanacak mı?',
          days: 45
        }
      ];

             for (const demo of demoQuestions) {
         await createPrediction({
           creatorId: 'admin-demo',
           question: demo.question,
           description: demo.description,
           endDate: new Date(Date.now() + demo.days * 24 * 60 * 60 * 1000),
           status: 'active',
           result: null,
           correctAnswer: 'yes' // Demo için varsayılan
         });
       }

      await loadData();
      alert('🎉 Demo tahminler oluşturuldu!\n\n📝 3 adet örnek tahmin eklendi\n🗳️ Kullanıcılar oy verebilir\n🏆 Admin panelinden sonuçlandırabilirsiniz');
    } catch (error) {
      alert('❌ Demo veri oluşturma hatası: ' + error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔐 Admin Paneli</h1>
            <p className="text-gray-600">Predicta Yönetim Sistemi</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin şifresi girin"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-lg"
            />
            <button
              onClick={handleAdminLogin}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
            >
              🚀 Admin Girişi
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>💡 Demo şifresi: predicta2025</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <a
                  href="/"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                >
                  ← Ana Sayfa
                </a>
                <h1 className="text-3xl font-bold text-gray-800">🔧 Admin Paneli</h1>
              </div>
              <p className="text-gray-600">Predicta Yönetim Sistemi</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">🔄 Otomatik güncelleme: 5 sn</p>
              <p className="text-xs text-gray-400">Son: {lastUpdate.toLocaleTimeString('tr-TR')}</p>
              <button
                onClick={() => setIsAdminLoggedIn(false)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600"
              >
                🚪 Çıkış
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aktif Tahminler - Admin Kontrolü */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">🎯 Aktif Tahminler (Admin Kontrolü)</h2>
            {predictions.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 text-lg">Henüz aktif tahmin bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
                    <h3 className="font-bold text-lg mb-2 text-gray-800">{prediction.question}</h3>
                    {prediction.description && (
                      <p className="text-gray-600 mb-3 text-sm">{prediction.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <p>📅 Bitiş: {prediction.endDate.toLocaleDateString('tr-TR')}</p>
                        <p>📊 Oy Durumu: {prediction.totalVotes} toplam (Evet: {prediction.yesVotes}, Hayır: {prediction.noVotes})</p>
                        <p>👤 Oluşturan: {prediction.creatorId.slice(0, 8)}...</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAdminResolve(prediction.id, 'yes')}
                          disabled={loading}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          🏆 EVET Sonucu
                        </button>
                        <button
                          onClick={() => handleAdminResolve(prediction.id, 'no')}
                          disabled={loading}
                          className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          🏆 HAYIR Sonucu
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard - Admin Görünümü */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">🏆 Liderlik Tablosu (Admin Görünümü)</h2>
            {leaderboard.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 text-lg">Henüz kullanıcı bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {leaderboard.map((entry, index) => (
                  <div key={entry.userId} className={`flex justify-between items-center p-3 rounded-lg transition-all cursor-pointer hover:bg-gray-100 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-300' :
                    index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-300' :
                    index === 2 ? 'bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-300' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                  onClick={() => getUserDetails(entry.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-lg ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-700'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <div>
                        <p className="font-medium text-sm">User {entry.userId.slice(0, 12)}...</p>
                        <p className="text-xs text-gray-500">👆 Detay için tıkla</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-700'
                      }`}>
                        💎 {entry.xp} XP
                      </p>
                      <p className="text-xs text-gray-600">
                        ✅ {entry.correctPredictions}/{entry.totalPredictions} ({entry.successRate}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Bilgileri */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-purple-600">📊 Admin Kontrol Paneli</h3>
            <button
              onClick={createDemoData}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              🎯 Demo Veri Oluştur
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800">🎯 Aktif Tahminler</h4>
              <p className="text-2xl font-bold text-blue-600">{predictions.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800">👥 Toplam Kullanıcı</h4>
              <p className="text-2xl font-bold text-green-600">{leaderboard.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800">💎 Toplam XP Dağıtıldı</h4>
              <p className="text-2xl font-bold text-purple-600">
                {leaderboard.reduce((total, user) => total + user.xp, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 