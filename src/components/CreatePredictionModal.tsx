'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';

interface CreatePredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (predictionData: {
    question: string;
    description: string;
    category: string;
    endDate: Date;
  }) => void;
  isLoading?: boolean;
}

const categories = [
  { name: 'Teknoloji', color: 'bg-blue-500' },
  { name: 'Kripto', color: 'bg-orange-500' },
  { name: 'Spor', color: 'bg-green-500' },
  { name: 'Politika', color: 'bg-purple-500' },
  { name: 'Ekonomi', color: 'bg-red-500' },
  { name: 'Eğlence', color: 'bg-pink-500' },
  { name: 'Bilim', color: 'bg-teal-500' },
  { name: 'Diğer', color: 'bg-gray-500' }
];

export default function CreatePredictionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: CreatePredictionModalProps) {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Teknoloji');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !endDate || !endTime) return;

    const combinedDateTime = new Date(`${endDate}T${endTime}`);
    
    if (combinedDateTime <= new Date()) {
      alert('Bitiş tarihi gelecekte olmalıdır!');
      return;
    }

    onSubmit({
      question: question.trim(),
      description: description.trim(),
      category,
      endDate: combinedDateTime
    });

    // Reset form
    setQuestion('');
    setDescription('');
    setCategory('Teknoloji');
    setEndDate('');
    setEndTime('');
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <span>Yeni Tahmin Oluştur</span>
          </DialogTitle>
          <DialogDescription>
            Gelecekteki bir olay hakkında tahmin oluşturun ve diğer kullanıcıların görüşlerini öğrenin.
          </DialogDescription>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Tahmin Sorusu *
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Örnek: Bitcoin 2024 sonunda 100.000$ olacak mı?"
              className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              rows={3}
              maxLength={200}
              required
            />
            <div className="text-xs text-muted-foreground text-right">
              {question.length}/200
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Açıklama (Opsiyonel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tahmin hakkında ek bilgiler..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              rows={2}
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Kategori
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    category === cat.name
                      ? 'ring-2 ring-primary bg-primary/10 text-primary'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Date and Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Bitiş Tarihi *</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={today}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Bitiş Saati *</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={endDate === today ? currentTime : undefined}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              İptal
            </Button>
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !question.trim() || !endDate || !endTime}
                className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Oluşturuluyor...</span>
                  </div>
                ) : (
                  'Tahmin Oluştur'
                )}
              </Button>
            </motion.div>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
