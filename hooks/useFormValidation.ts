import { useCallback, useRef, useState } from 'react';

interface Rule {
  required?: boolean;
  requiredMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
}

export function useFormValidation<T extends string>(rules: Record<T, Rule>) {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearError = useCallback((field: T) => {
    setErrors(prev => ({ ...prev, [field]: null }));
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  const clearAll = useCallback(() => {
    setErrors({});
  }, []);

  const validate = useCallback((formData: Record<T, string>): boolean => {
    clearAll();

    let hasErrors = false;
    const newErrors: { [key: string]: string | null } = {};

    (Object.keys(rules) as T[]).forEach(field => {
      const value = formData[field];
      const rule = rules[field];

      // Required
      if (rule.required && (!value || value.trim() === '')) {
        newErrors[field] = rule.requiredMessage || 'This field is required';
        hasErrors = true;
        return;
      }

      if (!value || value.trim() === '') return; // Skip empty optional fields

      const trimmed = value.trim();

      // Min length
      if (rule.minLength && trimmed.length < rule.minLength) {
        newErrors[field] = rule.minLengthMessage || `Minimum ${rule.minLength} characters`;
        hasErrors = true;
        return;
      }

      // Min value (numeric fields)
      if (rule.min !== undefined) {
        const num = parseFloat(trimmed);
        if (isNaN(num) || num < rule.min) {
          newErrors[field] = rule.minMessage || `Minimum ${rule.min}`;
          hasErrors = true;
          return;
        }
      }

      // Max value
      if (rule.max !== undefined) {
        const num = parseFloat(trimmed);
        if (!isNaN(num) && num > rule.max) {
          newErrors[field] = rule.maxMessage || `Maximum ${rule.max}`;
          hasErrors = true;
          return;
        }
      }
    });

    setErrors(newErrors);

    // Auto-clear errors after 5s
    if (hasErrors && !errorTimeoutRef.current) {
      errorTimeoutRef.current = setTimeout(() => {
        clearAll();
        errorTimeoutRef.current = null;
      }, 5000);
    }

    return !hasErrors;
  }, [rules, clearAll]);

  return {
    errors,
    validate,
    clearError,
    clearAll,
  };
}
