'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { History, ArrowUp, ArrowDown, ExternalLink, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { TransactionHistoryItem } from '@/types/wings/treasury';

interface TransactionHistoryTableProps {
  transactions?: TransactionHistoryItem[];
  onTransactionClick?: (tx: TransactionHistoryItem) => void;
  className?: string;
}

const mockTransactions: TransactionHistoryItem[] = [
  { id: 'tx1', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'settlement', broker: 'Goldman Sachs', amount: 450000, direction: 'inflow', status: 'completed', reference: 'SET-2024-001' },
  { id: 'tx2', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'margin', broker: 'Morgan Stanley', amount: 125000, direction: 'outflow', status: 'completed', reference: 'MAR-2024-042' },
  { id: 'tx3', timestamp: new Date(Date.now() - 10800000).toISOString(), type: 'collateral', broker: 'JP Morgan', amount: 200000, direction: 'outflow', status: 'pending', reference: 'COL-2024-018' },
  { id: 'tx4', timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'dividend', broker: 'Various', amount: 52000, direction: 'inflow', status: 'completed', reference: 'DIV-2024-Q4' },
  { id: 'tx5', timestamp: new Date(Date.now() - 18000000).toISOString(), type: 'fee', broker: 'Goldman Sachs', amount: 8500, direction: 'outflow', status: 'completed', reference: 'FEE-2024-DEC' },
];

const typeColors = {
  settlement: 'bg-blue-500/20 text-blue-400',
  margin: 'bg-amber-500/20 text-amber-400',
  collateral: 'bg-purple-500/20 text-purple-400',
  dividend: 'bg-emerald-500/20 text-emerald-400',
  fee: 'bg-slate-500/20 text-slate-400',
};

export const TransactionHistoryTable = React.memo(function TransactionHistoryTable({ transactions = mockTransactions, onTransactionClick, className }: TransactionHistoryTableProps) {
  const [filter, setFilter] = React.useState<string>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);
  const totalInflow = transactions.filter(t => t.direction === 'inflow').reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = transactions.filter(t => t.direction === 'outflow').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <History className="h-5 w-5 text-slate-400" />
          <div>
            <h3 className="font-semibold text-white">Transaction History</h3>
            <p className="text-sm text-slate-400">Recent financial movements</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-emerald-400">
            <ArrowUp className="h-4 w-4" />${(totalInflow / 1000).toFixed(0)}K
          </div>
          <div className="flex items-center gap-1 text-red-400">
            <ArrowDown className="h-4 w-4" />${(totalOutflow / 1000).toFixed(0)}K
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'settlement', 'margin', 'collateral', 'dividend', 'fee'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
              filter === f ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-slate-400 font-medium">Time</th>
              <th className="px-4 py-3 text-left text-slate-400 font-medium">Type</th>
              <th className="px-4 py-3 text-left text-slate-400 font-medium">Broker</th>
              <th className="px-4 py-3 text-right text-slate-400 font-medium">Amount</th>
              <th className="px-4 py-3 text-center text-slate-400 font-medium">Status</th>
              <th className="px-4 py-3 text-left text-slate-400 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, idx) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => onTransactionClick?.(tx)}
                className="border-t border-white/5 hover:bg-white/5 cursor-pointer"
              >
                <td className="px-4 py-3 text-slate-300">
                  {new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-4 py-3">
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium capitalize', typeColors[tx.type])}>
                    {tx.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-white">{tx.broker}</td>
                <td className={cn('px-4 py-3 text-right font-medium', tx.direction === 'inflow' ? 'text-emerald-400' : 'text-red-400')}>
                  {tx.direction === 'inflow' ? '+' : '-'}${(tx.amount / 1000).toFixed(1)}K
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={cn(
                    'inline-block h-2 w-2 rounded-full',
                    tx.status === 'completed' ? 'bg-emerald-500' : tx.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{tx.reference}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="outline" className="w-full">
        <ExternalLink className="mr-2 h-4 w-4" />View All Transactions
      </Button>
    </div>
  );
});

export default TransactionHistoryTable;
