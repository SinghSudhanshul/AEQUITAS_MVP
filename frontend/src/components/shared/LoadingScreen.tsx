// ============================================
// LOADING SCREEN
// Full-page loading component with branding
// ============================================

import React from 'react';
import { cn } from '@/lib/utils';
import { QUOTES } from '@/config/narrative';

interface LoadingScreenProps {
  message?: string;
  showQuote?: boolean;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showQuote = true,
  className,
}) => {
  // Random quote
  const quote = showQuote ? getRandomQuote() : null;

  return (
    <div className={cn(
      'fixed inset-0 bg-rich-black flex flex-col items-center justify-center z-50',
      className
    )}>
      {/* Logo */}
      <div className="mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-precision-teal to-institutional-blue flex items-center justify-center">
          <span className="text-4xl font-bold text-rich-black">A</span>
        </div>
      </div>

      {/* Spinner */}
      <div className="relative w-16 h-16 mb-8">
        {/* Outer ring */}
        <div className="absolute inset-0 border-4 border-glass-border rounded-full" />

        {/* Spinning ring */}
        <div className="absolute inset-0 border-4 border-transparent border-t-precision-teal rounded-full animate-spin" />

        {/* Inner dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-precision-teal rounded-full animate-pulse" />
        </div>
      </div>

      {/* Message */}
      <p className="text-off-white font-medium mb-2">{message}</p>

      {/* Progress dots */}
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-precision-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>

      {/* Quote */}
      {quote && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 max-w-md text-center px-6">
          <p className="text-sm text-muted italic mb-2">"{quote.text}"</p>
          <p className="text-xs text-precision-teal">— {quote.author}</p>
        </div>
      )}
    </div>
  );
};

// ============================================
// HELPER
// ============================================

function getRandomQuote(): { text: string; author: string } {
  const quotes = [
    { text: QUOTES.HARVEY.MOTIVATION, author: 'Harvey Specter' },
    { text: QUOTES.HARVEY.WORK_ETHIC, author: 'Harvey Specter' },
    { text: QUOTES.DONNA.PROACTIVE, author: 'Donna Paulsen' },
    { text: QUOTES.DONNA.ANTICIPATION, author: 'Donna Paulsen' },
  ];

  return quotes[Math.floor(Math.random() * quotes.length)];
}

// ============================================
// SKELETON LOADERS
// ============================================

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    'animate-pulse bg-glass-white rounded',
    className
  )} />
);

export const SkeletonText: React.FC<SkeletonProps & { lines?: number }> = ({
  className,
  lines = 3,
}) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          'h-4',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    'p-4 bg-glass-white border border-glass-border rounded-xl',
    className
  )}>
    <Skeleton className="h-6 w-1/3 mb-4" />
    <SkeletonText lines={2} />
    <Skeleton className="h-10 w-full mt-4" />
  </div>
);

export const SkeletonMetricCard: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn(
    'p-4 bg-glass-white border border-glass-border rounded-xl',
    className
  )}>
    <Skeleton className="h-4 w-1/2 mb-3" />
    <Skeleton className="h-8 w-2/3 mb-2" />
    <Skeleton className="h-3 w-1/3" />
  </div>
);

export const SkeletonAvatar: React.FC<SkeletonProps & { size?: 'sm' | 'md' | 'lg' }> = ({
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  );
};

export const SkeletonTable: React.FC<SkeletonProps & { rows?: number }> = ({
  className,
  rows = 5,
}) => (
  <div className={cn('space-y-2', className)}>
    {/* Header */}
    <div className="flex gap-4 p-3 bg-rich-black/30 rounded-lg">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/5" />
      <Skeleton className="h-4 w-1/6" />
    </div>

    {/* Rows */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-3 bg-glass-white rounded-lg items-center">
        <SkeletonAvatar size="sm" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/5" />
      </div>
    ))}
  </div>
);

// ============================================
// EXPORTS
// ============================================

export default LoadingScreen;
