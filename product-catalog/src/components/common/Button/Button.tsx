import React from 'react';
import styles from './Button.module.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'favorite';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  active?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  active = false,
  startIcon,
  endIcon,
  className = '',
  disabled,
  ...props
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    active ? styles.active : '',
    isLoading ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : (
        startIcon && <span className={styles.startIcon}>{startIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && endIcon && <span className={styles.endIcon}>{endIcon}</span>}
    </button>
  );
};
