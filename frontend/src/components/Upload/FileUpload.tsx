// ============================================
// FILE UPLOAD COMPONENT
// CSV Data Upload with Drag & Drop
// ============================================

import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onUpload?: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  acceptedTypes = ['.csv', '.xlsx'],
  maxSize = 10,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      setError(`Invalid file type. Accepted: ${acceptedTypes.join(', ')}`);
      return false;
    }

    // Check file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSize) {
      setError(`File too large. Maximum size: ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, [acceptedTypes, maxSize]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  }, [acceptedTypes, maxSize]);

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(r => setTimeout(r, 200));
        setUploadProgress(i);
      }

      onUpload?.(file);
      setFile(null);
    } catch (err) {
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <span>📤</span> Upload Position Data
        </CardTitle>
        <CardDescription>
          Upload your CSV or Excel file containing position snapshots
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
            ${isDragging
              ? 'border-precision-teal bg-precision-teal/10'
              : 'border-glass-border hover:border-institutional-blue hover:bg-glass-white'
            }
          `}
        >
          <input
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          {!file ? (
            <div className="space-y-3">
              <div className="text-5xl">📁</div>
              <div className="text-off-white font-medium">
                Drag & drop your file here
              </div>
              <div className="text-muted text-sm">
                or <span className="text-precision-teal underline">browse</span> to select
              </div>
              <div className="text-muted text-xs">
                Accepts: {acceptedTypes.join(', ')} • Max size: {maxSize}MB
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-5xl">✅</div>
              <div className="text-off-white font-medium">{file.name}</div>
              <div className="text-muted text-sm">{formatFileSize(file.size)}</div>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Uploading...</span>
              <span className="text-precision-teal">{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-charcoal rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-institutional-blue to-precision-teal rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        {file && !isUploading && (
          <div className="flex gap-3">
            <Button variant="default" className="flex-1" onClick={handleUpload}>
              Upload File
            </Button>
            <Button variant="ghost" onClick={() => setFile(null)}>
              Cancel
            </Button>
          </div>
        )}

        {/* Help Text */}
        <Alert variant="info">
          <AlertTitle>File Format</AlertTitle>
          <AlertDescription>
            Your CSV should include columns: Date, Security ID, Position Size, Market Value, Asset Class.
            <a href="#" className="text-precision-teal underline ml-1">Download template</a>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
