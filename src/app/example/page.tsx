import React from 'react';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { 
  TrendingUp, 
  Calendar, 
  Users, 
  CheckCircle2, 
  X
} from 'lucide-react';

// Popüler tahminler verisi
const popularPredictions = [
  {
    id: 1,
    title: "2024 yılında Bitcoin 100.000$ geçecek mi?",
    description: "Bitcoin&apos;in tarihsel performansı ve kurumsal adaptasyonu göz...",
    endDate: "31 Ara 01:00",
    votes: 156,
    author: "@TestUser",
    yesPercentage: 57,
    noPercentage: 43,
    userVote: "yes",
    status: "Süresi Doldu",
    statusColor: "bg-orange-500"
  },
  {
    id: 2,
    title: "Türkiye 2024 Avrupa Şampiyonası'nda finale kalacak mı?",
    description: "A Milli Takımımızın son performansları ve kadro kalitesi...",
    endDate: "14 Tem 02:00",
    votes: 234,
    author: "@CryptoExpert",
    yesPercentage: 42,
    noPercentage: 58,
    userVote: "no",
    status: "Sonuçlandı",
    statusColor: "bg-slate-500",
    result: "Hayır"
  },
  {
    id: 3,
    title: "Apple 2024'te yapay zeka destekli iPhone lansmanı yapacak mı?",
    description: "AI teknolojilerinin hızla gelişmesi ve Apple&apos;ın son açıklamaları ışığında...",
    endDate: "12 Tem 20:36",
    votes: 89,
    author: "@TechGuru",
    yesPercentage: 75,
    noPercentage: 25,
    userVote: null,
    status: "Aktif",
    statusColor: "bg-green-500"
  }
];

// Dashboard istatistikleri
const dashboardStats = [
  {
    label: "Aktif Tahmin",
    value: "3",
    color: "text-blue-600"
  },
  {
    label: "Toplam Oy",
    value: "479",
    color: "text-green-600"
  },
  {
    label: "Senin XP'in",
    value: "1250",
    color: "text-purple-600"
  }
];

export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Popüler Tahminler Bölümü */}
      <section className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Popüler Tahminler</h1>
              <p className="text-muted-foreground">En çok oy alan ve tartışılan tahminler</p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularPredictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base leading-tight line-clamp-2">
                      {prediction.title}
                    </h3>
                    <Badge 
                      className={`${prediction.statusColor} text-white border-0 ml-2 flex-shrink-0`}
                    >
                      {prediction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {prediction.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Meta bilgiler */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Bitiş: {prediction.endDate}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{prediction.votes} oy</span>
                      </div>
                      <span>{prediction.author}</span>
                    </div>
                  </div>

                  {/* Oy yüzdeleri */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">Evet {prediction.yesPercentage}%</span>
                      <span className="text-red-600 font-medium">Hayır {prediction.noPercentage}%</span>
                    </div>
                    <div className="flex h-2 rounded-full overflow-hidden bg-slate-200">
                      <div 
                        className="bg-green-500 transition-all duration-300"
                        style={{ width: `${prediction.yesPercentage}%` }}
                      />
                      <div 
                        className="bg-red-500 transition-all duration-300"
                        style={{ width: `${prediction.noPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Kullanıcı oyu göstergesi */}
                  {prediction.userVote && (
                    <div className={`p-3 rounded-lg ${prediction.userVote === 'yes' ? 'bg-green-100 dark:bg-green-950' : 'bg-red-100 dark:bg-red-950'}`}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Oyunuz: {prediction.userVote === 'yes' ? 'Evet' : 'Hayır'}</span>
                      </div>
                    </div>
                  )}

                  {/* Sonuç göstergesi */}
                  {prediction.result && (
                    <div className={`p-3 rounded-lg ${prediction.result === 'Hayır' ? 'bg-red-100 dark:bg-red-950' : 'bg-green-100 dark:bg-green-950'}`}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <X className="h-4 w-4" />
                        <span>Sonuç: {prediction.result}</span>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4">
                  {prediction.status === "Aktif" ? (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Evet
                      </Button>
                      <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                        <X className="h-4 w-4 mr-1" />
                        Hayır
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button variant="outline" disabled className="text-green-600 border-green-300">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Evet Oldu
                      </Button>
                      <Button variant="outline" disabled className="text-red-600 border-red-300">
                        <X className="h-4 w-4 mr-1" />
                        Hayır Oldu
                      </Button>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Dashboard Bölümü */}
      <section className="w-full py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Geleceği Tahmin Et, Kazanmaya Başla</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Sosyal tahmin platformunda geleceği öngör, doğru tahminlerle XP kazan ve liderlik tablosunda yüksel!
            </p>
            
            {/* İstatistik Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {dashboardStats.map((stat, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Aktif Tahminler Bölümü */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Aktif Tahminler</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Yeni Tahmin Oluştur
            </Button>
          </div>

          {/* Öne çıkan tahmin kartı */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <Badge className="bg-orange-500 text-white border-0 mb-4">
                  Süresi Doldu
                </Badge>
                <h3 className="text-2xl font-bold mb-4">
                  2024 yılında Bitcoin 100.000$ geçecek mi?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Bitcoin&apos;in tarihsel performansı ve kurumsal adaptasyonu göz önünde bulundurulduğunda, 2024 
                  sonuna kadar 100.000$ seviyesini aşıp aşmayacağını tahmin ediyoruz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Bitiş: 31 Ara 01:00</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="h-5 w-5" />
                  <span>156 oy</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span>@TestUser</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-green-600 font-semibold">Evet 57%</span>
                  <span className="text-red-600 font-semibold">Hayır 43%</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-slate-200">
                  <div className="bg-green-500 w-[57%] transition-all duration-500" />
                  <div className="bg-red-500 w-[43%] transition-all duration-500" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-100 dark:bg-green-950 rounded-lg">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span>Oyunuz: Evet</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
