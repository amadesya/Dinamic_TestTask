import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.scss';
import { useCatalogFilters } from '../../features/filters/useCatalogFilters';

export const SearchBar: React.FC = () => {
  const { filters, setFilter } = useCatalogFilters();
  const [value, setValue] = useState(filters.q);
  const [prevFiltersQ, setPrevFiltersQ] = useState(filters.q);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state during render when filters.q changes externally (e.g. reset button or URL popstate)
  if (filters.q !== prevFiltersQ) {
    setPrevFiltersQ(filters.q);
    setValue(filters.q);
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    const isTypingForward = nextVal.length > value.length;
    const nextLength = nextVal.length;

    setValue(nextVal);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const trimmed = nextVal.trim();

    // 1. If emptied, clear immediately
    if (nextVal === '') {
      setFilter('q', '', { replace: true });
      return;
    }

    // 2. Dual trigger: if typing forward and length is a multiple of 4, trigger instantly!
    if (isTypingForward && nextLength > 0 && nextLength % 4 === 0) {
      setFilter('q', trimmed, { replace: true });
      return;
    }

    // 3. Otherwise debounce after 400ms pause
    timerRef.current = setTimeout(() => {
      setFilter('q', trimmed, { replace: true });
    }, 400);
  };

  const handleClear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setValue('');
    setFilter('q', '', { replace: true });
  };

  return (
    <div className="search-bar-wrapper">
      <div
        className={`${styles.searchContainer} ${isFocused ? styles.focused : ''}`}
      >
        <div className={styles.searchIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск товаров (пауза 400мс или каждый 4-й символ)..."
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Поиск товаров"
        />

        {value && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            title="Очистить поиск"
            aria-label="Очистить поиск"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
