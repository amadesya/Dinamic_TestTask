import React from 'react';
import styles from './StatePlaceholder.module.scss';
import { Button } from '../Button';

export interface StatePlaceholderProps {
  variant?: 'empty' | 'error' | 'not-found' | 'loading';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const DefaultEmptyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const DefaultErrorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

const DefaultNotFoundIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </svg>
);

export const StatePlaceholder: React.FC<StatePlaceholderProps> = ({
  variant = 'empty',
  title,
  description,
  icon,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  children,
  className = '',
}) => {
  const renderIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'error':
        return <DefaultErrorIcon />;
      case 'not-found':
        return <DefaultNotFoundIcon />;
      case 'empty':
      default:
        return <DefaultEmptyIcon />;
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'error':
        return styles.error;
      case 'not-found':
        return styles.notFound;
      case 'loading':
        return styles.loading;
      case 'empty':
      default:
        return styles.empty;
    }
  };

  return (
    <div className={`${styles.placeholder} ${className}`}>
      <div className={`${styles.iconWrapper} ${getVariantClass()}`}>
        {renderIcon()}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {(actionText || secondaryActionText || children) && (
        <div className={styles.actions}>
          {actionText && onAction && (
            <Button
              variant={variant === 'error' ? 'danger' : 'primary'}
              size="md"
              onClick={onAction}
            >
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button
              variant="secondary"
              size="md"
              onClick={onSecondaryAction}
            >
              {secondaryActionText}
            </Button>
          )}
          {children}
        </div>
      )}
    </div>
  );
};
