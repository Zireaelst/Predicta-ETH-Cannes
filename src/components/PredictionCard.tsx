'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, TrendingUp, User, Calendar } from 'lucide-react';
import { Prediction } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PredictionCardProps {
  prediction: Prediction;
  userVote?: boolean | null;
  onVote?: (predictionId: string, vote: boolean) => void;
  onResolve?: (predictionId: string, outcome: boolean) => void;
  canResolve?: boolean;
  isLoading?: boolean;
}

export default function PredictionCard({ 
  prediction, 
  userVote, 
  onVote, 
  onResolve, 
  canResolve = false,
  isLoading = false 
}: PredictionCardProps) {
  const isExpired = new Date() > new Date(prediction.endDate);
  const canVote = !prediction.isResolved && !isExpired && userVote === undefined;
  
  const yesPercentage = prediction.totalVotes > 0 
    ? Math.round((prediction.yesVotes / prediction.totalVotes) * 100) 
    : 50;
  const noPercentage = 100 - yesPercentage;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    if (prediction.isResolved) return 'secondary';
    if (isExpired) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (prediction.isResolved) return 'Sonuçlandı';
    if (isExpired) return 'Süresi Doldu';
    return 'Aktif';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        {/* Gradient overlay for active predictions */}
        {!prediction.isResolved && !isExpired && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
                {prediction.question}
              </h3>
              {prediction.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {prediction.description}
                </p>
              )}
            </div>
            
            <Badge variant={getStatusColor()} className="ml-3 shrink-0">
              {getStatusText()}
            </Badge>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Bitiş: {formatDate(prediction.endDate)}</span>
              </span>
              <span className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{prediction.totalVotes} oy</span>
              </span>
            </div>
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>@{prediction.creatorName}</span>
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Voting Results with Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-green-600 flex items-center space-x-1">
                <span>Evet</span>
                <span className="font-bold">{yesPercentage}%</span>
              </span>
              <span className="text-red-600 flex items-center space-x-1">
                <span>Hayır</span>
                <span className="font-bold">{noPercentage}%</span>
              </span>
            </div>
            
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${yesPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500 to-red-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${noPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* User Vote Indicator */}
          {userVote !== undefined && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "p-3 rounded-lg border-2 flex items-center space-x-2",
                userVote 
                  ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800'
              )}
            >
              {userVote ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span className="text-sm font-medium">
                Oyunuz: {userVote ? 'Evet' : 'Hayır'}
              </span>
            </motion.div>
          )}

          {/* Resolution Result */}
          {prediction.isResolved && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "p-3 rounded-lg border-2 flex items-center space-x-2",
                prediction.outcome 
                  ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800'
                  : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800'
              )}
            >
              {prediction.outcome ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span className="text-sm font-medium">
                Sonuç: {prediction.outcome ? 'Evet' : 'Hayır'}
              </span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            {canVote && onVote && (
              <>
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onVote(prediction.id, true)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Evet
                  </Button>
                </motion.div>
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onVote(prediction.id, false)}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hayır
                  </Button>
                </motion.div>
              </>
            )}

            {canResolve && !prediction.isResolved && isExpired && onResolve && (
              <div className="flex space-x-2 w-full">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onResolve(prediction.id, true)}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-green-500 text-green-600 hover:bg-green-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Evet Oldu
                  </Button>
                </motion.div>
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => onResolve(prediction.id, false)}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full border-red-500 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Hayır Oldu
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
