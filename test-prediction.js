// Test script to create a sample prediction in Firebase
import { createPrediction } from './src/services/firebase.js';

const testPrediction = {
  question: "Bitcoin 2025 yılı sonunda 150.000$ geçecek mi?",
  description: "Kurumsal adaptasyon ve ETF'ler göz önüne alındığında Bitcoin'in 2025 yılı sonuna kadar 150.000 doları geçip geçmeyeceği hakkında tahmin yapın.",
  category: "Kripto",
  creatorId: "test-user",
  status: "active",
  endDate: new Date('2025-12-31T23:59:59'),
  correctAnswer: "yes"
};

async function createTestPrediction() {
  try {
    console.log('Creating test prediction...');
    const predictionId = await createPrediction(testPrediction);
    console.log('Test prediction created with ID:', predictionId);
  } catch (error) {
    console.error('Error creating test prediction:', error);
  }
}

createTestPrediction();
