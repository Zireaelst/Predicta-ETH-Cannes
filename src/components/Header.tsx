'use client'

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Plus, Home, LogOut, Target } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface HeaderProps {
  user?: {
    id: string;
    displayName?: string;
    xp: number;
    level: number;
  };
  onCreatePrediction?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function Header({ user, onCreatePrediction, onLogin, onLogout }: HeaderProps) {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Predicta
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Liderlik</span>
              </Button>
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Create Prediction Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onCreatePrediction}
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tahmin Oluştur</span>
                  </Button>
                </motion.div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-foreground">
                      {user.displayName || 'User'}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span>XP: {user.xp}</span>
                      <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                        L{user.level}
                      </Badge>
                    </div>
                  </div>
                  
                  <Link href={`/profile/${user.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white">
                          {(user.displayName || 'U').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2">Çıkış</span>
                  </Button>
                </div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={onLogin}
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                >
                  Giriş Yap
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
