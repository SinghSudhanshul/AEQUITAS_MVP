// ============================================
// INPUT COMPONENT
// Power Suit Design System
// ============================================

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// ============================================
// VARIANTS
// ============================================

const inputVariants = cva(
  // Base styles
  [
    'flex w-full',
    'bg-surface text-off-white placeholder:text-muted',
    'border border-glass-border rounded-lg',
    'transition-all duration-200',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-precision-teal focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-surface',
          'border-glass-border',
          'focus:border-precision-teal',
        ].join(' '),

        glass: [
          'bg-glass-white backdrop-blur-md',
          'border-glass-border',
          'focus:border-precision-teal',
        ].join(' '),

        filled: [
          'bg-rich-black',
          'border-transparent',
          'focus:border-precision-teal focus:bg-surface',
        ].join(' '),

        underline: [
          'bg-transparent',
          'border-0 border-b-2 border-glass-border rounded-none',
          'focus:border-precision-teal',
          'px-0',
        ].join(' '),

        error: [
          'bg-surface',
          'border-crisis-red text-crisis-red',
          'focus:border-crisis-red focus:ring-crisis-red',
        ].join(' '),

        success: [
          'bg-surface',
          'border-precision-teal',
        ].join(' '),
      },

      inputSize: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
        xl: 'h-14 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

// ============================================
// TYPES
// ============================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  error?: string;
  hint?: string;
}

// ============================================
// COMPONENT
// ============================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      error,
      hint,
      disabled,
      ...props
    },
    ref
  ) => {
    // Determine variant based on error state
    const effectiveVariant = error ? 'error' : variant;

    // If there are addons or icons, wrap in a container
    const hasAddons = leftAddon || rightAddon;
    const hasIcons = leftIcon || rightIcon;

    if (hasAddons || hasIcons) {
      return (
        <div className="space-y-1">
          <div className={cn(
            'flex items-center',
            'rounded-lg overflow-hidden',
            'border border-glass-border',
            'focus-within:ring-2 focus-within:ring-precision-teal focus-within:ring-offset-2 focus-within:ring-offset-rich-black',
            error && 'border-crisis-red focus-within:ring-crisis-red',
            disabled && 'opacity-50 cursor-not-allowed',
          )}>
            {/* Left Addon */}
            {leftAddon && (
              <div className="flex items-center px-3 py-2 bg-rich-black border-r border-glass-border text-muted text-sm">
                {leftAddon}
              </div>
            )}

            {/* Left Icon */}
            {leftIcon && !leftAddon && (
              <div className="flex items-center pl-3 text-muted">
                {leftIcon}
              </div>
            )}

            {/* Input */}
            <input
              type={type}
              className={cn(
                'flex-1 w-full bg-surface text-off-white placeholder:text-muted',
                'border-0 focus:outline-none focus:ring-0',
                inputSize === 'sm' && 'h-8 px-3 text-xs',
                inputSize === 'lg' && 'h-12 px-4 text-base',
                inputSize === 'xl' && 'h-14 px-5 text-lg',
                (!inputSize || inputSize === 'default') && 'h-10 px-4 text-sm',
                leftIcon && !leftAddon && 'pl-2',
                rightIcon && !rightAddon && 'pr-2',
                className
              )}
              disabled={disabled}
              ref={ref}
              {...props}
            />

            {/* Right Icon */}
            {rightIcon && !rightAddon && (
              <div className="flex items-center pr-3 text-muted">
                {rightIcon}
              </div>
            )}

            {/* Right Addon */}
            {rightAddon && (
              <div className="flex items-center px-3 py-2 bg-rich-black border-l border-glass-border text-muted text-sm">
                {rightAddon}
              </div>
            )}
          </div>

          {/* Error/Hint Message */}
          {(error || hint) && (
            <p className={cn(
              'text-xs',
              error ? 'text-crisis-red' : 'text-muted'
            )}>
              {error || hint}
            </p>
          )}
        </div>
      );
    }

    // Simple input without addons
    return (
      <div className="space-y-1">
        <input
          type={type}
          className={cn(inputVariants({ variant: effectiveVariant, inputSize }), className)}
          disabled={disabled}
          ref={ref}
          {...props}
        />

        {/* Error/Hint Message */}
        {(error || hint) && (
          <p className={cn(
            'text-xs',
            error ? 'text-crisis-red' : 'text-muted'
          )}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================
// TEXTAREA COMPONENT
// ============================================

const textareaVariants = cva(
  // Base styles
  [
    'flex w-full min-h-[80px]',
    'bg-surface text-off-white placeholder:text-muted',
    'border border-glass-border rounded-lg',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-precision-teal focus-visible:ring-offset-2 focus-visible:ring-offset-rich-black',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-surface',
        glass: 'bg-glass-white backdrop-blur-md',
        filled: 'bg-rich-black border-transparent focus:border-precision-teal',
        error: 'border-crisis-red focus:ring-crisis-red',
      },
      textareaSize: {
        sm: 'p-2 text-xs min-h-[60px]',
        default: 'p-3 text-sm min-h-[80px]',
        lg: 'p-4 text-base min-h-[120px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'default',
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textareaVariants> {
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant,
      textareaSize,
      error,
      hint,
      maxLength,
      showCount,
      value,
      ...props
    },
    ref
  ) => {
    const effectiveVariant = error ? 'error' : variant;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="space-y-1">
        <textarea
          className={cn(textareaVariants({ variant: effectiveVariant, textareaSize }), className)}
          maxLength={maxLength}
          value={value}
          ref={ref}
          {...props}
        />

        <div className="flex justify-between">
          {/* Error/Hint Message */}
          {(error || hint) && (
            <p className={cn(
              'text-xs',
              error ? 'text-crisis-red' : 'text-muted'
            )}>
              {error || hint}
            </p>
          )}

          {/* Character Count */}
          {showCount && maxLength && (
            <p className={cn(
              'text-xs text-muted ml-auto',
              charCount >= maxLength && 'text-crisis-red'
            )}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================
// EXPORTS
// ============================================

export { Input, Textarea, inputVariants, textareaVariants };
export default Input;
