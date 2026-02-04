'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, AlertTriangle, Clock, Eye, User, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SecureDocument } from '@/types/wings/vault';

interface SecureDocumentListProps {
  documents?: SecureDocument[];
  onAccessDocument?: (doc: SecureDocument) => void;
  className?: string;
}

const mockDocuments: SecureDocument[] = [
  { id: '1', name: 'Master Position File', classification: 'top_secret', lastAccessed: new Date(Date.now() - 3600000).toISOString(), accessLevel: 5, encrypted: true, size: '2.4 MB' },
  { id: '2', name: 'Broker Credentials', classification: 'confidential', lastAccessed: new Date(Date.now() - 86400000).toISOString(), accessLevel: 4, encrypted: true, size: '145 KB' },
  { id: '3', name: 'Settlement Records 2024', classification: 'internal', lastAccessed: new Date(Date.now() - 172800000).toISOString(), accessLevel: 3, encrypted: true, size: '8.7 MB' },
  { id: '4', name: 'Regulatory Filings', classification: 'internal', lastAccessed: new Date(Date.now() - 259200000).toISOString(), accessLevel: 2, encrypted: false, size: '3.2 MB' },
];

const classificationConfig = {
  top_secret: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: AlertTriangle },
  confidential: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: Lock },
  internal: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: Shield },
  public: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', icon: Unlock },
};

export const SecureDocumentList = React.memo(function SecureDocumentList({ documents = mockDocuments, onAccessDocument, className }: SecureDocumentListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-red-400" />
          <div>
            <h3 className="font-semibold text-white">Secure Documents</h3>
            <p className="text-sm text-slate-400">Encrypted file vault</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-400">
          <Lock className="h-4 w-4" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      <div className="space-y-2">
        {documents.map((doc, idx) => {
          const classification = classificationConfig[doc.classification] || classificationConfig.internal;
          const ClassIcon = classification.icon;
          const accessAgo = Math.floor((Date.now() - new Date(doc.lastAccessed).getTime()) / 3600000);

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn('rounded-xl border p-4', classification.border, 'bg-navy-900/50')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', classification.bg)}>
                    <ClassIcon className={cn('h-6 w-6', classification.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-white">{doc.name}</h4>
                      {doc.encrypted && <Lock className="h-3 w-3 text-emerald-400" />}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className={cn('uppercase text-xs', classification.color)}>{doc.classification.replace('_', ' ')}</span>
                      <span>{doc.size}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />{accessAgo}h ago
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <Key className="h-4 w-4" />
                    <span>Level {doc.accessLevel}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onAccessDocument?.(doc)}>
                    <Eye className="mr-2 h-4 w-4" />Access
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

export default SecureDocumentList;
