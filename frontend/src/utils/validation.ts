// ============================================
// VALIDATION UTILITY
// Form and Data Validation
// ============================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): ValidationResult => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!regex.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string,
  options?: {
    minLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumber?: boolean;
    requireSpecial?: boolean;
  }
): ValidationResult => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecial = false,
  } = options || {};

  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < minLength) return { valid: false, error: `Password must be at least ${minLength} characters` };
  if (requireUppercase && !/[A-Z]/.test(password)) return { valid: false, error: 'Password must contain an uppercase letter' };
  if (requireLowercase && !/[a-z]/.test(password)) return { valid: false, error: 'Password must contain a lowercase letter' };
  if (requireNumber && !/\d/.test(password)) return { valid: false, error: 'Password must contain a number' };
  if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return { valid: false, error: 'Password must contain a special character' };

  return { valid: true };
};

/**
 * Validate that passwords match
 */
export const validatePasswordMatch = (password: string, confirm: string): ValidationResult => {
  if (password !== confirm) return { valid: false, error: 'Passwords do not match' };
  return { valid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: unknown, fieldName: string = 'This field'): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
};

/**
 * Validate phone number
 */
export const validatePhone = (phone: string): ValidationResult => {
  const cleaned = phone.replace(/\D/g, '');
  if (!cleaned) return { valid: true }; // Optional
  if (cleaned.length < 10) return { valid: false, error: 'Phone number must be at least 10 digits' };
  return { valid: true };
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) return { valid: true }; // Optional
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate file upload
 */
export const validateFile = (
  file: File,
  options?: {
    maxSize?: number; // in bytes
    acceptedTypes?: string[];
  }
): ValidationResult => {
  const { maxSize = 10 * 1024 * 1024, acceptedTypes = ['.csv', '.xlsx'] } = options || {};

  const extension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!acceptedTypes.includes(extension)) {
    return { valid: false, error: `File type not allowed. Accepted: ${acceptedTypes.join(', ')}` };
  }

  if (file.size > maxSize) {
    const sizeMB = (maxSize / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File too large. Maximum size: ${sizeMB}MB` };
  }

  return { valid: true };
};

/**
 * Validate numeric range
 */
export const validateRange = (
  value: number,
  min?: number,
  max?: number
): ValidationResult => {
  if (min !== undefined && value < min) {
    return { valid: false, error: `Value must be at least ${min}` };
  }
  if (max !== undefined && value > max) {
    return { valid: false, error: `Value must be at most ${max}` };
  }
  return { valid: true };
};

/**
 * Combine multiple validations
 */
export const validateAll = (
  validations: ValidationResult[]
): { valid: boolean; errors: string[] } => {
  const errors = validations
    .filter((v) => !v.valid && v.error)
    .map((v) => v.error as string);

  return {
    valid: errors.length === 0,
    errors,
  };
};
