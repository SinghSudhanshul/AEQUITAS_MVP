'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, User, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { KanbanTask, KanbanColumn } from '@/types/wings/bullpen';

interface TaskKanbanFixolawProps {
  tasks?: KanbanTask[];
  onTaskMove?: (taskId: string, newStatus: string) => void;
  onTaskClick?: (task: KanbanTask) => void;
  className?: string;
}

const mockTasks: KanbanTask[] = [
  { id: '1', title: 'Review position data', description: 'Goldman Sachs Q4', status: 'todo', priority: 'high', labels: ['urgent'], xpReward: 50, createdAt: '', updatedAt: '' },
  { id: '2', title: 'Validate forecast accuracy', description: 'Weekly check', status: 'in_progress', priority: 'medium', labels: ['forecast'], xpReward: 30, createdAt: '', updatedAt: '' },
  { id: '3', title: 'Update margin thresholds', description: 'Per risk committee', status: 'todo', priority: 'low', labels: ['config'], xpReward: 20, createdAt: '', updatedAt: '' },
  { id: '4', title: 'Generate monthly report', description: 'For stakeholders', status: 'review', priority: 'medium', labels: ['reporting'], xpReward: 40, createdAt: '', updatedAt: '' },
  { id: '5', title: 'Archive old positions', description: 'Q2 data', status: 'done', priority: 'low', labels: ['cleanup'], xpReward: 15, createdAt: '', updatedAt: '' },
];

const columns: { id: string; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'border-slate-500' },
  { id: 'todo', title: 'To Do', color: 'border-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500' },
  { id: 'review', title: 'Review', color: 'border-purple-500' },
  { id: 'done', title: 'Done', color: 'border-emerald-500' },
];

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-slate-500',
};

export const TaskKanbanFixolaw = React.memo(function TaskKanbanFixolaw({ tasks = mockTasks, onTaskMove, onTaskClick, className }: TaskKanbanFixolawProps) {
  const [draggedTask, setDraggedTask] = React.useState<string | null>(null);

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragEnd = () => setDraggedTask(null);
  const handleDrop = (columnId: string) => {
    if (draggedTask) {
      onTaskMove?.(draggedTask, columnId);
      setDraggedTask(null);
    }
  };

  const getTasksByColumn = (columnId: string) => tasks.filter(t => t.status === columnId);

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Task Board</h3>
          <p className="text-sm text-slate-400">Drag and drop to update status</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Add Task</Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-72" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(column.id)}>
            <div className={cn('rounded-t-lg border-t-2 bg-navy-900/50 p-3', column.color)}>
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{column.title}</h4>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-400">{getTasksByColumn(column.id).length}</span>
              </div>
            </div>
            <div className="min-h-[400px] space-y-2 rounded-b-lg border border-white/10 bg-navy-900/30 p-2">
              {getTasksByColumn(column.id).map(task => (
                <motion.div key={task.id} layoutId={task.id} draggable onDragStart={() => handleDragStart(task.id)} onDragEnd={handleDragEnd} whileHover={{ scale: 1.02 }} className={cn('rounded-lg border border-white/10 bg-navy-800/50 p-3 cursor-grab', draggedTask === task.id && 'opacity-50')} onClick={() => onTaskClick?.(task)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className={cn('h-2 w-2 rounded-full', priorityColors[task.priority])} />
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="font-medium text-white text-sm">{task.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-1">
                      {task.labels.map(label => (
                        <span key={label} className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-300">{label}</span>
                      ))}
                    </div>
                    <span className="text-xs text-emerald-400">+{task.xpReward} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TaskKanbanFixolaw;
