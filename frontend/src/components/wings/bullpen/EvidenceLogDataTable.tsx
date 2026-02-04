'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { FileText, Upload, AlertCircle, CheckCircle2, Clock, MoreHorizontal, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DataTable, DataTableColumnHeader, DataTableRowActions } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import type { EvidenceLogEntry } from '@/types/wings/bullpen';

interface EvidenceLogDataTableProps {
  data?: EvidenceLogEntry[];
  onRowClick?: (entry: EvidenceLogEntry) => void;
  className?: string;
}

const mockData: EvidenceLogEntry[] = [
  { id: '1', timestamp: new Date().toISOString(), type: 'upload', title: 'Q4 Position Snapshot', description: 'Daily position data from Goldman Sachs', user: 'Mike Ross', metadata: {}, tags: ['positions', 'daily'], attachments: [] },
  { id: '2', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'forecast', title: 'Liquidity Forecast Generated', description: 'P50 forecast: $2.45M', user: 'System', metadata: {}, tags: ['forecast', 'auto'], attachments: [] },
  { id: '3', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'alert', title: 'Margin Warning', description: 'Approaching 80% margin utilization', user: 'System', metadata: {}, tags: ['margin', 'warning'], attachments: [] },
  { id: '4', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'decision', title: 'Rebalancing Approved', description: 'Portfolio rebalancing executed', user: 'Harvey Specter', metadata: {}, tags: ['decision', 'approved'], attachments: [] },
];

const typeIcons: Record<string, React.ReactNode> = {
  upload: <Upload className="h-4 w-4 text-blue-400" />,
  forecast: <FileText className="h-4 w-4 text-emerald-400" />,
  alert: <AlertCircle className="h-4 w-4 text-amber-400" />,
  decision: <CheckCircle2 className="h-4 w-4 text-purple-400" />,
  modification: <Clock className="h-4 w-4 text-slate-400" />,
};

const columns: ColumnDef<EvidenceLogEntry>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {typeIcons[row.getValue('type') as string]}
        <span className="capitalize text-slate-300">{row.getValue('type')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Event" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-white">{row.getValue('title')}</p>
        <p className="text-xs text-slate-400">{row.original.description}</p>
      </div>
    ),
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => <span className="text-slate-300">{row.getValue('user')}</span>,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => (
      <span className="text-sm text-slate-400">
        {format(new Date(row.getValue('timestamp')), 'MMM d, h:mm a')}
      </span>
    ),
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex gap-1">
        {(row.getValue('tags') as string[]).slice(0, 2).map(tag => (
          <span key={tag} className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">
            <Tag className="mr-1 h-3 w-3" />{tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        actions={[
          { label: 'View Details', onClick: () => console.log('View', row.original.id) },
          { label: 'Export', onClick: () => console.log('Export', row.original.id) },
          { label: 'Delete', onClick: () => console.log('Delete', row.original.id), variant: 'destructive' },
        ]}
      />
    ),
  },
];

export const EvidenceLogDataTable = React.memo(function EvidenceLogDataTable({ data = mockData, onRowClick, className }: EvidenceLogDataTableProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Evidence Log</h3>
          <p className="text-sm text-slate-400">Complete audit trail of all platform activities</p>
        </div>
        <Button><Upload className="mr-2 h-4 w-4" />Add Entry</Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search evidence..." variant="evidence-log" onRowClick={onRowClick} />
    </div>
  );
});

export default EvidenceLogDataTable;
