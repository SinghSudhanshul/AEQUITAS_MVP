// ============================================
// UPLOAD HOOK
// File Upload Logic & Progress Tracking
// ============================================

import { useState, useCallback } from 'react';
import { uploadService } from '@/services/upload.service';

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResult {
  success: boolean;
  filename: string;
  rows: number;
  uploadId: string;
}

interface UseUploadOptions {
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}

export const useUpload = (options: UseUploadOptions = {}) => {
  const { onProgress, onSuccess, onError } = options;

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({ loaded: 0, total: 0, percentage: 0 });
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const upload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const uploadResult = await uploadService.uploadFile(file, (progressEvent) => {
        const progressData = {
          loaded: progressEvent.loaded,
          total: progressEvent.total || file.size,
          percentage: Math.round((progressEvent.loaded / (progressEvent.total || file.size)) * 100),
        };
        setProgress(progressData);
        onProgress?.(progressData);
      });

      setResult(uploadResult);
      onSuccess?.(uploadResult);
      return uploadResult;
    } catch (err) {
      const errorMessage = (err as Error).message || 'Upload failed';
      setError(errorMessage);
      onError?.(err as Error);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [onProgress, onSuccess, onError]);

  const uploadMultiple = useCallback(async (files: File[]) => {
    const results: UploadResult[] = [];

    for (const file of files) {
      const result = await upload(file);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }, [upload]);

  const validateFile = useCallback((file: File, options?: {
    maxSize?: number;
    acceptedTypes?: string[];
  }) => {
    const { maxSize = 10 * 1024 * 1024, acceptedTypes = ['.csv', '.xlsx'] } = options || {};

    // Check size
    if (file.size > maxSize) {
      return { valid: false, error: `File too large. Maximum size: ${maxSize / (1024 * 1024)}MB` };
    }

    // Check type
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(extension)) {
      return { valid: false, error: `Invalid file type. Accepted: ${acceptedTypes.join(', ')}` };
    }

    return { valid: true, error: null };
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
    setResult(null);
  }, []);

  return {
    upload,
    uploadMultiple,
    validateFile,
    reset,
    isUploading,
    progress,
    error,
    result,
  };
};

export default useUpload;
