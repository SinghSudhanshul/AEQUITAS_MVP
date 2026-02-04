'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, MapPin, AlertCircle, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { CSVUploadPreview, CSVColumnMapping } from '@/types/wings/bullpen';

interface PositionCSVPreviewUploadProps {
  onUpload?: (file: File) => void;
  onConfirm?: (mappings: CSVColumnMapping[]) => void;
  className?: string;
}

const mockPreview: CSVUploadPreview = {
  fileName: 'positions_q4_2024.csv',
  rowCount: 1250,
  columnCount: 12,
  columns: ['Date', 'Ticker', 'Quantity', 'Price', 'Value', 'Margin', 'Broker', 'Account'],
  sampleRows: [
    ['2024-12-01', 'AAPL', '1000', '189.50', '189500', '15%', 'Goldman', 'Prime'],
    ['2024-12-01', 'MSFT', '500', '378.20', '189100', '12%', 'Goldman', 'Prime'],
    ['2024-12-01', 'GOOGL', '250', '140.75', '35187.50', '10%', 'Morgan Stanley', 'Hedge'],
  ],
  validationStatus: 'pending' as const,
  errors: [],
  warnings: ['Column "Margin" contains percentage symbols that will be stripped'],
};

const targetFields = ['date', 'symbol', 'quantity', 'price', 'market_value', 'margin_pct', 'broker', 'account'];

export const PositionCSVPreviewUpload = React.memo(function PositionCSVPreviewUpload({ onUpload, onConfirm, className }: PositionCSVPreviewUploadProps) {
  const [preview, setPreview] = React.useState<CSVUploadPreview | null>(null);
  const [mappings, setMappings] = React.useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload and parsing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      setUploadProgress(i);
    }
    setPreview(mockPreview);
    setIsUploading(false);
    onUpload?.(file);
  };

  const handleConfirm = () => {
    const columnMappings: CSVColumnMapping[] = Object.entries(mappings).map(([source, target]) => ({
      sourceColumn: source,
      targetField: target,
      transform: undefined,
    }));
    onConfirm?.(columnMappings);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
        <div>
          <h3 className="font-semibold text-white">Position CSV Upload</h3>
          <p className="text-sm text-slate-400">Preview and map columns before import</p>
        </div>
      </div>

      {!preview ? (
        <div className="rounded-xl border-2 border-dashed border-white/20 p-8 text-center">
          {isUploading ? (
            <div className="space-y-4">
              <Loader2 className="mx-auto h-12 w-12 text-emerald-400 animate-spin" />
              <p className="text-slate-400">Processing file...</p>
              <Progress value={uploadProgress} variant="xp" className="max-w-xs mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-400">Drop your CSV file here or click to browse</p>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload">
                <Button variant="outline" className="mt-4" asChild><span>Select File</span></Button>
              </label>
            </>
          )}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* File info */}
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-emerald-400" />
              <div>
                <p className="font-medium text-white">{preview.fileName}</p>
                <p className="text-sm text-slate-400">{preview.rowCount} rows × {preview.columnCount} columns</p>
              </div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>

          {/* Warnings */}
          {preview.warnings.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              {preview.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  {w}
                </div>
              ))}
            </div>
          )}

          {/* Column mapping */}
          <div className="rounded-lg border border-white/10 bg-navy-900/50 p-4">
            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-400" />
              Column Mapping
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {preview.columns.slice(0, 6).map(col => (
                <div key={col} className="flex items-center justify-between rounded-lg bg-white/5 p-2">
                  <span className="text-sm text-slate-300">{col}</span>
                  <select
                    value={mappings[col] || ''}
                    onChange={(e) => setMappings(prev => ({ ...prev, [col]: e.target.value }))}
                    className="rounded bg-navy-800 border border-white/10 px-2 py-1 text-sm text-white"
                  >
                    <option value="">Select...</option>
                    {targetFields.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Preview table */}
          <div className="rounded-lg border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-navy-800/50">
                  <tr>
                    {preview.columns.slice(0, 6).map(col => (
                      <th key={col} className="px-4 py-2 text-left font-medium text-slate-400">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.sampleRows.map((row, i) => (
                    <tr key={i} className="border-t border-white/5">
                      {row.slice(0, 6).map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-slate-300">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleConfirm} className="flex-1">Confirm & Import</Button>
            <Button variant="outline" onClick={() => setPreview(null)}>Cancel</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default PositionCSVPreviewUpload;
