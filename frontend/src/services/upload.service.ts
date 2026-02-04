// ============================================
// UPLOAD SERVICE
// File Upload API Calls
// ============================================

import apiClient from './api/client';

export interface UploadProgress {
  loaded: number;
  total: number;
}

export interface UploadResult {
  success: boolean;
  filename: string;
  rows: number;
  uploadId: string;
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  uploadedAt: string;
  size: number;
  rows: number;
  status: 'completed' | 'processing' | 'failed';
  processedAt?: string;
}

export const uploadService = {
  // Upload file with progress tracking
  async uploadFile(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    // For demo/development
    if (import.meta.env.DEV) {
      // Simulate upload progress
      const totalChunks = 10;
      for (let i = 1; i <= totalChunks; i++) {
        await new Promise(r => setTimeout(r, 200));
        onProgress?.({
          loaded: (file.size / totalChunks) * i,
          total: file.size,
        });
      }

      return {
        success: true,
        filename: file.name,
        rows: Math.floor(10000 + Math.random() * 10000),
        uploadId: 'UPL-' + Date.now(),
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    // Use apiClient.upload
    const response = await apiClient.upload<UploadResult>('/upload/csv', formData, (progress) => {
      // Simple progress mapping (percent)
      onProgress?.({
        loaded: (progress / 100) * file.size,
        total: file.size
      });
    });

    return response.data;
  },

  // Get upload history
  async getUploadHistory(limit: number = 10): Promise<UploadHistoryItem[]> {
    if (import.meta.env.DEV) {
      return [
        { id: '1', filename: 'positions_2026-01-31.csv', uploadedAt: '2026-01-31T08:15:00Z', size: 2400000, rows: 15420, status: 'completed', processedAt: '2026-01-31T08:16:30Z' },
        { id: '2', filename: 'positions_2026-01-30.csv', uploadedAt: '2026-01-30T08:22:00Z', size: 2300000, rows: 14890, status: 'completed', processedAt: '2026-01-30T08:23:15Z' },
        { id: '3', filename: 'positions_2026-01-29.csv', uploadedAt: '2026-01-29T08:10:00Z', size: 2500000, rows: 15780, status: 'completed', processedAt: '2026-01-29T08:12:00Z' },
      ];
    }

    const response = await apiClient.get<UploadHistoryItem[]>(`/upload/history?limit=${limit}`);
    return response.data;
  },

  // Get upload status
  async getUploadStatus(uploadId: string): Promise<UploadHistoryItem> {
    const response = await apiClient.get<UploadHistoryItem>(`/upload/${uploadId}`);
    return response.data;
  },

  // Reprocess upload
  async reprocessUpload(uploadId: string): Promise<void> {
    await apiClient.post(`/upload/${uploadId}/reprocess`);
  },

  // Delete upload
  async deleteUpload(uploadId: string): Promise<void> {
    await apiClient.delete(`/upload/${uploadId}`);
  },

  // Download template
  async downloadTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const token = localStorage.getItem('auth_token'); // Or from store
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

    const response = await fetch(`${baseUrl}/upload/template?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  },

  // Validate file before upload
  async validateFile(file: File): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    preview: Record<string, unknown>[];
  }> {
    if (import.meta.env.DEV) {
      return {
        valid: true,
        errors: [],
        warnings: [],
        preview: [
          { Date: '2026-01-31', 'Security ID': 'AAPL', 'Position Size': 10000, 'Market Value': 1750000 },
          { Date: '2026-01-31', 'Security ID': 'GOOGL', 'Position Size': 5000, 'Market Value': 875000 },
        ],
      };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{
      valid: boolean;
      errors: string[];
      warnings: string[];
      preview: Record<string, unknown>[];
    }>('/upload/validate', formData);

    return response.data;
  },
};

export default uploadService;
