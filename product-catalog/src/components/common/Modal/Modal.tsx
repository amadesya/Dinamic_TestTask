import React, { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.scss';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const titleId = useId();
  const descId = useId();

  // Manage body scroll locking and focus restoration
  useEffect(() => {
    if (!isOpen) return;

    previousActiveElementRef.current = document.activeElement as HTMLElement;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first actionable button or dialog on mount
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      previousActiveElementRef.current?.focus?.();
    };
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={handleOverlayClick}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Закрыть окно"
          >
            ×
          </button>
        </div>

        {description && (
          <p id={descId} className={styles.description}>
            {description}
          </p>
        )}

        {children && <div className={styles.body}>{children}</div>}

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body
  );
};
