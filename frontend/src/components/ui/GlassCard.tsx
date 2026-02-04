// ============================================
// GLASS CARD COMPONENT
// Glassmorphism Card with Power Suit Aesthetic
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 lg:p-6',
    lg: 'p-6 lg:p-8',
  };

  const variantClasses = {
    default: 'glass-card',
    elevated: 'glass-card shadow-elevated',
    interactive: 'glass-card hover-lift cursor-pointer hover:border-institutional-blue/50',
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card Header component
interface GlassCardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const GlassCardHeader: React.FC<GlassCardHeaderProps> = ({
  title,
  subtitle,
  action,
  icon,
  className,
}) => (
  <div className={cn('flex items-start justify-between mb-4', className)}>
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-institutional-blue/20 flex items-center justify-center text-institutional-blue">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-h4 font-semibold text-off-white">{title}</h3>
        {subtitle && <p className="text-caption text-muted mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
);

// Card Footer component
interface GlassCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCardFooter: React.FC<GlassCardFooterProps> = ({
  children,
  className,
}) => (
  <div className={cn(
    'mt-4 pt-4 border-t border-glass-border flex items-center justify-between',
    className
  )}>
    {children}
  </div>
);
