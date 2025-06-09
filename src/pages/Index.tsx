
import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import PredictionChart from '@/components/PredictionChart';
import { uploadCSVFile } from '@/services/mockApi';
import { PredictionData } from '@/types/prediction';

const Index = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      console.log('Uploading file:', file.name);
      const data = await uploadCSVFile(file);
      setPredictions(data);
      setHasUploadedFile(true);
      toast({
        title: "Success!",
        description: `Generated predictions for the next 6 hours from ${file.name}`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadNew = () => {
    setHasUploadedFile(false);
    setPredictions([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4 relative">
            {hasUploadedFile && (
              <Button
                onClick={handleUploadNew}
                variant="outline"
                className="absolute top-0 right-0 gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload New File
              </Button>
            )}
            <h1 className="text-4xl font-bold tracking-tight">PEDOCS Score Predictions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your CSV data to generate future predictions for the next 6 hours
            </p>
          </div>

          {/* File Upload Section - Only show if no file uploaded */}
          {!hasUploadedFile && (
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>
          )}

          {/* Chart Section */}
          {predictions.length > 0 && (
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Prediction Results</h2>
                  <div className="text-sm text-muted-foreground">
                    Next 6 hours • {predictions.length} data points
                  </div>
                </div>
                <PredictionChart data={predictions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
