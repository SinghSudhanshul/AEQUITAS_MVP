// ============================================
// CN UTILITY
// Class Name Merge Helper (Tailwind-merge + clsx)
// ============================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names intelligently using clsx and tailwind-merge
 * 
 * @param inputs - Class values to merge (strings, arrays, objects, etc.)
 * @returns Merged class string with Tailwind conflicts resolved
 * 
 * @example
 * ```tsx
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500'
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Create a variant class name generator
 * 
 * @param baseClasses - Base classes always applied
 * @param variantMap - Map of variant names to class strings
 * @returns Function that generates classes based on variant
 * 
 * @example
 * ```tsx
 * const buttonClasses = createVariantClasses(
 *   'px-4 py-2 rounded font-medium',
 *   {
 *     primary: 'bg-primary text-white',
 *     secondary: 'bg-surface text-off-white border',
 *   }
 * );
 * 
 * buttonClasses('primary') // 'px-4 py-2 rounded font-medium bg-primary text-white'
 * ```
 */
export function createVariantClasses<T extends string>(
  baseClasses: string,
  variantMap: Record<T, string>
): (variant: T, ...additionalClasses: ClassValue[]) => string {
  return (variant: T, ...additionalClasses: ClassValue[]) => {
    return cn(baseClasses, variantMap[variant], ...additionalClasses);
  };
}

/**
 * Conditionally apply classes based on state
 * 
 * @param conditions - Object mapping class strings to boolean conditions
 * @returns Merged class string of all true conditions
 * 
 * @example
 * ```tsx
 * conditionalClasses({
 *   'opacity-50 cursor-not-allowed': isDisabled,
 *   'hover:bg-primary-hover': !isDisabled,
 *   'ring-2 ring-primary': isFocused,
 * })
 * ```
 */
export function conditionalClasses(
  conditions: Record<string, boolean | undefined>
): string {
  return cn(
    Object.entries(conditions)
      .filter(([, condition]) => condition)
      .map(([className]) => className)
  );
}

/**
 * Focus ring classes for accessibility
 */
export const focusRingClasses =
  'focus:outline-none focus:ring-2 focus:ring-precision-teal focus:ring-offset-2 focus:ring-offset-surface';

/**
 * Transition classes for consistent animations
 */
export const transitionClasses = 'transition-all duration-200 ease-out';

/**
 * Glass panel effect classes
 */
export const glassClasses = 'bg-glass-white backdrop-blur-md border border-glass-border';

/**
 * Default export
 */
export default cn;
