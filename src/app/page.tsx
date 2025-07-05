'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Sparkles, ArrowRight, History } from 'lucide-react';
import Header from '@/components/Header';
import CreatePredictionModal from '@/components/CreatePredictionModal';
import LoginModal from '@/components/LoginModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { Calendar, Check, User, X } from 'lucide-react';
import { User as UserType } from '@/types';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { createUser, getUserByEmail } from '@/services/firebase';

// --- VERİ MODELİ (API'den geleceğini varsayalım) ---
// Her bir tahmin kartı için gerekli verileri içeren bir dizi oluşturalım.
const predictionsData = [
  {
    id: 1,
    title: "2024 yılında Bitcoin 100.000$ geçecek mi?",
    description: "Bitcoin'in tarihsel performansı ve kurumsal adaptasyonu göz önüne alındığında...",
    status: { text: "Süresi Doldu", variant: "destructive" as const },
    endDate: "31 Ara 01:00",
    totalVotes: 156,
    creator: "@TestUser",
    yesPercentage: 57,
    noPercentage: 43,
    userVote: "Evet",
    result: null, // Sonuç belli değilse null
  },
  {
    id: 2,
    title: "Türkiye 2024 Avrupa Şampiyonası'nda finale kalacak mı?",
    description: "A Milli Takımımızın son performansları ve kadro kalitesi...",
    status: { text: "Sonuçlandı", variant: "secondary" as const },
    endDate: "14 Tem 02:00",
    totalVotes: 234,
    creator: "@CryptoExpert",
    yesPercentage: 42,
    noPercentage: 58,
    userVote: "Hayır",
    result: "Hayır",
  },
  {
    id: 3,
    title: "Apple 2024'te yapay zeka destekli iPhone lansmanı yapacak mı?",
    description: "AI teknolojilerinin hızla gelişmesi ve Apple'ın son açıklamaları ışığında...",
    status: { text: "Aktif", variant: "default" as const, className: "bg-green-100 text-green-800 border-green-300" },
    endDate: "12 Tem 20:42",
    totalVotes: 89,
    creator: "@TechGuru",
    yesPercentage: 75,
    noPercentage: 25,
    userVote: null, // Kullanıcı oy kullanmamış
    result: null,
  },
];

// Geçmiş tahminler verisi
const pastPredictionsData = [
  {
    id: 4,
    title: "2023 yılında Türkiye'de kripto para düzenlemesi çıkacak mı?",
    description: "Merkez Bankası ve hükümetin son açıklamaları ışığında...",
    status: { text: "Sonuçlandı", variant: "secondary" as const },
    endDate: "31 Ara 23:59",
    totalVotes: 298,
    creator: "@RegulationExpert",
    yesPercentage: 34,
    noPercentage: 66,
    userVote: "Hayır",
    result: "Hayır",
    correctPrediction: true,
  },
  {
    id: 5,
    title: "ChatGPT kullanıcı sayısı 2023'te 200 milyonu geçecek mi?",
    description: "AI teknolojilerinin hızla benimsenme oranı ve OpenAI'ın büyüme projeksiyonları...",
    status: { text: "Sonuçlandı", variant: "secondary" as const },
    endDate: "31 Ara 23:59",
    totalVotes: 445,
    creator: "@AIAnalyst",
    yesPercentage: 78,
    noPercentage: 22,
    userVote: "Evet",
    result: "Evet",
    correctPrediction: true,
  },
  {
    id: 6,
    title: "Tesla 2023'te Model 2'yi duyuracak mı?",
    description: "Elon Musk'ın önceki açıklamaları ve Tesla'nın ürün yol haritası...",
    status: { text: "Sonuçlandı", variant: "secondary" as const },
    endDate: "31 Ara 23:59",
    totalVotes: 167,
    creator: "@TeslaWatcher",
    yesPercentage: 45,
    noPercentage: 55,
    userVote: "Evet",
    result: "Hayır",
    correctPrediction: false,
  },
];

type PredictionData = typeof predictionsData[0] | typeof pastPredictionsData[0];

// --- TEK BİR TAHMİN KARTI BİLEŞENİ ---
const PredictionCard: React.FC<{ prediction: PredictionData; isPast?: boolean }> = ({ prediction, isPast = false }) => {
  const { 
    title, description, status, endDate, totalVotes, creator, 
    yesPercentage, noPercentage, userVote, result
  } = prediction;
  
  const correctPrediction = 'correctPrediction' in prediction ? prediction.correctPrediction : undefined;

  return (
    <Card className="flex flex-col h-full hover:border-primary transition-colors duration-300">
      <CardHeader className="relative">
        <Badge variant={status.variant} className={`absolute top-4 right-4 ${'className' in status ? status.className : ''}`}>
          {status.text}
        </Badge>
        <CardTitle className="pr-16">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {/* Meta Bilgiler */}
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Bitiş: {endDate}</div>
          <div className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {totalVotes} oy</div>
          <div className="flex items-center gap-1.5"><User className="h-4 w-4" /> {creator}</div>
        </div>
        
        {/* Oy Oranları ve Progress Bar */}
        <div>
            <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-green-600">Evet {yesPercentage}%</span>
                <span className="text-red-600">Hayır {noPercentage}%</span>
            </div>
            <Progress value={yesPercentage} className="h-2 [&>div]:bg-green-500" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        {/* Sonuç veya Kullanıcı Oyu Gösterimi */}
        {result && (
             <Button 
               variant={result === "Evet" ? "default" : "destructive"} 
               disabled 
               className="w-full cursor-default"
             >
                {result === "Evet" ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                Sonuç: {result}
            </Button>
        )}
        {userVote && !result && (
            <Button variant="outline" disabled className="w-full cursor-default">
                <Check className="mr-2 h-4 w-4" /> Oyunuz: {userVote}
            </Button>
        )}

        {/* Geçmiş tahminlerde doğru tahmin göstergesi */}
        {isPast && userVote && typeof correctPrediction === 'boolean' && (
          <Badge 
            variant={correctPrediction ? "default" : "destructive"}
            className="w-full justify-center"
          >
            {correctPrediction ? "✓ Doğru Tahmin!" : "✗ Yanlış Tahmin"}
          </Badge>
        )}

        {/* Oy Kullanma Butonları (Eğer aktifse) */}
        {!userVote && !result && (
             <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="hover:bg-green-50 hover:border-green-500 hover:text-green-600">
                    <Check className="mr-2 h-4 w-4" /> Evet
                </Button>
                <Button variant="outline" className="hover:bg-red-50 hover:border-red-500 hover:text-red-600">
                    <X className="mr-2 h-4 w-4" /> Hayır
                </Button>
            </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default function Home() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with mock data - remove this when Firebase is fully integrated
  useEffect(() => {
    // Don't auto-login with mock data anymore
    // setUser(mockUser);
  }, []);

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    try {
      console.log(`🔐 Giriş işlemi başlatılıyor: ${email}`);
      
      // 1. Email ile mevcut kullanıcı kontrolü yap
      const existingUser = await getUserByEmail(email);
      
      if (existingUser) {
        // Mevcut kullanıcı ile giriş yap
        // Convert Firebase user to app user format
        const appUser: UserType = {
          id: existingUser.id,
          email: existingUser.email || '',
          displayName: existingUser.email?.split('@')[0] || 'User',
          xp: existingUser.xp,
          level: Math.floor(existingUser.xp / 500) + 1, // Calculate level from XP
          badges: existingUser.badges,
          createdAt: existingUser.createdAt,
          lastActive: new Date()
        };
        
        setUser(appUser);
        
        console.log(`🔓 Mevcut hesap ile giriş yapıldı: ${existingUser.id}`);
        
        alert(`🔓 Hoş geldin!\n👤 Mevcut hesabınla giriş yapıldı\n💎 Mevcut XP: ${existingUser.xp}\n✅ Doğru Tahmin: ${existingUser.correctPredictions}\n📊 Toplam Tahmin: ${existingUser.totalPredictions}`);
      } else {
        // Yeni kullanıcı oluştur
        const userId = await createUser({
          email: email,
          xp: 0,
          correctPredictions: 0,
          totalPredictions: 0,
          badges: []
        });
        
        const appUser: UserType = {
          id: userId,
          email: email,
          displayName: email.split('@')[0],
          xp: 0,
          level: 1,
          badges: [],
          createdAt: new Date(),
          lastActive: new Date()
        };
        
        setUser(appUser);
        
        console.log(`✨ Yeni hesap oluşturuldu: ${userId}`);
        
        alert(`✨ Hoş geldin!\n👤 Yeni hesabın oluşturuldu\n🎯 Başlangıç XP: 0\n\n💡 Tahmin oluşturun veya mevcut tahminlere oy verin!`);
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş hatası: ' + error);
    } finally {
      setIsLoading(false);
    }
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
      console.log('Creating prediction:', predictionData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header - Fixed at the top */}
      <Header
        user={user || undefined}
        onCreatePrediction={() => setIsCreateModalOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />
      
      {/* Hero Section with Aurora Background */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Predicta
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-slate-800 font-semibold">
                Geleceği Tahmin Et, Kazanmaya Başla
              </span>
            </h1>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8 font-medium">
              Sosyal tahmin platformunda geleceği öngör, doğru tahminlerle XP kazan ve liderlik tablosunda yüksel!
            </p>
            
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md border-slate-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                    3
                  </div>
                  <p className="text-slate-600 font-semibold text-sm">Aktif Tahmin</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md border-slate-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    479
                  </div>
                  <p className="text-slate-600 font-semibold text-sm">Toplam Oy</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/95 backdrop-blur-md border-slate-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
                    1250
                  </div>
                  <p className="text-slate-600 font-semibold text-sm">Senin XP&apos;in</p>
                </CardContent>
              </Card>
            </div>

            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-4 shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Yeni Tahmin Oluştur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Main Content - Outside Aurora Background */}
      <main className="bg-background">
        {/* Popüler Tahminler Bölümü */}
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Başlık Bölümü */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Popüler Tahminler</h2>
                <p className="text-muted-foreground mt-1">En çok oy alan ve tartışılan tahminler</p>
              </div>
              <Button variant="ghost" className="text-muted-foreground">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </Button>
            </div>

            {/* Tahmin Kartları Grid'i */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {predictionsData.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <PredictionCard prediction={prediction} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Geçmiş Tahminler Bölümü */}
        <section className="bg-muted/30 w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Başlık Bölümü */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Geçmiş Tahminler</h2>
                <p className="text-muted-foreground mt-1">Sonuçlanmış tahminler ve performansın</p>
              </div>
              <Button variant="ghost" className="text-muted-foreground">
                <History className="mr-2 h-4 w-4" />
                Tümünü Gör
              </Button>
            </div>

            {/* Geçmiş Tahmin Kartları Grid'i */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {pastPredictionsData.map((prediction, index) => (
                <motion.div
                  key={prediction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <PredictionCard prediction={prediction} isPast={true} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        isLoading={isLoading}
      />

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
