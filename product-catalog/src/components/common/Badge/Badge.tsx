import React from 'react';
import styles from './Badge.module.scss';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'discount' | 'rating';
  size?: 'sm' | 'md';
  pill?: boolean;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  pill = false,
  icon,
  className = '',
  ...props
}) => {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    pill ? styles.pill : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} {...props}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};
