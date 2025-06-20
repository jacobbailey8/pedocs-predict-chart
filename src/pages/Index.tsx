import React, { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Upload, Info } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import PredictionChart from '@/components/PredictionChart';
import { uploadCSVFile } from '@/services/predictScores';
import { PredictionData } from '@/types/prediction';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Index = () => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUploadedFile, setHasUploadedFile] = useState(false);
  const [timeRange, setTimeRange] = useState(24); // Default to 24 hours

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      console.log('Uploading file:', file.name);
      const data = await uploadCSVFile(file);
      setPredictions(data);
      setHasUploadedFile(true);
      // toast({
      //   title: "Success!",
      //   description: `Generated predictions for the next 6 hours from ${file.name}`,
      // });
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
            <h1 className="text-4xl font-bold tracking-tight">PEDOCS Score Predictions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your CSV data to generate future predictions for the next 24 hours
            </p>
            {hasUploadedFile && (
              <Button
                onClick={handleUploadNew}
                variant="outline"
                className=""
              >
                <Upload className="w-4 h-4" />
                Upload New File
              </Button>
            )}
          </div>

          {/* File Upload Section - Only show if no file uploaded */}
          {!hasUploadedFile && (
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upload CSV File</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px] p-4">
                      <p className="font-medium mb-2">CSV File Format Requirements:</p>
                      <ul className="text-sm space-y-2">
                        <li>• Must include columns: 'PEDOCS Score' and 'Hour'</li>
                        <li>• 'Hour' format: YYYY-MM-DD HH:MM:SS (e.g., 2024-11-06 04:00:00)</li>
                        <li>• 'PEDOCS Score' must be a number</li>
                        <li>• File should contain 48 rows representing the previous 48 hours</li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
            </div>
          )}

          {/* Chart Section */}
          {predictions && predictions.length > 0 && (
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Prediction Results</h2>
                  <Select
                    value={timeRange.toString()}
                    onValueChange={(value) => setTimeRange(Number(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Next 3 hours</SelectItem>
                      <SelectItem value="6">Next 6 hours</SelectItem>
                      <SelectItem value="12">Next 12 hours</SelectItem>
                      <SelectItem value="24">Next 24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <PredictionChart data={predictions} timeRange={timeRange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
