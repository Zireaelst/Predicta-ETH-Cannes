"use client"

import { AuroraBackground } from "./ui/aurora-background"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { TrendingUp, Sparkles, ArrowRight, History } from 'lucide-react'
import Header from '@/components/Header'
import CreatePredictionModal from '@/components/CreatePredictionModal'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { Calendar, Check, User, X, Users } from 'lucide-react'
import { User as UserType } from '@/types'

// Mock data for development
const mockUser: UserType = {
  id: 'user1',
  email: 'user@example.com',
  displayName: 'Test User',
  xp: 1250,
  level: 3,
  badges: ['first_prediction', 'early_adopter'],
  createdAt: new Date(),
  lastActive: new Date()
}

// --- VERİ MODELİ (API'den geleceğini varsayalım) ---
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
    result: null,
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
    userVote: null,
    result: null,
  },
]

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
]

type PredictionData = typeof predictionsData[0] | typeof pastPredictionsData[0]

// --- TEK BİR TAHMİN KARTI BİLEŞENİ ---
const PredictionCard: React.FC<{ prediction: PredictionData; isPast?: boolean }> = ({ prediction, isPast = false }) => {
  const { 
    title, description, status, endDate, totalVotes, creator, 
    yesPercentage, noPercentage, userVote, result
  } = prediction
  
  const correctPrediction = 'correctPrediction' in prediction ? prediction.correctPrediction : undefined

  return (
    <Card className="flex flex-col h-full hover:border-primary transition-colors duration-300 bg-white/80 backdrop-blur-sm border-white/20">
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
  )
}

export default function AuroraBackgroundDemo() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with mock data
  useEffect(() => {
    setUser(mockUser)
  }, [])

  const handleLogin = () => {
    console.log('Login clicked')
    setUser(mockUser)
  }

  const handleLogout = () => {
    console.log('Logout clicked')
    setUser(null)
  }

  const handleCreatePrediction = async (predictionData: {
    question: string
    description: string
    category: string
    endDate: Date
  }) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      console.log('Creating prediction:', predictionData)
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error('Error creating prediction:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuroraBackground>
      <div className="relative z-10 w-full">
        <Header
          user={user || undefined}
          onCreatePrediction={() => setIsCreateModalOpen(true)}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Predicta
              </span>
              <br />
              <span className="text-2xl md:text-4xl text-white/80">
                Geleceği Tahmin Et, Kazanmaya Başla
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Sosyal tahmin platformunda geleceği öngör, doğru tahminlerle XP kazan ve liderlik tablosunda yüksel!
            </p>
            
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-blue-400">
                    3
                  </div>
                  <p className="text-white/80">Aktif Tahmin</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-green-400">
                    479
                  </div>
                  <p className="text-white/80">Toplam Oy</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2 text-purple-400">
                    1250
                  </div>
                  <p className="text-white/80">Senin XP&apos;in</p>
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
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 border-0"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Yeni Tahmin Oluştur
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Popüler Tahminler Bölümü */}
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Başlık Bölümü */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Popüler Tahminler</h2>
                <p className="text-white/70 mt-1">En çok oy alan ve tartışılan tahminler</p>
              </div>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
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
        <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Başlık Bölümü */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Geçmiş Tahminler</h2>
                <p className="text-white/70 mt-1">Sonuçlanmış tahminler ve performansın</p>
              </div>
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
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

        {/* Create Prediction Modal */}
        <CreatePredictionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreatePrediction}
          isLoading={isLoading}
        />
      </div>
    </AuroraBackground>
  )
}
