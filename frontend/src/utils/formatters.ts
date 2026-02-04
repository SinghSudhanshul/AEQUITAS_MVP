// ============================================
// FORMATTERS UTILITY
// Number, Currency, Date Formatting
// ============================================

/**
 * Format number as currency (USD)
 */
export const formatCurrency = (
  value: number,
  options?: {
    compact?: boolean;
    decimals?: number;
    showSign?: boolean;
  }
): string => {
  const { compact = false, decimals = 0, showSign = false } = options || {};

  if (compact) {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    const formatted = formatter.format(Math.abs(value));
    const sign = value >= 0 ? (showSign ? '+' : '') : '-';
    return sign + formatted;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (showSign && value > 0) {
    return '+' + formatter.format(value);
  }

  return formatter.format(value);
};

/**
 * Format number with thousands separator
 */
export const formatNumber = (
  value: number,
  options?: {
    decimals?: number;
    compact?: boolean;
    showSign?: boolean;
  }
): string => {
  const { decimals = 0, compact = false, showSign = false } = options || {};

  if (compact) {
    const formatter = new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    const formatted = formatter.format(Math.abs(value));
    const sign = value >= 0 ? (showSign ? '+' : '') : '-';
    return sign + formatted;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  if (showSign && value > 0) {
    return '+' + formatter.format(value);
  }

  return formatter.format(value);
};

/**
 * Format percentage
 */
export const formatPercent = (
  value: number,
  options?: {
    decimals?: number;
    showSign?: boolean;
  }
): string => {
  const { decimals = 1, showSign = false } = options || {};
  const sign = value > 0 && showSign ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Format date
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    format = 'short';
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }[format] as Intl.DateTimeFormatOptions;

  return d.toLocaleDateString('en-US', options);
};

/**
 * Format time
 */
export const formatTime = (
  date: string | Date,
  options?: { seconds?: boolean; timezone?: boolean }
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const { seconds = false, timezone = false } = options || {};

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  if (seconds) formatOptions.second = '2-digit';
  if (timezone) formatOptions.timeZoneName = 'short';

  return d.toLocaleTimeString('en-US', formatOptions);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};
