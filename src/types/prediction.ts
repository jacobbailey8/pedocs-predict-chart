
export interface PredictionData {
  timestamp: string;
  score: number;
}

export interface UploadResponse {
  success: boolean;
  data?: PredictionData[];
  error?: string;
}
