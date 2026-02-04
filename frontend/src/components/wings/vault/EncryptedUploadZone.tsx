'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Upload, FileUp, Check, AlertCircle, Shield, Lock, X, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface EncryptedUploadZoneProps {
  onUpload?: (files: File[]) => void;
  maxSize?: number;
  className?: string;
}

type UploadFile = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'encrypting' | 'complete' | 'error';
  error?: string;
};

export const EncryptedUploadZone = React.memo(function EncryptedUploadZone({ onUpload, maxSize = 50, className }: EncryptedUploadZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<UploadFile[]>([]);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: UploadFile[] = droppedFiles.map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      size: f.size,
      progress: 0,
      status: 'uploading',
    }));

    setFiles(prev => [...prev, ...newFiles]);
    onUpload?.(droppedFiles);

    // Simulate upload progress
    newFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'encrypting' } : f
          ));
          // Simulate encryption
          setTimeout(() => {
            setFiles(prev => prev.map(f =>
              f.id === file.id ? { ...f, status: 'complete' } : f
            ));
          }, 1000);
        } else {
          setFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress } : f
          ));
        }
      }, 200);
    });
  }, [onUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Upload className="h-5 w-5 text-blue-400" />
        <div>
          <h3 className="font-semibold text-white">Encrypted Upload</h3>
          <p className="text-sm text-slate-400">Files are encrypted before storage</p>
        </div>
      </div>

      {/* Drop zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        className={cn(
          'relative rounded-xl border-2 border-dashed p-8 text-center transition-colors',
          isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/20 bg-white/5',
          'hover:border-blue-500/50 hover:bg-blue-500/5'
        )}
      >
        <FileUp className={cn('h-12 w-12 mx-auto mb-4', isDragging ? 'text-blue-400' : 'text-slate-400')} />
        <p className="text-white font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-slate-400 mb-4">or click to browse</p>
        <input
          type="file"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            if (selectedFiles.length > 0) {
              handleDrop({ dataTransfer: { files: e.target.files! }, preventDefault: () => { } } as React.DragEvent);
            }
          }}
        />
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>AES-256 encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Max {maxSize}MB</span>
          </div>
        </div>
      </motion.div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={cn(
                'rounded-lg border p-3',
                file.status === 'error' ? 'border-red-500/30 bg-red-500/5' :
                  file.status === 'complete' ? 'border-emerald-500/30 bg-emerald-500/5' :
                    'border-white/10 bg-white/5'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === 'uploading' && (
                    <span className="text-xs text-blue-400">Uploading...</span>
                  )}
                  {file.status === 'encrypting' && (
                    <span className="text-xs text-purple-400 flex items-center gap-1">
                      <Lock className="h-3 w-3 animate-pulse" />Encrypting...
                    </span>
                  )}
                  {file.status === 'complete' && (
                    <Check className="h-5 w-5 text-emerald-400" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  )}
                  <button onClick={() => removeFile(file.id)} className="text-slate-400 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {(file.status === 'uploading' || file.status === 'encrypting') && (
                <Progress value={file.progress} className="h-1" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
});

export default EncryptedUploadZone;
