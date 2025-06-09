
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileInput, Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isLoading }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (csvFile) {
      onFileUpload(csvFile);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  return (
    <Card 
      className={`relative border-2 border-dashed transition-all duration-200 ${
        isDragOver 
          ? 'border-primary bg-primary/5' 
          : 'border-muted hover:border-primary/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="p-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {isLoading ? (
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            ) : (
              <FileInput className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload CSV File</h3>
            <p className="text-muted-foreground text-sm">
              Drag and drop your CSV file here, or click to browse
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              disabled={isLoading}
              onClick={() => document.getElementById('file-input')?.click()}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {isLoading ? 'Processing...' : 'Choose File'}
            </Button>
            
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="text-xs text-muted-foreground">
              Supported format: CSV files only
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FileUpload;
