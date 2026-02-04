// ============================================
// UPLOAD HISTORY COMPONENT
// Past Uploads Log with Status
// ============================================

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface UploadEntry {
  id: string;
  filename: string;
  uploadedAt: string;
  size: string;
  rows: number;
  status: 'completed' | 'processing' | 'failed';
  processedAt?: string;
}

interface UploadHistoryProps {
  uploads?: UploadEntry[];
}

const mockUploads: UploadEntry[] = [
  { id: '1', filename: 'positions_2026-01-31.csv', uploadedAt: '2026-01-31 08:15 AM', size: '2.4 MB', rows: 15420, status: 'completed', processedAt: '2026-01-31 08:16 AM' },
  { id: '2', filename: 'positions_2026-01-30.csv', uploadedAt: '2026-01-30 08:22 AM', size: '2.3 MB', rows: 14890, status: 'completed', processedAt: '2026-01-30 08:23 AM' },
  { id: '3', filename: 'positions_2026-01-29.csv', uploadedAt: '2026-01-29 08:10 AM', size: '2.5 MB', rows: 15780, status: 'completed', processedAt: '2026-01-29 08:12 AM' },
  { id: '4', filename: 'transactions_Q4.csv', uploadedAt: '2026-01-28 02:30 PM', size: '5.1 MB', rows: 0, status: 'failed' },
  { id: '5', filename: 'positions_2026-01-28.csv', uploadedAt: '2026-01-28 08:05 AM', size: '2.4 MB', rows: 15100, status: 'completed', processedAt: '2026-01-28 08:07 AM' },
];

export const UploadHistory: React.FC<UploadHistoryProps> = ({ uploads = mockUploads }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getStatusBadge = (status: UploadEntry['status']) => {
    const styles = {
      completed: 'bg-steady-green/10 text-steady-green border-steady-green/30',
      processing: 'bg-elevated-amber/10 text-elevated-amber border-elevated-amber/30',
      failed: 'bg-crisis-red/10 text-crisis-red border-crisis-red/30',
    };
    const labels = {
      completed: '✓ Completed',
      processing: '⏳ Processing',
      failed: '✕ Failed',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <Card variant="glass">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Upload History</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              onClick={() => setSelectedId(selectedId === upload.id ? null : upload.id)}
              className={`
                p-4 rounded-lg border transition-all duration-200 cursor-pointer
                ${selectedId === upload.id
                  ? 'bg-institutional-blue/10 border-institutional-blue/30'
                  : 'bg-glass-white border-glass-border hover:border-glass-border/60'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {upload.status === 'completed' ? '📄' : upload.status === 'processing' ? '⏳' : '⚠️'}
                  </span>
                  <div>
                    <div className="font-medium text-off-white">{upload.filename}</div>
                    <div className="text-xs text-muted">{upload.uploadedAt}</div>
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(upload.status)}
                  <div className="text-xs text-muted mt-1">{upload.size}</div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedId === upload.id && (
                <div className="mt-4 pt-4 border-t border-glass-border grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted text-xs uppercase tracking-wider">Rows</div>
                    <div className="font-semibold text-off-white">{upload.rows.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted text-xs uppercase tracking-wider">Processed</div>
                    <div className="font-semibold text-off-white">{upload.processedAt || 'N/A'}</div>
                  </div>
                  <div className="flex items-end justify-end gap-2">
                    <Button variant="ghost" size="sm">Reprocess</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadHistory;
