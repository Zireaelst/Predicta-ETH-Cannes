'use client'

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Progress } from "@/components/ui/Progress"
import { Separator } from "@/components/ui/Separator"
import {
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  History,
  Medal,
  Percent,
  Target,
  TrendingUp,
  Trophy,
  Vote,
} from "lucide-react"

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

// --- VERİ MODELLERİ (API'den geleceğini varsayalım) ---
// İstatistik verileri
const statisticsData = [
  {
    icon: <Target className="h-5 w-5 text-muted-foreground" />,
    label: "Toplam Tahmin",
    value: "15",
  },
  {
    icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    label: "Doğru Tahmin",
    value: "9",
  },
  {
    icon: <Percent className="h-5 w-5 text-muted-foreground" />,
    label: "Doğruluk Oranı",
    value: "60%",
  },
  {
    icon: <Vote className="h-5 w-5 text-muted-foreground" />,
    label: "Toplam Oy",
    value: "89",
  },
  {
    icon: <TrendingUp className="h-5 w-5 text-muted-foreground" />,
    label: "Mevcut Seri",
    value: "3",
  },
  {
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
    label: "En Uzun Seri",
    value: "7",
  },
]

// Son aktiviteler verileri
const activitiesData = [
  {
    question: "2024 yılında Bitcoin 100.000$ geçecek mi?",
    category: "Kripto",
    date: "20.01.2024",
    status: "Aktif",
    votes: "156 oy",
    result: null,
  },
  {
    question: "Apple 2024'te yapay zeka destekli iPhone lansmanı yapacak mı?",
    category: "Teknoloji",
    date: "18.01.2024",
    status: "Sonuçlandı",
    votes: "89 oy",
    result: { text: "Evet", color: "text-green-600" },
  },
  {
    question: "Türkiye 2024 Avrupa Şampiyonası'nda finale kalacak mı?",
    category: "Spor",
    date: "15.01.2024",
    status: "Sonuçlandı",
    votes: "234 oy",
    result: { text: "Hayır", color: "text-red-600" },
  },
]

// Rozet verileri
const badgesData = [
  {
    icon: <Medal className="h-6 w-6 text-yellow-600" />,
    title: "İlk Tahmin",
    description: "İlk tahminini oluşturdun!",
  },
  {
    icon: <Trophy className="h-6 w-6 text-gold-600" />,
    title: "Seri Yapıcı",
    description: "5 doğru tahmin serisi yaptın!",
  },
  {
    icon: <Target className="h-6 w-6 text-blue-600" />,
    title: "Keskin Nişancı",
    description: "10 doğru tahmin yaptın!",
  },
]

// --- ANA PROFİL SAYFASI BİLEŞENİ ---
export default function ProfilePage({ params }: ProfilePageProps) {
  const userXP = 2450
  const nextLevelXP = 4000
  const progressPercentage = (userXP / nextLevelXP) * 100

  console.log('Profile page for user:', params.userId);

  return (
    <div className="bg-muted/40 text-foreground min-h-screen w-full p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* === KULLANICI BİLGİLERİ HEADER === */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Test User" />
              <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">T</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Test User</h1>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-sm mt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Katılım: 15.01.2024</span>
                </div>
                <Badge variant="outline">Level 3</Badge>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:max-w-xs">
            <div className="flex justify-between items-baseline mb-1">
              <p className="text-lg font-bold text-primary">{userXP.toLocaleString()} XP</p>
              <p className="text-xs text-muted-foreground">{(nextLevelXP - userXP).toLocaleString()} XP to Level 4</p>
            </div>
            <Progress value={progressPercentage} className="w-full h-2.5" />
          </div>
        </header>

        {/* === ANA İÇERİK (GRID) === */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sağ Sütun: İstatistikler ve Rozetler (Şimdi ilk sırada) */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Award className="h-6 w-6" />
                  Rozetler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {badgesData.map((badge, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-muted p-3 rounded-lg">{badge.icon}</div>
                    <div>
                      <p className="font-semibold">{badge.title}</p>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BarChart2 className="h-6 w-6" />
                  İstatistikler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {statisticsData.map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      {stat.icon}
                      <span className="text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold text-base">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          {/* Sol Sütun: Son Aktiviteler (Şimdi ikinci sırada) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <History className="h-6 w-6" />
                  Son Aktiviteler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activitiesData.map((activity, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-base leading-tight">{activity.question}</p>
                          <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-1 mt-2">
                            <span>{activity.category}</span>
                            <span>&middot;</span>
                            <span>{activity.date}</span>
                            <Badge
                              variant={activity.status === "Aktif" ? "default" : "secondary"}
                              className={
                                activity.status === "Aktif" ? "bg-green-100 text-green-800 border-green-300" : ""
                              }
                            >
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 min-w-[70px]">
                          <p className="font-bold">{activity.votes}</p>
                          {activity.result && (
                            <p className={`text-sm font-medium ${activity.result.color}`}>
                              Sonuç: {activity.result.text}
                            </p>
                          )}
                        </div>
                      </div>
                      {index < activitiesData.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
