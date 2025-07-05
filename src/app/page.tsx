'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Sparkles, ArrowRight, Trophy, Activity } from 'lucide-react';
import Header from '@/components/Header';
import PredictionCard from '@/components/PredictionCard';
import CreatePredictionModal from '@/components/CreatePredictionModal';
import { Card, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Prediction, User } from '@/types';

// Mock data for development
const mockUser: User = {
  id: 'user1',
  email: 'user@example.com',
  displayName: 'Test User',
  xp: 1250,
  level: 3,
  badges: ['first_prediction', 'early_adopter'],
  createdAt: new Date(),
  lastActive: new Date()
};

const mockPredictions: Prediction[] = [
  {
    id: '1',
    creatorId: 'user1',
    creatorName: 'TestUser',
    question: '2024 yılında Bitcoin 100.000$ geçecek mi?',
    description: 'Bitcoin\'in tarihsel performansı ve kurumsal adaptasyonu göz önünde bulundurulduğunda, 2024 sonuna kadar 100.000$ seviyesini aşıp aşmayacağını tahmin ediyoruz.',
    category: 'Kripto',
    endDate: new Date('2024-12-31'),
    isResolved: false,
    totalVotes: 156,
    yesVotes: 89,
    noVotes: 67,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    creatorId: 'user2',
    creatorName: 'CryptoExpert',
    question: 'Türkiye 2024 Avrupa Şampiyonası\'nda finale kalacak mı?',
    description: 'A Milli Takımımızın son performansları ve kadro kalitesi değerlendirildiğinde finale kalma şansı nedir?',
    category: 'Spor',
    endDate: new Date('2024-07-14'),
    isResolved: true,
    outcome: false,
    totalVotes: 234,
    yesVotes: 98,
    noVotes: 136,
    createdAt: new Date('2024-01-20'),
    resolvedAt: new Date('2024-07-15')
  },
  {
    id: '3',
    creatorId: 'user3',
    creatorName: 'TechGuru',
    question: 'Apple 2024\'te yapay zeka destekli iPhone lansmanı yapacak mı?',
    description: 'AI teknolojilerinin hızla gelişmesi ve Apple\'ın son açıklamaları ışığında değerlendirme.',
    category: 'Teknoloji',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    isResolved: false,
    totalVotes: 89,
    yesVotes: 67,
    noVotes: 22,
    createdAt: new Date('2024-01-25')
  }
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  // Initialize with mock data
  useEffect(() => {
    setUser(mockUser);
    setPredictions(mockPredictions);
    // Mock user votes
    setUserVotes({
      '1': true, // User voted yes on prediction 1
      '2': false // User voted no on prediction 2
    });
  }, []);

  const handleLogin = () => {
    console.log('Login clicked');
    setUser(mockUser);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    setUser(null);
  };

  const handleCreatePrediction = async (predictionData: {
    question: string;
    description: string;
    category: string;
    endDate: Date;
  }) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const newPrediction: Prediction = {
        id: Date.now().toString(),
        creatorId: user.id,
        creatorName: user.displayName || 'Anonymous',
        ...predictionData,
        isResolved: false,
        totalVotes: 0,
        yesVotes: 0,
        noVotes: 0,
        createdAt: new Date()
      };
      
      setPredictions(prev => [newPrediction, ...prev]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (predictionId: string, vote: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log(`Voting ${vote ? 'yes' : 'no'} on prediction ${predictionId}`);
      
      setUserVotes(prev => ({ ...prev, [predictionId]: vote }));
      
      setPredictions(prev => prev.map(p => {
        if (p.id === predictionId) {
          return {
            ...p,
            totalVotes: p.totalVotes + 1,
            yesVotes: vote ? p.yesVotes + 1 : p.yesVotes,
            noVotes: vote ? p.noVotes : p.noVotes + 1
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (predictionId: string, outcome: boolean) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log(`Resolving prediction ${predictionId} with outcome: ${outcome}`);
      
      setPredictions(prev => prev.map(p => {
        if (p.id === predictionId) {
          return {
            ...p,
            isResolved: true,
            outcome,
            resolvedAt: new Date()
          };
        }
        return p;
      }));
    } catch (error) {
      console.error('Error resolving prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header
        user={user || undefined}
        onCreatePrediction={() => setIsCreateModalOpen(true)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Predicta
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-muted-foreground">
                Geleceği Tahmin Et
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Sosyal tahmin platformunda geleceğe dair tahminlerde bulun, 
              topluluğun görüşlerini keşfet ve doğru tahminlerle XP kazan.
            </p>
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Tahmin Oluştur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Tahmin</p>
                  <p className="text-2xl font-bold">{predictions.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Oy</p>
                  <p className="text-2xl font-bold">{predictions.reduce((sum, p) => sum + p.totalVotes, 0)}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kullanıcılar</p>
                  <p className="text-2xl font-bold">1.2K</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Senin XP&apos;in</p>
                  <p className="text-2xl font-bold">{user?.xp || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Popüler Tahminler
            </h2>
            <p className="text-muted-foreground">
              En çok oy alan ve tartışılan tahminler
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Trophy className="w-3 h-3" />
              <span>Trending</span>
            </Badge>
          </div>
        </motion.div>

        {/* Predictions Grid */}
        {predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground text-lg mb-4">
              Henüz tahmin yok
            </div>
            {user && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="lg"
                className="bg-gradient-to-r from-primary to-blue-600"
              >
                İlk Tahmini Sen Oluştur
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {predictions.map((prediction, index) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PredictionCard
                  prediction={prediction}
                  userVote={userVotes[prediction.id]}
                  onVote={handleVote}
                  onResolve={handleResolve}
                  canResolve={user?.id === prediction.creatorId}
                  isLoading={isLoading}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Geleceği Tahmin Et, Kazanmaya Başla
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sosyal tahmin platformunda geleceği öngör, doğru tahminlerle XP kazan ve liderlik tablosunda yüksel!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {predictions.length}
            </div>
            <div className="text-gray-600">Aktif Tahmin</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {predictions.reduce((sum, p) => sum + p.totalVotes, 0)}
            </div>
            <div className="text-gray-600">Toplam Oy</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {user?.xp || 0}
            </div>
            <div className="text-gray-600">Senin XP&apos;in</div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Aktif Tahminler
            </h2>
            {user && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Yeni Tahmin Oluştur
              </button>
            )}
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                Henüz tahmin yok
              </div>
              {user && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  İlk Tahmini Sen Oluştur!
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {predictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  prediction={prediction}
                  userVote={userVotes[prediction.id]}
                  onVote={user ? handleVote : undefined}
                  onResolve={user?.id === prediction.creatorId ? handleResolve : undefined}
                  canResolve={user?.id === prediction.creatorId}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Prediction Modal */}
      <CreatePredictionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePrediction}
        isLoading={isLoading}
      />
    </div>
  );
}
