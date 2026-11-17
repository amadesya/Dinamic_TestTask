import React, { useState, useId } from 'react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export const Select: React.FC<SelectProps> = ({
  id,
  label,
  error,
  options,
  placeholder,
  fullWidth = false,
  clearable = false,
  onClear,
  value,
  disabled,
  className = '',
  onFocus,
  onBlur,
  ...props
}) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== '' && value !== null;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`
          ${styles.selectWrapper}
          ${isFocused ? styles.focused : ''}
          ${error ? styles.hasError : ''}
          ${disabled ? styles.disabled : ''}
        `}
      >
        <select
          id={selectId}
          className={styles.select}
          disabled={disabled}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {clearable && hasValue && !disabled && onClear && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClear();
            }}
            title="Очистить"
            aria-label="Очистить выбор"
          >
            ×
          </button>
        )}
        <div className={styles.arrow} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
