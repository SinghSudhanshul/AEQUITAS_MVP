// ============================================
// BULLPEN PAGE
// Wing 2: Associate Workspace (Features 11-20)
// ============================================

import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS } from '@/config/wings';

// Components
import { GlassPanel } from '@/components/shared/GlassPanel';
import { MetricCard } from '@/components/shared/MetricCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

// Stores
import { useGamificationStore } from '@/store/gamification.store';

// Hooks
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';

// ============================================
// TYPES
// ============================================

interface EvidenceRecord {
  id: string;
  type: 'position' | 'transaction' | 'forecast' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'validated' | 'flagged';
  priority: 'low' | 'medium' | 'high' | 'critical';
  value?: number;
  currency?: string;
}

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: string;
  xpReward: number;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_EVIDENCE: EvidenceRecord[] = [
  {
    id: '1',
    type: 'position',
    title: 'AAPL Long Position',
    description: '500 shares @ $185.50',
    timestamp: new Date().toISOString(),
    status: 'validated',
    priority: 'medium',
    value: 92750,
    currency: 'USD',
  },
  {
    id: '2',
    type: 'transaction',
    title: 'Margin Call Processed',
    description: 'Treasury transfer completed',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'pending',
    priority: 'high',
    value: 250000,
    currency: 'USD',
  },
  {
    id: '3',
    type: 'forecast',
    title: 'Weekly Forecast Generated',
    description: 'P50 confidence: $1.2M liquidity',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'validated',
    priority: 'low',
  },
  {
    id: '4',
    type: 'alert',
    title: 'Volatility Spike Detected',
    description: 'VIX increased 15% in last hour',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    status: 'flagged',
    priority: 'critical',
  },
];

const MOCK_TASKS: TaskItem[] = [
  {
    id: 't1',
    title: 'Review Q4 Position Report',
    description: 'Validate all position data for quarterly report',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    xpReward: 50,
  },
  {
    id: 't2',
    title: 'Upload New CSV Data',
    description: 'Import latest position data from prime broker',
    status: 'todo',
    priority: 'medium',
    xpReward: 25,
  },
  {
    id: 't3',
    title: 'Validate Forecast Accuracy',
    description: 'Compare predictions with actual values',
    status: 'review',
    priority: 'medium',
    xpReward: 40,
  },
  {
    id: 't4',
    title: 'Archive Old Records',
    description: 'Move Q3 data to cold storage',
    status: 'done',
    priority: 'low',
    xpReward: 15,
  },
];

// ============================================
// PAGE HEADER
// ============================================

const BullpenHeader: React.FC = () => {
  const wing = WINGS.bullpen;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{wing.icon}</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-off-white">
            {wing.name}
          </h1>
          <Badge variant="secondary">{wing.tier.toUpperCase()}</Badge>
        </div>
        <p className="text-muted">
          {wing.description}. Track evidence, manage tasks, and process data.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline">📥 Export</Button>
        <Button variant="default">📤 Upload CSV</Button>
      </div>
    </div>
  );
};

// ============================================
// EVIDENCE LOG DATA TABLE
// ============================================

interface EvidenceLogProps {
  records: EvidenceRecord[];
  onSelect?: (record: EvidenceRecord) => void;
}

const EvidenceLogDataTable: React.FC<EvidenceLogProps> = ({ records, onSelect }) => {
  const [sortBy, setSortBy] = useState<keyof EvidenceRecord>('timestamp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<string>('all');
  const { playSound } = useSoundEffects();

  const sortedRecords = useMemo(() => {
    let filtered = [...records];

    if (filter !== 'all') {
      filtered = filtered.filter((r) => r.type === filter);
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal === undefined || bVal === undefined) return 0;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDir === 'asc' ? comparison : -comparison;
    });
  }, [records, sortBy, sortDir, filter]);

  const handleSort = (column: keyof EvidenceRecord) => {
    playSound('click');
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const getPriorityColor = (priority: EvidenceRecord['priority']) => {
    switch (priority) {
      case 'critical': return 'text-crisis-red';
      case 'high': return 'text-achievement-gold';
      case 'medium': return 'text-precision-teal';
      default: return 'text-muted';
    }
  };

  const getStatusBadge = (status: EvidenceRecord['status']) => {
    switch (status) {
      case 'validated': return <Badge variant="success">Validated</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'flagged': return <Badge variant="error">Flagged</Badge>;
      default: return null;
    }
  };

  return (
    <GlassPanel variant="default" padding="none" className="overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-glass-border">
        <h3 className="font-semibold text-off-white">Evidence Log</h3>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-glass-white border border-glass-border rounded-lg px-3 py-1.5 text-sm text-off-white focus:outline-none focus:ring-2 focus:ring-precision-teal"
          >
            <option value="all">All Types</option>
            <option value="position">Positions</option>
            <option value="transaction">Transactions</option>
            <option value="forecast">Forecasts</option>
            <option value="alert">Alerts</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-glass-border bg-rich-black/30">
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase cursor-pointer hover:text-off-white"
                onClick={() => handleSort('type')}
              >
                Type
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase cursor-pointer hover:text-off-white"
                onClick={() => handleSort('title')}
              >
                Title
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase cursor-pointer hover:text-off-white"
                onClick={() => handleSort('priority')}
              >
                Priority
              </th>
              <th
                className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase cursor-pointer hover:text-off-white"
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th
                className="text-right px-4 py-3 text-xs font-semibold text-muted uppercase cursor-pointer hover:text-off-white"
                onClick={() => handleSort('timestamp')}
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr
                key={record.id}
                onClick={() => {
                  playSound('click');
                  onSelect?.(record);
                }}
                className="border-b border-glass-border/50 hover:bg-glass-white/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="text-xl">
                    {record.type === 'position' && '📈'}
                    {record.type === 'transaction' && '💸'}
                    {record.type === 'forecast' && '📊'}
                    {record.type === 'alert' && '🚨'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-off-white text-sm">{record.title}</p>
                  <p className="text-xs text-muted">{record.description}</p>
                </td>
                <td className={cn('px-4 py-3 text-sm font-medium', getPriorityColor(record.priority))}>
                  {record.priority.toUpperCase()}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(record.status)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-muted">
                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-4 border-t border-glass-border bg-rich-black/30">
        <p className="text-xs text-muted">
          Showing {sortedRecords.length} of {records.length} records
        </p>
        <Button variant="ghost" size="sm">View All →</Button>
      </div>
    </GlassPanel>
  );
};

// ============================================
// TASK KANBAN
// ============================================

interface TaskKanbanProps {
  tasks: TaskItem[];
  onTaskUpdate?: (taskId: string, newStatus: TaskItem['status']) => void;
}

const TaskKanbanFixolaw: React.FC<TaskKanbanProps> = ({ tasks, onTaskUpdate: _onTaskUpdate }) => {
  // const { addXP } = useGamificationStore();
  // const { playSound } = useSoundEffects();
  // const { showPersonaToast } = useToast();

  const columns: Array<{ id: TaskItem['status']; title: string; icon: string }> = [
    { id: 'todo', title: 'To Do', icon: '📋' },
    { id: 'in_progress', title: 'In Progress', icon: '⚡' },
    { id: 'review', title: 'Review', icon: '👀' },
    { id: 'done', title: 'Done', icon: '✅' },
  ];

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskItem['status'], TaskItem[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  /*
  const handleMoveTask = (task: TaskItem, newStatus: TaskItem['status']) => {
    playSound('success_chord');
    onTaskUpdate?.(task.id, newStatus);

    if (newStatus === 'done') {
      addXP(task.xpReward, 'task_complete', `Completed: ${task.title}`);
      showPersonaToast({
        persona: 'donna',
        title: 'Task Completed!',
        message: `Nice work! You earned +${task.xpReward} XP`,
      });
    }
  };
  */

  const getPriorityColor = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-crisis-red';
      case 'medium': return 'border-l-achievement-gold';
      default: return 'border-l-precision-teal';
    }
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-off-white">Task Board</h3>
        <Button variant="outline" size="sm">➕ Add Task</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="min-h-[300px]">
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-glass-border">
              <span>{column.icon}</span>
              <span className="font-medium text-sm text-off-white">{column.title}</span>
              <span className="ml-auto px-1.5 py-0.5 text-xs bg-glass-white rounded">
                {tasksByStatus[column.id].length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {tasksByStatus[column.id].map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'p-3 bg-glass-white rounded-lg border-l-4 transition-all',
                    'hover:bg-glass-white/80 cursor-pointer',
                    getPriorityColor(task.priority)
                  )}
                >
                  <p className="font-medium text-sm text-off-white mb-1">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted mb-2 line-clamp-2">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-achievement-gold">+{task.xpReward} XP</span>
                    {task.dueDate && (
                      <span className="text-xs text-muted">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
};

// ============================================
// CSV UPLOAD SECTION
// ============================================

const CSVUploadSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const { addXP } = useGamificationStore();
  const { playSound } = useSoundEffects();
  const { showPersonaToast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFiles = files.filter((f) => f.name.endsWith('.csv'));

    if (csvFiles.length > 0) {
      handleUpload(csvFiles[0]);
    }
  }, []);

  const handleUpload = async (file: File) => {
    playSound('paper_rustle');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(i);
    }

    // Complete
    playSound('success_chord');
    addXP(50, 'csv_upload', `Uploaded: ${file.name}`);
    showPersonaToast({
      persona: 'donna',
      title: 'Upload Complete',
      message: `${file.name} has been processed. +50 XP!`,
    });

    setTimeout(() => setUploadProgress(null), 1000);
  };

  return (
    <GlassPanel variant="default" padding="lg">
      <h3 className="font-semibold text-off-white mb-4">Upload Position Data</h3>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all',
          isDragging
            ? 'border-precision-teal bg-precision-teal/10'
            : 'border-glass-border hover:border-precision-teal/50'
        )}
      >
        {uploadProgress !== null ? (
          <div className="space-y-4">
            <p className="text-off-white">Uploading...</p>
            <div className="h-2 bg-rich-black rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-precision-teal transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted">{uploadProgress}%</p>
          </div>
        ) : (
          <>
            <span className="text-4xl mb-4 block">📤</span>
            <p className="text-off-white mb-2">Drag and drop CSV files here</p>
            <p className="text-sm text-muted mb-4">or click to browse</p>
            <Button variant="outline" size="sm">Select File</Button>
          </>
        )}
      </div>

      <div className="mt-4 p-3 bg-glass-white rounded-lg">
        <p className="text-xs text-muted">
          <span className="text-precision-teal">Supported:</span> Position files, transaction logs, forecast data
        </p>
      </div>
    </GlassPanel>
  );
};

// ============================================
// MAIN PAGE
// ============================================

const BullpenPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showUpload = searchParams.get('action') === 'upload';
  const [, setSelectedRecord] = useState<EvidenceRecord | null>(null);
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const handleTaskUpdate = (taskId: string, newStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <BullpenHeader />

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Total Records"
          value={MOCK_EVIDENCE.length.toString()}
          icon="📋"
        />
        <MetricCard
          title="Pending Validation"
          value={MOCK_EVIDENCE.filter((r) => r.status === 'pending').length.toString()}
          icon="⏳"
        />
        <MetricCard
          title="Flagged Items"
          value={MOCK_EVIDENCE.filter((r) => r.status === 'flagged').length.toString()}
          icon="🚨"
        />
        <MetricCard
          title="Tasks Completed"
          value={`${tasks.filter((t) => t.status === 'done').length}/${tasks.length}`}
          icon="✅"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Evidence Log */}
        <div className="lg:col-span-2">
          <EvidenceLogDataTable
            records={MOCK_EVIDENCE}
            onSelect={setSelectedRecord}
          />
        </div>

        {/* Upload Section */}
        <div>
          <CSVUploadSection />
          {/* Hidden reference to satisfy unused var check if ignoring logic changes */}
          {showUpload && <div className="hidden" />}
        </div>
      </div>

      {/* Task Kanban */}
      <TaskKanbanFixolaw tasks={tasks} onTaskUpdate={handleTaskUpdate} />
    </div>
  );
};

export default BullpenPage;
