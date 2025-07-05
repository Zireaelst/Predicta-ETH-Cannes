export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatar?: string;
  xp: number;
  level: number;
  badges: string[];
  createdAt: Date;
  lastActive: Date;
}

export interface Prediction {
  id: string;
  creatorId: string;
  creatorName: string;
  question: string;
  description?: string;
  category: string;
  endDate: Date;
  isResolved: boolean;
  outcome?: boolean;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface Vote {
  id: string;
  userId: string;
  predictionId: string;
  vote: boolean; // true for yes, false for no
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserStats {
  totalPredictions: number;
  correctPredictions: number;
  accuracy: number;
  totalVotes: number;
  currentStreak: number;
  longestStreak: number;
}
