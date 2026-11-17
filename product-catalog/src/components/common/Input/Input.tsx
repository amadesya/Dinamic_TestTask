import React, { useState, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  helperText,
  startIcon,
  endIcon,
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
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== '';

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={`
          ${styles.inputWrapper}
          ${isFocused ? styles.focused : ''}
          ${error ? styles.hasError : ''}
          ${disabled ? styles.disabled : ''}
        `}
      >
        {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
        <input
          id={inputId}
          className={styles.input}
          disabled={disabled}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {clearable && hasValue && !disabled && onClear && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={onClear}
            title="Очистить"
            aria-label="Очистить поле ввода"
          >
            ×
          </button>
        )}
        {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
      </div>
      {error ? (
        <span className={styles.errorMessage}>{error}</span>
      ) : helperText ? (
        <span className={styles.helperText}>{helperText}</span>
      ) : null}
    </div>
  );
};
