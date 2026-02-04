'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Shield, Clock, AlertTriangle, Check, X, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { APICredential } from '@/types/wings/vault';

interface CredentialManagerProps {
  credentials?: APICredential[];
  onRotate?: (credential: APICredential) => void;
  onRevoke?: (credential: APICredential) => void;
  className?: string;
}

const mockCredentials: APICredential[] = [
  { id: '1', name: 'Goldman Sachs API', type: 'broker', status: 'active', createdAt: new Date(Date.now() - 86400000 * 30).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 60).toISOString(), lastUsed: new Date(Date.now() - 3600000).toISOString(), masked: 'gs_prod_****7842' },
  { id: '2', name: 'Morgan Stanley FIX', type: 'broker', status: 'active', createdAt: new Date(Date.now() - 86400000 * 45).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 15).toISOString(), lastUsed: new Date(Date.now() - 7200000).toISOString(), masked: 'ms_fix_****3291' },
  { id: '3', name: 'Market Data Feed', type: 'data', status: 'expiring_soon', createdAt: new Date(Date.now() - 86400000 * 80).toISOString(), expiresAt: new Date(Date.now() + 86400000 * 5).toISOString(), lastUsed: new Date(Date.now() - 1800000).toISOString(), masked: 'mdf_****9128' },
  { id: '4', name: 'Legacy System', type: 'internal', status: 'expired', createdAt: new Date(Date.now() - 86400000 * 120).toISOString(), expiresAt: new Date(Date.now() - 86400000 * 10).toISOString(), masked: 'leg_****4521' },
];

const typeConfig = {
  broker: { color: 'text-blue-400', bg: 'bg-blue-500/20' },
  data: { color: 'text-purple-400', bg: 'bg-purple-500/20' },
  internal: { color: 'text-slate-400', bg: 'bg-slate-500/20' },
  trading: { color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
};

const statusConfig = {
  active: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Check },
  expiring_soon: { color: 'text-amber-400', bg: 'bg-amber-500/20', icon: AlertTriangle },
  expired: { color: 'text-red-400', bg: 'bg-red-500/20', icon: X },
  revoked: { color: 'text-slate-400', bg: 'bg-slate-500/20', icon: X },
};

export const CredentialManager = React.memo(function CredentialManager({ credentials = mockCredentials, onRotate, onRevoke, className }: CredentialManagerProps) {
  const [copied, setCopied] = React.useState<string | null>(null);

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeCount = credentials.filter(c => c.status === 'active').length;
  const expiringCount = credentials.filter(c => c.status === 'expiring_soon').length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">API Credentials</h3>
            <p className="text-sm text-slate-400">{activeCount} active, {expiringCount} expiring</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />Add Credential
        </Button>
      </div>

      {expiringCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-400">{expiringCount} credential(s) expiring soon</span>
        </div>
      )}

      <div className="space-y-3">
        {credentials.map((cred, idx) => {
          const type = typeConfig[cred.type] || typeConfig.internal;
          const status = statusConfig[cred.status];
          const StatusIcon = status.icon;
          const daysUntilExpiry = Math.ceil((new Date(cred.expiresAt).getTime() - Date.now()) / 86400000);

          return (
            <motion.div
              key={cred.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'rounded-xl border p-4',
                cred.status === 'expiring_soon' ? 'border-amber-500/30' : cred.status === 'expired' ? 'border-red-500/30' : 'border-white/10',
                'bg-navy-900/50'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', type.bg)}>
                    <Key className={cn('h-6 w-6', type.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white">{cred.name}</h4>
                      <span className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs', status.bg, status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {cred.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="font-mono">{cred.masked}</span>
                      <button onClick={() => handleCopy(cred.id, cred.masked)} className="hover:text-white transition-colors">
                        {copied === cred.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span className={type.color}>{cred.type}</span>
                      {cred.lastUsed && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Last used {Math.floor((Date.now() - new Date(cred.lastUsed).getTime()) / 3600000)}h ago
                        </div>
                      )}
                      <span className={daysUntilExpiry <= 0 ? 'text-red-400' : daysUntilExpiry <= 14 ? 'text-amber-400' : ''}>
                        {daysUntilExpiry <= 0 ? 'Expired' : `Expires in ${daysUntilExpiry}d`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onRotate?.(cred)} disabled={cred.status === 'revoked'}>
                    Rotate
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-400 hover:text-red-300" onClick={() => onRevoke?.(cred)} disabled={cred.status === 'revoked'}>
                    Revoke
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

export default CredentialManager;
