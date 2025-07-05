import React from 'react';
import { User, UserStats, Badge, Prediction } from '@/types';

// Mock icons
const TrophyIcon = () => <span>🏆</span>;
const StarIcon = () => <span>⭐</span>;
const CalendarIcon = () => <span>📅</span>;
const TargetIcon = () => <span>🎯</span>;
const FireIcon = () => <span>🔥</span>;
const TrendingUpIcon = () => <span>📈</span>;

interface UserProfileProps {
  user: User;
  stats: UserStats;
  recentPredictions?: Prediction[];
  isOwner?: boolean;
}

const mockBadges: Badge[] = [
  {
    id: 'first_prediction',
    name: 'İlk Tahmin',
    description: 'İlk tahminini oluşturdun!',
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'early_adopter',
    name: 'Erken Kullanıcı',
    description: 'Platformun ilk kullanıcılarından birisin!',
    icon: '🚀',
    rarity: 'rare'
  },
  {
    id: 'prediction_master',
    name: 'Tahmin Ustası',
    description: '10 doğru tahmin yaptın!',
    icon: '🧙‍♂️',
    rarity: 'epic'
  }
];

export default function UserProfile({ 
  user, 
  stats, 
  recentPredictions = [],
  isOwner = false 
}: UserProfileProps) {
  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  const getXpForNextLevel = (currentXp: number) => {
    const currentLevel = calculateLevel(currentXp);
    return currentLevel * 1000;
  };

  const getXpProgress = (currentXp: number) => {
    const currentLevelXp = (calculateLevel(currentXp) - 1) * 1000;
    const xpInCurrentLevel = currentXp - currentLevelXp;
    return (xpInCurrentLevel / 1000) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.displayName || 'Anonim Kullanıcı'}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <CalendarIcon />
                  <span>Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <StarIcon />
                  <span>Level {calculateLevel(user.xp)}</span>
                </div>
              </div>
            </div>

            {/* Level Progress */}
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {user.xp} XP
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getXpProgress(user.xp)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {getXpForNextLevel(user.xp) - user.xp} XP to Level {calculateLevel(user.xp) + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Badges */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUpIcon />
                <span>İstatistikler</span>
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TargetIcon />
                    <span className="text-gray-600">Toplam Tahmin</span>
                  </div>
                  <span className="font-semibold">{stats.totalPredictions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span className="text-gray-600">Doğru Tahmin</span>
                  </div>
                  <span className="font-semibold text-green-600">{stats.correctPredictions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>📊</span>
                    <span className="text-gray-600">Doğruluk Oranı</span>
                  </div>
                  <span className="font-semibold text-blue-600">{stats.accuracy}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>🗳️</span>
                    <span className="text-gray-600">Toplam Oy</span>
                  </div>
                  <span className="font-semibold">{stats.totalVotes}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FireIcon />
                    <span className="text-gray-600">Mevcut Seri</span>
                  </div>
                  <span className="font-semibold text-orange-600">{stats.currentStreak}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrophyIcon />
                    <span className="text-gray-600">En Uzun Seri</span>
                  </div>
                  <span className="font-semibold text-purple-600">{stats.longestStreak}</span>
                </div>
              </div>
            </div>

            {/* Badges Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>🏅</span>
                <span>Rozetler</span>
              </h2>
              
              {mockBadges.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {mockBadges.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-3 rounded-lg border ${getBadgeColor(badge.rarity)}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{badge.name}</div>
                          <div className="text-sm opacity-75">{badge.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl mb-2 block">🏅</span>
                  <p>Henüz rozet yok</p>
                  <p className="text-sm">Tahmin yaparak rozet kazanmaya başla!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <span>📊</span>
                <span>Son Aktiviteler</span>
              </h2>
              
              {recentPredictions.length > 0 ? (
                <div className="space-y-4">
                  {recentPredictions.map((prediction, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {prediction.question}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{prediction.category}</span>
                            <span>{new Date(prediction.createdAt).toLocaleDateString('tr-TR')}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              prediction.isResolved 
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {prediction.isResolved ? 'Sonuçlandı' : 'Aktif'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {prediction.totalVotes} oy
                          </div>
                          {prediction.isResolved && (
                            <div className={`text-xs ${
                              prediction.outcome ? 'text-green-600' : 'text-red-600'
                            }`}>
                              Sonuç: {prediction.outcome ? 'Evet' : 'Hayır'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <span className="text-6xl mb-4 block">📊</span>
                  <h3 className="text-lg font-medium mb-2">Henüz aktivite yok</h3>
                  <p>Bu kullanıcı henüz tahmin oluşturmamış veya oy vermemiş.</p>
                  {isOwner && (
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      İlk Tahmini Oluştur
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
