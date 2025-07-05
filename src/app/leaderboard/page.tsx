import React from 'react';
import Link from 'next/link';
import { User } from '@/types';

// Mock icons
const TrophyIcon = () => <span>🏆</span>;
const CrownIcon = () => <span>👑</span>;
const MedalIcon = () => <span>🥇</span>;
const ArrowLeftIcon = () => <span>←</span>;

// Mock leaderboard data
const mockLeaderboard: (User & { rank: number })[] = [
  {
    id: 'user1',
    rank: 1,
    email: 'crypto_king@example.com',
    displayName: 'CryptoKing',
    xp: 5420,
    level: 6,
    badges: ['legendary_predictor', 'crypto_expert', 'early_adopter'],
    createdAt: new Date('2024-01-01'),
    lastActive: new Date()
  },
  {
    id: 'user2', 
    rank: 2,
    email: 'prediction_master@example.com',
    displayName: 'PredictionMaster',
    xp: 4890,
    level: 5,
    badges: ['prediction_expert', 'streak_master'],
    createdAt: new Date('2024-01-05'),
    lastActive: new Date()
  },
  {
    id: 'user3',
    rank: 3,
    email: 'future_seer@example.com',
    displayName: 'FutureSeer',
    xp: 4320,
    level: 5,
    badges: ['accurate_predictor', 'tech_savvy'],
    createdAt: new Date('2024-01-10'),
    lastActive: new Date()
  },
  {
    id: 'user4',
    rank: 4,
    email: 'test_user@example.com',
    displayName: 'TestUser',
    xp: 2450,
    level: 3,
    badges: ['first_prediction', 'early_adopter'],
    createdAt: new Date('2024-01-15'),
    lastActive: new Date()
  },
  {
    id: 'user5',
    rank: 5,
    email: 'sports_oracle@example.com',
    displayName: 'SportsOracle',
    xp: 2180,
    level: 3,
    badges: ['sports_expert', 'consistent_voter'],
    createdAt: new Date('2024-01-20'),
    lastActive: new Date()
  }
];

export default function LeaderboardPage() {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <CrownIcon />;
      case 2: return <MedalIcon />;
      case 3: return <span>🥉</span>;
      default: return <span className="text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-white text-gray-900';
    }
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon />
              <span>Ana Sayfaya Dön</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <TrophyIcon />
                <span>Liderlik Tablosu</span>
              </h1>
              <p className="text-gray-600 mt-2">
                En başarılı tahmin uzmanları
              </p>
            </div>
            
            <div></div> {/* Spacer for flex justify-between */}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            🏆 Hall of Fame 🏆
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockLeaderboard.slice(0, 3).map((user) => (
              <Link key={user.id} href={`/profile/${user.id}`}>
                <div className={`p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${getRankColor(user.rank)} border-2 ${
                  user.rank === 1 ? 'border-yellow-300' : user.rank === 2 ? 'border-gray-400' : 'border-orange-300'
                }`}>
                  <div className="text-center">
                    <div className="text-4xl mb-3">
                      {getRankIcon(user.rank)}
                    </div>
                    
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl font-bold ${
                      user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-gray-500' : 'bg-orange-500'
                    }`}>
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">
                      {user.displayName || 'Anonim'}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {user.xp} XP
                      </div>
                      <div className="text-sm opacity-90">
                        Level {calculateLevel(user.xp)}
                      </div>
                      <div className="text-sm opacity-75">
                        {user.badges.length} rozet
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Tüm Sıralama
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {mockLeaderboard.map((user) => (
              <Link key={user.id} href={`/profile/${user.id}`}>
                <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="w-8 text-center text-lg font-bold">
                        {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                      </div>
                      
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      
                      {/* User Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.displayName || 'Anonim Kullanıcı'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Level {calculateLevel(user.xp)}</span>
                          <span>{user.badges.length} rozet</span>
                          <span>Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* XP */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">
                        {user.xp}
                      </div>
                      <div className="text-sm text-gray-500">
                        XP
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {mockLeaderboard.length}
            </div>
            <div className="text-gray-600">Toplam Kullanıcı</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.max(...mockLeaderboard.map(u => u.xp))}
            </div>
            <div className="text-gray-600">En Yüksek XP</div>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(mockLeaderboard.reduce((sum, u) => sum + u.xp, 0) / mockLeaderboard.length)}
            </div>
            <div className="text-gray-600">Ortalama XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
