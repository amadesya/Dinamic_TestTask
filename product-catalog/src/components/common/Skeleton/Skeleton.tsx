import React from 'react';
import styles from './Skeleton.module.scss';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  borderRadius,
  className = '',
  style,
  ...props
}) => {
  const inlineStyles: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(borderRadius !== undefined ? { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius } : {}),
  };

  const classNames = [
    styles.skeleton,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classNames} style={inlineStyles} aria-hidden="true" {...props} />;
};
