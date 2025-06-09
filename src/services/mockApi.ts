
import { PredictionData } from '@/types/prediction';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock prediction data for the next 6 hours
const generateMockPredictions = (): PredictionData[] => {
  const predictions: PredictionData[] = [];
  const now = new Date();
  
  // Generate data points every 30 minutes for 6 hours (12 data points)
  for (let i = 0; i < 12; i++) {
    const timestamp = new Date(now.getTime() + (i * 30 * 60 * 1000));
    
    // Generate realistic PEDOCS scores (assuming range 0-100)
    // Add some randomness and trend
    const baseScore = 65 + Math.sin(i * 0.5) * 15; // Creates a wave pattern
    const noise = (Math.random() - 0.5) * 10; // Add some random variation
    const score = Math.max(0, Math.min(100, baseScore + noise));
    
    predictions.push({
      timestamp: timestamp.toISOString(),
      score: parseFloat(score.toFixed(2))
    });
  }
  
  return predictions;
};

export const uploadCSVFile = async (file: File): Promise<PredictionData[]> => {
  console.log('Mock API: Processing file upload for', file.name);
  
  // Simulate processing time
  await delay(1500);
  
  // Simulate potential errors (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Failed to process CSV file. Please check the format and try again.');
  }
  
  // Validate file type
  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    throw new Error('Invalid file type. Please upload a CSV file.');
  }
  
  // Simulate file size check (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File too large. Please upload a file smaller than 5MB.');
  }
  
  console.log('Mock API: Successfully processed file, generating predictions');
  
  // Return mock prediction data
  return generateMockPredictions();
};
