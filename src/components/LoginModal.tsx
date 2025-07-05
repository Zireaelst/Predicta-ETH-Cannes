'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, LogIn, UserPlus } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => Promise<void>;
  isLoading: boolean;
}

export default function LoginModal({ isOpen, onClose, onLogin, isLoading }: LoginModalProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Lütfen e-posta adresinizi girin!');
      return;
    }
    
    // Basit email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Lütfen geçerli bir e-posta adresi girin!');
      return;
    }
    
    try {
      await onLogin(email);
      setEmail('');
      onClose();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md"
            >
              <Card className="border-0 shadow-2xl">
                <CardHeader className="relative pb-6">
                  <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <LogIn className="w-5 h-5 text-white" />
                    </div>
                    Predicta&apos;ya Giriş
                  </CardTitle>
                  
                  {!isLoading && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClose}
                      className="absolute top-4 right-4 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-muted-foreground">
                      E-posta adresinizi girin
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mevcut hesap varsa giriş yapılır, yoksa yeni hesap oluşturulur
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        E-posta Adresi
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="email"
                          placeholder="ornek@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          autoFocus
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white py-3 text-base font-medium"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Kontrol ediliyor...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Giriş Yap / Hesap Oluştur
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>🎯 Her doğru tahmin için XP kazan!</p>
                    <p>🏆 Liderlik tablosunda yüksel!</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
