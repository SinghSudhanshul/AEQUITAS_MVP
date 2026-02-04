#!/usr/bin/env ts-node
/**
 * ============================================
 * AEQUITAS LV-COP COMPONENT GENERATOR
 * Scaffolding Tool for New Components
 * ============================================
 * 
 * Generates new components following the Power Suit design system
 * with proper TypeScript interfaces, Zustand integration, and
 * gamification hooks.
 * 
 * Usage: npx ts-node scripts/generate-components.ts <type> <name> [--wing=<wing>]
 * 
 * Types:
 *   - wing-feature: A feature component for a specific wing
 *   - ui: A base UI component
 *   - page: A page component
 *   - hook: A custom hook
 *   - service: An API service
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION
// ============================================

type ComponentType = 'wing-feature' | 'ui' | 'page' | 'hook' | 'service';

const WINGS = [
  'lobby',
  'bullpen',
  'library',
  'treasury',
  'situation-room',
  'war-room',
  'donnas-desk',
  'harveys-office',
  'vault',
] as const;

type Wing = typeof WINGS[number];

// ============================================
// TEMPLATES
// ============================================

function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

const templates = {
  'wing-feature': (name: string, wing: Wing) => `// ============================================
// ${name.toUpperCase()} COMPONENT
// Wing: ${toPascalCase(wing)}
// ============================================

import React, { useState, useCallback, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';
import { useGamificationStore } from '@/store/gamification.store';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QUOTES, PERSONAS } from '@/config/narrative';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ${name}Props {
  className?: string;
  /** Enable interactive mode with XP tracking */
  interactive?: boolean;
  /** Callback when action is completed */
  onComplete?: (data: ${name}Data) => void;
  /** Callback when action fails */
  onError?: (error: Error) => void;
}

export interface ${name}Data {
  id: string;
  timestamp: Date;
  status: 'pending' | 'active' | 'completed' | 'error';
  metadata?: Record<string, unknown>;
}

interface ${name}State {
  isLoading: boolean;
  isExpanded: boolean;
  data: ${name}Data | null;
  error: Error | null;
}

// ============================================
// CONSTANTS
// ============================================

const XP_REWARD = 25;
const ACHIEVEMENT_ID = '${toKebabCase(name)}-master';

// ============================================
// COMPONENT
// ============================================

/**
 * ${name}
 * 
 * Part of the ${toPascalCase(wing)} wing.
 * Features XP tracking and Harvey/Donna notifications.
 */
export const ${name} = memo<${name}Props>(({
  className,
  interactive = true,
  onComplete,
  onError,
}) => {
  // ============================================
  // STATE & HOOKS
  // ============================================
  
  const [state, setState] = useState<${name}State>({
    isLoading: false,
    isExpanded: false,
    data: null,
    error: null,
  });
  
  const { addXP, unlockAchievement } = useGamificationStore();
  const { playSound } = useSoundEffects();
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const handleAction = useCallback(async () => {
    if (!interactive) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    playSound('keyboard_click');
    
    try {
      // Simulate API call or action
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data: ${name}Data = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        status: 'completed',
      };
      
      setState(prev => ({ ...prev, isLoading: false, data }));
      
      // Award XP
      addXP(XP_REWARD, '${toKebabCase(name)}');
      playSound('success_chord');
      
      // Check for achievement
      unlockAchievement(ACHIEVEMENT_ID);
      
      onComplete?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState(prev => ({ ...prev, isLoading: false, error: err }));
      onError?.(err);
    }
  }, [interactive, addXP, unlockAchievement, playSound, onComplete, onError]);
  
  const handleToggleExpand = useCallback(() => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
    playSound('paper_rustle');
  }, [playSound]);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  const statusColor = useMemo(() => {
    switch (state.data?.status) {
      case 'completed': return 'text-precision-teal';
      case 'error': return 'text-crisis-red';
      case 'active': return 'text-achievement-gold';
      default: return 'text-muted';
    }
  }, [state.data?.status]);
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <Card 
      className={cn(
        // Glassmorphism base
        'bg-glass-white backdrop-blur-md border-glass-border',
        'shadow-lg hover:shadow-xl transition-all duration-300',
        // Power Suit aesthetic
        'hover:border-precision-teal/30',
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold text-off-white">
            ${name.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <span className={cn('text-sm font-mono', statusColor)}>
            {state.data?.status?.toUpperCase() || 'READY'}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Content Area */}
        <div className={cn(
          'rounded-lg bg-surface/50 p-4 transition-all duration-300',
          state.isExpanded && 'ring-1 ring-precision-teal/30'
        )}>
          {state.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-precision-teal" />
            </div>
          ) : state.error ? (
            <div className="text-crisis-red text-sm">
              <p className="font-medium">Error</p>
              <p className="text-xs mt-1 opacity-80">{state.error.message}</p>
            </div>
          ) : state.data ? (
            <div className="space-y-2">
              <p className="text-sm text-off-white">
                Action completed successfully.
              </p>
              <p className="text-xs text-muted font-mono">
                ID: {state.data.id.slice(0, 8)}...
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">
              Ready to execute. Click the button below to proceed.
            </p>
          )}
        </div>
        
        {/* Expandable Details */}
        {state.isExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-200">
            <div className="rounded-lg bg-surface/30 p-3 text-xs text-muted font-mono">
              <pre>{JSON.stringify(state.data, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        <Button
          onClick={handleAction}
          disabled={state.isLoading}
          className="flex-1"
          variant="default"
        >
          {state.isLoading ? 'Processing...' : 'Execute'}
        </Button>
        
        {state.data && (
          <Button
            onClick={handleToggleExpand}
            variant="outline"
            size="sm"
          >
            {state.isExpanded ? 'Hide' : 'Details'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});

${name}.displayName = '${name}';

export default ${name};
`,

  'ui': (name: string) => `// ============================================
// ${name.toUpperCase()} UI COMPONENT
// shadcn/ui customized for Power Suit aesthetic
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// VARIANTS
// ============================================

const ${toCamelCase(name)}Variants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-institutional-blue text-off-white hover:bg-institutional-blue/90',
        outline: 'border border-glass-border bg-transparent hover:bg-glass-white',
        ghost: 'hover:bg-glass-white hover:text-off-white',
        glass: 'bg-glass-white backdrop-blur-md border border-glass-border',
        crisis: 'bg-crisis-red text-white hover:bg-crisis-red/90',
        premium: 'bg-gradient-to-r from-achievement-gold to-achievement-gold/80 text-rich-black',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface ${name}Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ${toCamelCase(name)}Variants> {
  asChild?: boolean;
}

// ============================================
// COMPONENT
// ============================================

const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(${toCamelCase(name)}Variants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

${name}.displayName = '${name}';

export { ${name}, ${toCamelCase(name)}Variants };
export default ${name};
`,

  'page': (name: string) => `// ============================================
// ${name.toUpperCase()} PAGE
// ============================================

import React, { useEffect } from 'react';
import { useDocumentTitle } from '@/hooks/ui/useDocumentTitle';
import { useGamificationStore } from '@/store/gamification.store';
import { XP_EVENTS } from '@/config/gamification';

// ============================================
// TYPES
// ============================================

export interface ${name}Props {
  // Add page-specific props here
}

// ============================================
// COMPONENT
// ============================================

const ${name}: React.FC<${name}Props> = () => {
  // Set document title
  useDocumentTitle('${name.replace(/Page$/, '')} | Aequitas LV-COP');
  
  const { addXP } = useGamificationStore();
  
  // Track page view for XP
  useEffect(() => {
    addXP(XP_EVENTS.VIEW_FORECAST, 'page-view-${toKebabCase(name)}');
  }, [addXP]);
  
  return (
    <div className="min-h-screen bg-rich-black text-off-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            ${name.replace(/Page$/, '').replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <p className="mt-2 text-muted">
            Page description goes here.
          </p>
        </header>
        
        {/* Page Content */}
        <main className="space-y-8">
          <section className="bg-glass-white backdrop-blur-md rounded-xl border border-glass-border p-6">
            <h2 className="text-xl font-semibold mb-4">Section Title</h2>
            <p className="text-muted">
              Section content goes here.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ${name};
`,

  'hook': (name: string) => `// ============================================
// ${name.toUpperCase()} HOOK
// ============================================

import { useState, useCallback, useEffect, useMemo } from 'react';

// ============================================
// TYPES
// ============================================

export interface Use${name.replace(/^use/, '')}Options {
  /** Enable automatic refresh */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Callback when data changes */
  onChange?: (data: ${name.replace(/^use/, '')}Data) => void;
}

export interface ${name.replace(/^use/, '')}Data {
  // Define your data structure here
  id: string;
  value: unknown;
  timestamp: Date;
}

export interface ${name.replace(/^use/, '')}State {
  data: ${name.replace(/^use/, '')}Data | null;
  isLoading: boolean;
  error: Error | null;
}

export interface ${name.replace(/^use/, '')}Actions {
  refresh: () => Promise<void>;
  reset: () => void;
  update: (data: Partial<${name.replace(/^use/, '')}Data>) => void;
}

export type ${name.replace(/^use/, '')}Return = ${name.replace(/^use/, '')}State & ${name.replace(/^use/, '')}Actions;

// ============================================
// HOOK
// ============================================

/**
 * ${name}
 * 
 * Description of what this hook does.
 * 
 * @param options - Hook configuration options
 * @returns State and actions for the hook
 * 
 * @example
 * \`\`\`tsx
 * const { data, isLoading, refresh } = ${name}({ autoRefresh: true });
 * \`\`\`
 */
export function ${name}(options: Use${name.replace(/^use/, '')}Options = {}): ${name.replace(/^use/, '')}Return {
  const {
    autoRefresh = false,
    refreshInterval = 30000,
    onChange,
  } = options;
  
  // ============================================
  // STATE
  // ============================================
  
  const [state, setState] = useState<${name.replace(/^use/, '')}State>({
    data: null,
    isLoading: false,
    error: null,
  });
  
  // ============================================
  // ACTIONS
  // ============================================
  
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Implement your data fetching logic here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newData: ${name.replace(/^use/, '')}Data = {
        id: crypto.randomUUID(),
        value: null,
        timestamp: new Date(),
      };
      
      setState(prev => ({ ...prev, data: newData, isLoading: false }));
      onChange?.(newData);
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      }));
    }
  }, [onChange]);
  
  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);
  
  const update = useCallback((updates: Partial<${name.replace(/^use/, '')}Data>) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, ...updates } : null,
    }));
  }, []);
  
  // ============================================
  // EFFECTS
  // ============================================
  
  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(refresh, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refresh]);
  
  // ============================================
  // RETURN
  // ============================================
  
  return useMemo(() => ({
    ...state,
    refresh,
    reset,
    update,
  }), [state, refresh, reset, update]);
}

export default ${name};
`,

  'service': (name: string) => `// ============================================
// ${name.toUpperCase()} SERVICE
// API Service Layer
// ============================================

import { apiClient } from '@/services/api/client';
import type { ApiResponse } from '@/types/api';

// ============================================
// TYPES
// ============================================

export interface ${name.replace(/Service$/, '')}Request {
  // Define request payload
  id?: string;
  filters?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
  };
}

export interface ${name.replace(/Service$/, '')}Response {
  // Define response structure
  data: ${name.replace(/Service$/, '')}Item[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface ${name.replace(/Service$/, '')}Item {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Add item-specific fields
}

export interface Create${name.replace(/Service$/, '')}Request {
  // Define creation payload
  name: string;
  metadata?: Record<string, unknown>;
}

export interface Update${name.replace(/Service$/, '')}Request {
  id: string;
  updates: Partial<Omit<${name.replace(/Service$/, '')}Item, 'id' | 'createdAt' | 'updatedAt'>>;
}

// ============================================
// SERVICE ENDPOINTS
// ============================================

const ENDPOINTS = {
  LIST: '/api/v1/${toKebabCase(name.replace(/Service$/, ''))}',
  GET: (id: string) => \`/api/v1/${toKebabCase(name.replace(/Service$/, ''))}/\${id}\`,
  CREATE: '/api/v1/${toKebabCase(name.replace(/Service$/, ''))}',
  UPDATE: (id: string) => \`/api/v1/${toKebabCase(name.replace(/Service$/, ''))}/\${id}\`,
  DELETE: (id: string) => \`/api/v1/${toKebabCase(name.replace(/Service$/, ''))}/\${id}\`,
};

// ============================================
// SERVICE CLASS
// ============================================

class ${name} {
  /**
   * Fetch list of items with optional filtering and pagination
   */
  async list(request: ${name.replace(/Service$/, '')}Request = {}): Promise<ApiResponse<${name.replace(/Service$/, '')}Response>> {
    const { filters, pagination } = request;
    
    const params = new URLSearchParams();
    
    if (pagination) {
      params.set('page', String(pagination.page));
      params.set('limit', String(pagination.limit));
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    
    const response = await apiClient.get<${name.replace(/Service$/, '')}Response>(
      \`\${ENDPOINTS.LIST}?\${params.toString()}\`
    );
    
    return response;
  }
  
  /**
   * Fetch a single item by ID
   */
  async get(id: string): Promise<ApiResponse<${name.replace(/Service$/, '')}Item>> {
    const response = await apiClient.get<${name.replace(/Service$/, '')}Item>(
      ENDPOINTS.GET(id)
    );
    
    return response;
  }
  
  /**
   * Create a new item
   */
  async create(data: Create${name.replace(/Service$/, '')}Request): Promise<ApiResponse<${name.replace(/Service$/, '')}Item>> {
    const response = await apiClient.post<${name.replace(/Service$/, '')}Item>(
      ENDPOINTS.CREATE,
      data
    );
    
    return response;
  }
  
  /**
   * Update an existing item
   */
  async update(request: Update${name.replace(/Service$/, '')}Request): Promise<ApiResponse<${name.replace(/Service$/, '')}Item>> {
    const { id, updates } = request;
    
    const response = await apiClient.put<${name.replace(/Service$/, '')}Item>(
      ENDPOINTS.UPDATE(id),
      updates
    );
    
    return response;
  }
  
  /**
   * Delete an item by ID
   */
  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await apiClient.delete<{ success: boolean }>(
      ENDPOINTS.DELETE(id)
    );
    
    return response;
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const ${toCamelCase(name)} = new ${name}();
export default ${toCamelCase(name)};
`,
};

// ============================================
// GENERATOR FUNCTIONS
// ============================================

function getOutputPath(type: ComponentType, name: string, wing?: Wing): string {
  const basePath = path.resolve(__dirname, '..', 'src');

  switch (type) {
    case 'wing-feature':
      if (!wing) throw new Error('Wing is required for wing-feature type');
      return path.join(basePath, 'components', 'wings', wing, `${name}.tsx`);
    case 'ui':
      return path.join(basePath, 'components', 'ui', `${toKebabCase(name)}.tsx`);
    case 'page':
      return path.join(basePath, 'pages', `${name}.tsx`);
    case 'hook':
      return path.join(basePath, 'hooks', `${name}.ts`);
    case 'service':
      return path.join(basePath, 'services', `${toKebabCase(name)}.ts`);
    default:
      throw new Error(`Unknown component type: ${type}`);
  }
}

function generateComponent(type: ComponentType, name: string, wing?: Wing): void {
  console.log(`\n🎭 AEQUITAS Component Generator\n`);

  // Validate
  if (type === 'wing-feature' && (!wing || !WINGS.includes(wing))) {
    console.error(`❌ Invalid wing. Must be one of: ${WINGS.join(', ')}`);
    process.exit(1);
  }

  // Get template
  const template = type === 'wing-feature'
    ? templates[type](name, wing!)
    : templates[type](name);

  // Get output path
  const outputPath = getOutputPath(type, name, wing);

  // Check if file exists
  if (fs.existsSync(outputPath)) {
    console.error(`❌ File already exists: ${outputPath}`);
    process.exit(1);
  }

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(outputPath, template);

  console.log(`✓ Generated ${type}: ${name}`);
  console.log(`  Path: ${outputPath}`);

  if (wing) {
    console.log(`  Wing: ${wing}`);
  }

  console.log(`\n📝 Next steps:`);
  console.log(`   1. Open ${outputPath}`);
  console.log(`   2. Customize the component logic`);
  console.log(`   3. Add to exports if needed`);
  console.log();
}

// ============================================
// CLI
// ============================================

function printUsage(): void {
  console.log(`
🎭 AEQUITAS Component Generator

Usage: npx ts-node scripts/generate-components.ts <type> <name> [--wing=<wing>]

Types:
  wing-feature  A feature component for a specific wing (requires --wing)
  ui            A base UI component
  page          A page component
  hook          A custom hook
  service       An API service

Wings (for wing-feature):
  ${WINGS.join(', ')}

Examples:
  npx ts-node scripts/generate-components.ts wing-feature VaultLockdown --wing=vault
  npx ts-node scripts/generate-components.ts ui GlassPanel
  npx ts-node scripts/generate-components.ts hook useMarketRegime
  npx ts-node scripts/generate-components.ts service AnalyticsService
`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  const type = args[0] as ComponentType;
  const name = args[1];

  // Parse wing argument
  let wing: Wing | undefined;
  const wingArg = args.find(arg => arg.startsWith('--wing='));
  if (wingArg) {
    wing = wingArg.split('=')[1] as Wing;
  }

  // Validate type
  const validTypes: ComponentType[] = ['wing-feature', 'ui', 'page', 'hook', 'service'];
  if (!validTypes.includes(type)) {
    console.error(`❌ Invalid type: ${type}`);
    console.error(`   Valid types: ${validTypes.join(', ')}`);
    process.exit(1);
  }

  generateComponent(type, name, wing);
}

main();
