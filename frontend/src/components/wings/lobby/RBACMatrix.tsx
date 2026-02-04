'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, X, Eye, Edit2, Users, Settings, FileText, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { RBACRole, RBACPermission } from '@/types/wings/lobby';

interface RBACMatrixProps {
  roles?: RBACRole[];
  onPermissionChange?: (roleId: string, permission: RBACPermission) => void;
  editable?: boolean;
  className?: string;
}

const defaultRoles: RBACRole[] = [
  {
    roleId: 'admin', name: 'Admin', description: 'Full access', permissions: [
      { resource: 'forecasts', action: 'read', effect: 'allow' },
      { resource: 'forecasts', action: 'create', effect: 'allow' },
      { resource: 'forecasts', action: 'delete', effect: 'allow' },
      { resource: 'users', action: 'read', effect: 'allow' },
      { resource: 'users', action: 'update', effect: 'allow' },
      { resource: 'settings', action: 'update', effect: 'allow' },
    ]
  },
  {
    roleId: 'manager', name: 'Manager', description: 'Team management', permissions: [
      { resource: 'forecasts', action: 'read', effect: 'allow' },
      { resource: 'forecasts', action: 'create', effect: 'allow' },
      { resource: 'users', action: 'read', effect: 'allow' },
    ]
  },
  {
    roleId: 'analyst', name: 'Analyst', description: 'View and analyze', permissions: [
      { resource: 'forecasts', action: 'read', effect: 'allow' },
    ]
  },
  {
    roleId: 'viewer', name: 'Viewer', description: 'Read-only access', permissions: [
      { resource: 'forecasts', action: 'read', effect: 'allow' },
    ]
  },
];

const resources = ['forecasts', 'users', 'settings', 'audit'];
const actions = ['read', 'create', 'update', 'delete'];
const resourceIcons: Record<string, React.ReactNode> = {
  forecasts: <FileText className="h-4 w-4" />,
  users: <Users className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
  audit: <Database className="h-4 w-4" />,
};

export const RBACMatrix = React.memo(function RBACMatrix({ roles = defaultRoles, onPermissionChange, editable = false, className }: RBACMatrixProps) {
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const hasPermission = (role: RBACRole, resource: string, action: string) => {
    return role.permissions.some(p => p.resource === resource && p.action === action && p.effect === 'allow');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Access Control Matrix</h3>
            <p className="text-sm text-slate-400">Role-based permissions</p>
          </div>
        </div>
        {editable && <Button variant="outline" size="sm"><Edit2 className="h-4 w-4 mr-1" />Edit Roles</Button>}
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-navy-900/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-navy-800/50">
              <th className="p-4 text-left text-sm font-medium text-slate-400">Resource</th>
              {roles.map(role => (
                <th key={role.roleId} className="p-4 text-center">
                  <button onClick={() => setSelectedRole(role.roleId === selectedRole ? null : role.roleId)} className={cn('text-sm font-medium transition-colors', selectedRole === role.roleId ? 'text-amber-400' : 'text-white hover:text-amber-400')}>
                    {role.name}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {resources.map(resource => (
              <React.Fragment key={resource}>
                <tr className="border-b border-white/5 bg-white/5">
                  <td colSpan={roles.length + 1} className="p-2 px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                      {resourceIcons[resource]}
                      <span className="capitalize">{resource}</span>
                    </div>
                  </td>
                </tr>
                {actions.map(action => (
                  <tr key={`${resource}-${action}`} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pl-8 pr-4 text-sm text-slate-400 capitalize">{action}</td>
                    {roles.map(role => {
                      const allowed = hasPermission(role, resource, action);
                      return (
                        <td key={role.roleId} className="p-2 text-center">
                          <motion.div whileHover={{ scale: 1.1 }} className={cn('mx-auto flex h-8 w-8 items-center justify-center rounded-full', allowed ? 'bg-emerald-500/20' : 'bg-red-500/10')}>
                            {allowed ? <Check className="h-4 w-4 text-emerald-400" /> : <X className="h-4 w-4 text-red-400/50" />}
                          </motion.div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRole && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <h4 className="font-medium text-white">{roles.find(r => r.roleId === selectedRole)?.name}</h4>
          <p className="text-sm text-slate-400">{roles.find(r => r.roleId === selectedRole)?.description}</p>
        </motion.div>
      )}
    </div>
  );
});

export default RBACMatrix;
