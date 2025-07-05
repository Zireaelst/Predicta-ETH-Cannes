'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  Trophy,
  Crown,
  Medal,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 'user1',
    rank: 1,
    displayName: 'CryptoKing',
    xp: 5420,
    level: 6,
    accuracy: 85,
    predictions: 47,
    avatar: 'https://i.pravatar.cc/150?u=crypto_king',
  },
  {
    id: 'user2', 
    rank: 2,
    displayName: 'PredictionMaster',
    xp: 4890,
    level: 5,
    accuracy: 82,
    predictions: 39,
    avatar: 'https://i.pravatar.cc/150?u=prediction_master',
  },
  {
    id: 'user3',
    rank: 3,
    displayName: 'TechOracle',
    xp: 4320,
    level: 5,
    accuracy: 78,
    predictions: 52,
    avatar: 'https://i.pravatar.cc/150?u=tech_oracle',
  },
  {
    id: 'user4',
    rank: 4,
    displayName: 'MarketWise',
    xp: 3950,
    level: 4,
    accuracy: 76,
    predictions: 31,
    avatar: 'https://i.pravatar.cc/150?u=market_wise',
  },
  {
    id: 'user5',
    rank: 5,
    displayName: 'FutureSeeker',
    xp: 3680,
    level: 4,
    accuracy: 74,
    predictions: 28,
    avatar: 'https://i.pravatar.cc/150?u=future_seeker',
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-6 w-6 text-yellow-500" />
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />
    default:
      return <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
  }
}

const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50"
    case 2:
      return "border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
    case 3:
      return "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50"
    default:
      return "border-border"
  }
}

export default function LeaderboardPage() {
  return (
    <div className="bg-muted/40 text-foreground min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
              Liderlik Tablosu
            </h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-lg text-muted-foreground">
            En başarılı tahmin uzmanları
          </p>
        </motion.header>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">2,456</div>
              <div className="text-sm text-muted-foreground">Toplam Tahmin</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">73%</div>
              <div className="text-sm text-muted-foreground">Ortalama Doğruluk</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {mockLeaderboard.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`${getRankStyle(user.rank)} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      {/* Avatar and User Info */}
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={user.avatar} alt={user.displayName} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                            {user.displayName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-semibold">{user.displayName}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Level {user.level}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {user.predictions} tahmin
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {user.xp.toLocaleString()} XP
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.accuracy}% doğruluk
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Daha Fazla Göster
          </button>
        </motion.div>
      </div>
    </div>
  )
}
