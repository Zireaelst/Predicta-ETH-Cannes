// Kullanıcı tipi
export interface User {
  id: string;
  privyId?: string;
  walletAddress?: string;
  email?: string;
  createdAt: Date;
  xp: number;
  correctPredictions: number;
  totalPredictions: number;
  badges: string[];
}

// Tahmin tipi
export interface Prediction {
  id: string;
  creatorId: string;
  question: string;
  description?: string;
  endDate: Date;
  status: 'active' | 'resolved' | 'cancelled';
  result: 'yes' | 'no' | null;
  correctAnswer: 'yes' | 'no'; // Tahmin yaratılırken belirlenen doğru cevap
  createdAt: Date;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
}

// Oy tipi
export interface Vote {
  id: string;
  userId: string;
  predictionId: string;
  choice: 'yes' | 'no';
  createdAt: Date;
}

// Leaderboard entry tipi
export interface LeaderboardEntry {
  userId: string;
  xp: number;
  correctPredictions: number;
  totalPredictions: number;
  successRate: number;
}
