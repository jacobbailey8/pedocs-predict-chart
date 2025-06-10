import { PredictionData } from '@/types/prediction';

const API_BASE_URL = 'https://pedocs-backend.fly.dev';


export const uploadCSVFile = async (file: File): Promise<PredictionData[]> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to process CSV file: ${error.message}`);
    }
    throw new Error('An unexpected error occurred while processing the file');
  }
};
