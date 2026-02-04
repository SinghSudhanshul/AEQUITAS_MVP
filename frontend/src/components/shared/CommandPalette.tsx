// ============================================
// COMMAND PALETTE COMPONENT
// Cmd+K Global Command Center
// ============================================

import * as React from 'react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { WINGS, WING_ORDER } from '@/config/wings';
import { useAuthStore } from '@/store/authStore';
import { useGamificationStore } from '@/store/gamification.store';
import { useCrisisStore } from '@/store/crisis.store';
import { useSoundEffects } from '@/hooks/ui/useSoundEffects';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { PersonaAvatar } from '@/components/shared/PersonaAvatar';

// ============================================
// TYPES
// ============================================

export interface CommandItem {
  id: string;
  type: 'navigation' | 'action' | 'search' | 'persona' | 'setting';
  icon: React.ReactNode;
  title: string;
  description?: string;
  shortcut?: string[];
  keywords?: string[];
  onSelect: () => void;
}

export interface CommandGroup {
  id: string;
  title: string;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

// ============================================
// KEYBOARD SHORTCUT DISPLAY
// ============================================

const Shortcut: React.FC<{ keys: string[] }> = ({ keys }) => (
  <div className="flex items-center gap-0.5">
    {keys.map((key, i) => (
      <kbd
        key={i}
        className="min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-mono bg-rich-black/50 text-muted rounded border border-glass-border"
      >
        {key}
      </kbd>
    ))}
  </div>
);

// ============================================
// COMMAND ITEM COMPONENT
// ============================================

interface CommandItemRowProps {
  item: CommandItem;
  isActive: boolean;
  onSelect: () => void;
}

const CommandItemRow: React.FC<CommandItemRowProps> = ({ item, isActive, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left',
      isActive
        ? 'bg-precision-teal/20 text-off-white'
        : 'text-muted hover:bg-glass-white hover:text-off-white'
    )}
  >
    <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-glass-white shrink-0">
      {item.icon}
    </span>
    <div className="flex-1 min-w-0">
      <p className="font-medium truncate">{item.title}</p>
      {item.description && (
        <p className="text-xs text-muted truncate">{item.description}</p>
      )}
    </div>
    {item.shortcut && <Shortcut keys={item.shortcut} />}
  </button>
);

// ============================================
// COMMAND GROUP COMPONENT
// ============================================

interface CommandGroupSectionProps {
  group: CommandGroup;
  activeIndex: number;
  startIndex: number;
  onSelect: (item: CommandItem) => void;
}

const CommandGroupSection: React.FC<CommandGroupSectionProps> = ({
  group,
  activeIndex,
  startIndex,
  onSelect,
}) => (
  <div className="mb-4 last:mb-0">
    <h3 className="px-3 py-1.5 text-xs font-semibold text-muted uppercase tracking-wider">
      {group.title}
    </h3>
    <div className="space-y-0.5">
      {group.items.map((item, i) => (
        <CommandItemRow
          key={item.id}
          item={item}
          isActive={activeIndex === startIndex + i}
          onSelect={() => onSelect(item)}
        />
      ))}
    </div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const { logout } = useAuthStore();
  const { toggleParanoiaMode, paranoiaMode } = useCrisisStore();
  const { rank } = useGamificationStore();

  // Build command groups
  const commandGroups: CommandGroup[] = useMemo(() => {
    const groups: CommandGroup[] = [];

    // Navigation - Wings
    groups.push({
      id: 'wings',
      title: 'Wings',
      items: WING_ORDER.map((wingId) => {
        const wing = WINGS[wingId];
        return {
          id: `nav-${wing.id}`,
          type: 'navigation' as const,
          icon: <span className="text-xl">{wing.icon}</span>,
          title: wing.name,
          description: wing.description,
          keywords: [
            wing.name,
            wing.shortName,
            wing.description,
            ...wing.features.map(f => f.name),
            ...wing.features.map(f => f.description)
          ],
          onSelect: () => {
            navigate(wing.path);
            onClose();
          },
        };
      })
        .filter(Boolean) as CommandItem[],
    });

    // Quick Actions
    groups.push({
      id: 'actions',
      title: 'Actions',
      items: [
        {
          id: 'action-crisis',
          type: 'action',
          icon: <span className="text-lg">{paranoiaMode ? '🛡️' : '🚨'}</span>,
          title: paranoiaMode ? 'Exit Crisis Mode' : 'Activate Crisis Mode',
          description: 'Toggle paranoia mode',
          shortcut: ['⌘', '⇧', 'P'],
          onSelect: () => {
            toggleParanoiaMode();
            onClose();
          },
        },
        {
          id: 'action-upload',
          type: 'action',
          icon: <span className="text-lg">📤</span>,
          title: 'Upload Positions CSV',
          description: 'Import position data',
          shortcut: ['⌘', 'U'],
          onSelect: () => {
            navigate('/app/wings/bullpen?action=upload');
            onClose();
          },
        },
        {
          id: 'action-forecast',
          type: 'action',
          icon: <span className="text-lg">📊</span>,
          title: 'View Forecasts',
          description: 'Daily liquidity forecasts',
          onSelect: () => {
            navigate('/app/wings/treasury');
            onClose();
          },
        },
      ],
    });

    // Persona Commands
    groups.push({
      id: 'personas',
      title: 'AI Assistants',
      items: [
        {
          id: 'persona-donna',
          type: 'persona',
          icon: <PersonaAvatar persona="donna" size="xs" />,
          title: 'Ask Donna',
          description: 'AI coordinator & assistant',
          shortcut: ['⌘', 'D'],
          onSelect: () => {
            navigate('/app/wings/donnas-desk');
            onClose();
          },
        },
        {
          id: 'persona-harvey',
          type: 'persona',
          icon: <PersonaAvatar persona="harvey" size="xs" />,
          title: 'Consult Harvey',
          description: 'Strategic advisor',
          shortcut: ['⌘', 'H'],
          onSelect: () => {
            navigate('/app/wings/harveys-office');
            onClose();
          },
        },
      ],
    });

    // Settings
    groups.push({
      id: 'settings',
      title: 'Settings',
      items: [
        {
          id: 'setting-profile',
          type: 'setting',
          icon: <span className="text-lg">👤</span>,
          title: 'Profile Settings',
          onSelect: () => {
            navigate('/app/settings/profile');
            onClose();
          },
        },
        {
          id: 'setting-appearance',
          type: 'setting',
          icon: <span className="text-lg">🎨</span>,
          title: 'Appearance',
          onSelect: () => {
            navigate('/app/settings/appearance');
            onClose();
          },
        },
        {
          id: 'setting-notifications',
          type: 'setting',
          icon: <span className="text-lg">🔔</span>,
          title: 'Notifications',
          onSelect: () => {
            navigate('/app/settings/notifications');
            onClose();
          },
        },
        {
          id: 'setting-logout',
          type: 'setting',
          icon: <span className="text-lg">🚪</span>,
          title: 'Sign Out',
          onSelect: () => {
            logout();
            navigate('/login');
            onClose();
          },
        },
      ],
    });

    return groups;
  }, [navigate, onClose, toggleParanoiaMode, paranoiaMode, logout]);

  // Filter groups based on query
  const filteredGroups = useMemo(() => {
    if (!query.trim()) return commandGroups;

    const lowerQuery = query.toLowerCase();

    return commandGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const searchText = [
            item.title,
            item.description || '',
            ...(item.keywords || []),
          ].join(' ').toLowerCase();

          return searchText.includes(lowerQuery);
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [commandGroups, query]);

  // Get all flat items for keyboard navigation
  const allItems = useMemo(() =>
    filteredGroups.flatMap((g) => g.items),
    [filteredGroups]
  );

  // Reset active index when filtered items change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % allItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[activeIndex]) {
          playSound('click');
          allItems[activeIndex].onSelect();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [allItems, activeIndex, onClose, playSound]);

  // Handle item selection
  const handleSelectItem = useCallback((item: CommandItem) => {
    playSound('click');
    item.onSelect();
  }, [playSound]);

  if (!isOpen) return null;

  // Calculate start indices for each group
  let currentIndex = 0;
  const groupStartIndices = filteredGroups.map((group) => {
    const startIndex = currentIndex;
    currentIndex += group.items.length;
    return startIndex;
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div
        className={cn(
          'fixed top-[15%] left-1/2 -translate-x-1/2 z-50',
          'w-full max-w-xl',
          'animate-in fade-in slide-in-from-top-4 duration-200',
          className
        )}
      >
        <GlassPanel variant="heavy" padding="none" className="shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border">
            <svg className="w-5 h-5 text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-off-white placeholder:text-muted focus:outline-none"
            />
            <Shortcut keys={['ESC']} />
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredGroups.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted">No results found</p>
                <p className="text-xs text-muted mt-1">Try a different search term</p>
              </div>
            ) : (
              filteredGroups.map((group, groupIndex) => (
                <CommandGroupSection
                  key={group.id}
                  group={group}
                  activeIndex={activeIndex}
                  startIndex={groupStartIndices[groupIndex]}
                  onSelect={handleSelectItem}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-glass-border bg-rich-black/50">
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Shortcut keys={['↑', '↓']} />
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <Shortcut keys={['↵']} />
                <span>Select</span>
              </span>
            </div>
            <p className="text-xs text-muted">
              <span className="text-precision-teal">{rank}</span> • Aequitas
            </p>
          </div>
        </GlassPanel>
      </div>
    </>
  );
};

// ============================================
// COMMAND PALETTE HOOK
// ============================================

export function useCommandPalette(): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
} {
  const [isOpen, setIsOpen] = useState(false);

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  };
}

// ============================================
// EXPORTS
// ============================================

export default CommandPalette;
