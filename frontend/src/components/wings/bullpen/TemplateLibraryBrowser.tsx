'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Folder, File, ChevronRight, ChevronDown, Plus, Search, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { TemplateFolder, TemplateFile } from '@/types/wings/bullpen';

interface TemplateLibraryBrowserProps {
  templates?: TemplateFolder[];
  onSelectTemplate?: (template: TemplateFile) => void;
  className?: string;
}

const mockTemplates: TemplateFolder[] = [
  {
    id: 'reports',
    name: 'Reports',
    templates: [
      { id: 'monthly', name: 'Monthly Summary', description: 'Standard monthly report template', category: 'report', lastUsed: new Date().toISOString(), usageCount: 45, createdBy: 'Harvey Specter' },
      { id: 'quarterly', name: 'Quarterly Review', description: 'Quarterly performance review', category: 'report', lastUsed: new Date().toISOString(), usageCount: 12, createdBy: 'Harvey Specter' },
    ],
    subfolders: [],
  },
  {
    id: 'compliance',
    name: 'Compliance',
    templates: [
      { id: 'audit', name: 'Audit Trail Export', description: 'Export audit logs for compliance', category: 'audit', lastUsed: new Date().toISOString(), usageCount: 28, createdBy: 'Donna Paulsen' },
    ],
    subfolders: [],
  },
  {
    id: 'forecasts',
    name: 'Forecasts',
    templates: [
      { id: 'daily-forecast', name: 'Daily Forecast Report', description: 'Daily liquidity forecast summary', category: 'forecast', lastUsed: new Date().toISOString(), usageCount: 156, createdBy: 'System' },
    ],
    subfolders: [],
  },
];

interface FolderNodeProps {
  folder: TemplateFolder;
  level: number;
  onSelect: (template: TemplateFile) => void;
}

const FolderNode = React.memo(function FolderNode({ folder, level, onSelect }: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/5 text-left"
        style={{ paddingLeft: level * 12 + 8 }}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
        <Folder className="h-4 w-4 text-amber-400" />
        <span className="font-medium text-white">{folder.name}</span>
        <span className="text-xs text-slate-500 ml-auto">{folder.templates.length}</span>
      </button>

      {isExpanded && (
        <div className="ml-4">
          {folder.templates.map(template => (
            <motion.button
              key={template.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(template)}
              className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/5 text-left"
              style={{ paddingLeft: (level + 1) * 12 + 8 }}
            >
              <File className="h-4 w-4 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300 truncate">{template.name}</p>
                <p className="text-xs text-slate-500 truncate">{template.description}</p>
              </div>
              <span className="text-xs text-slate-500">{template.usageCount} uses</span>
            </motion.button>
          ))}
          {folder.subfolders?.map(sub => (
            <FolderNode key={sub.id} folder={sub} level={level + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
});

export const TemplateLibraryBrowser = React.memo(function TemplateLibraryBrowser({ templates = mockTemplates, onSelectTemplate, className }: TemplateLibraryBrowserProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateFile | null>(null);

  const handleSelect = (template: TemplateFile) => {
    setSelectedTemplate(template);
    onSelectTemplate?.(template);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Folder className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Template Library</h3>
            <p className="text-sm text-slate-400">Reusable document templates</p>
          </div>
        </div>
        <Button size="sm"><Plus className="mr-2 h-4 w-4" />New Template</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search templates..." className="pl-10" />
      </div>

      <div className="rounded-xl border border-white/10 bg-navy-900/50 p-2 max-h-[400px] overflow-y-auto">
        {templates.map(folder => (
          <FolderNode key={folder.id} folder={folder} level={0} onSelect={handleSelect} />
        ))}
      </div>

      {selectedTemplate && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-white">{selectedTemplate.name}</h4>
              <p className="text-sm text-slate-400">{selectedTemplate.description}</p>
              <p className="text-xs text-slate-500 mt-1">Created by {selectedTemplate.createdBy}</p>
            </div>
            <Button size="sm">Use Template</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
});

export default TemplateLibraryBrowser;
