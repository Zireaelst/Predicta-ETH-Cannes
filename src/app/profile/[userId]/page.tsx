import React from 'react';
import Link from 'next/link';
import UserProfile from '@/components/UserProfile';
import { User, UserStats } from '@/types';

// Mock icons
const ArrowLeftIcon = () => <span>←</span>;

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

// Mock data - in real app, this would come from Firebase
const mockUser: User = {
  id: 'user1',
  email: 'testuser@example.com',
  displayName: 'Test User',
  xp: 2450,
  level: 3,
  badges: ['first_prediction', 'early_adopter', 'prediction_master'],
  createdAt: new Date('2024-01-15'),
  lastActive: new Date()
};

const mockStats: UserStats = {
  totalPredictions: 15,
  correctPredictions: 9,
  accuracy: 60,
  totalVotes: 89,
  currentStreak: 3,
  longestStreak: 7
};

const mockRecentPredictions = [
  {
    id: '1',
    creatorId: 'user1',
    creatorName: 'TestUser',
    question: '2024 yılında Bitcoin 100.000$ geçecek mi?',
    description: 'Bitcoin ile ilgili tahmin',
    category: 'Kripto',
    endDate: new Date('2024-12-31'),
    createdAt: new Date('2024-01-20'),
    isResolved: false,
    totalVotes: 156,
    yesVotes: 89,
    noVotes: 67,
    outcome: undefined
  },
  {
    id: '2',
    creatorId: 'user1',
    creatorName: 'TestUser',
    question: 'Apple 2024\'te yapay zeka destekli iPhone lansmanı yapacak mı?',
    description: 'Apple AI teknolojisi hakkında tahmin',
    category: 'Teknoloji',
    endDate: new Date('2024-09-15'),
    createdAt: new Date('2024-01-18'),
    isResolved: true,
    totalVotes: 89,
    yesVotes: 67,
    noVotes: 22,
    outcome: true
  },
  {
    id: '3',
    creatorId: 'user1',
    creatorName: 'TestUser',
    question: 'Türkiye 2024 Avrupa Şampiyonası\'nda finale kalacak mı?',
    description: 'Spor tahmini',
    category: 'Spor',
    endDate: new Date('2024-07-14'),
    createdAt: new Date('2024-01-15'),
    isResolved: true,
    totalVotes: 234,
    yesVotes: 98,
    noVotes: 136,
    outcome: false,
    resolvedAt: new Date('2024-07-15')
  }
];

export default function ProfilePage({ params }: ProfilePageProps) {
  // In a real app, you would fetch user data based on params.userId
  // For now, we'll use mock data
  console.log('Profile page for user:', params.userId);
  const user = mockUser;
  const stats = mockStats;
  const recentPredictions = mockRecentPredictions;
  
  // Check if current user is viewing their own profile
  const isOwner = true; // In real app: currentUser?.id === userId

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Kullanıcı Bulunamadı
          </h1>
          <p className="text-gray-600 mb-6">
            Aradığınız kullanıcı mevcut değil veya profili gizli.
          </p>
          <Link 
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <ArrowLeftIcon />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon />
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <UserProfile
        user={user}
        stats={stats}
        recentPredictions={recentPredictions}
        isOwner={isOwner}
      />
    </div>
  );
}
