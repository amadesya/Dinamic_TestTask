import React, { useState } from 'react';
import styles from './FilterPanel.module.scss';
import { useCatalogFilters } from '../../features/filters/useCatalogFilters';
import { useGetCategoriesQuery } from '../../api/productsApi';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { ProductSortField } from '../../types/api';

const SORT_OPTIONS = [
  { label: 'Без сортировки', value: '' },
  { label: 'По цене', value: 'price' },
  { label: 'По названию', value: 'title' },
  { label: 'По рейтингу', value: 'rating' },
  { label: 'По размеру скидки', value: 'discountPercentage' },
];

export const FilterPanel: React.FC = () => {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useCatalogFilters();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.slug,
  }));

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('category', e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('sortBy', e.target.value as ProductSortField | '');
  };

  const toggleSortOrder = () => {
    setFilter('order', filters.order === 'asc' ? 'desc' : 'asc');
  };

  const handleDateAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('modifiedAfter', e.target.value);
  };

  const handleDateBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('modifiedBefore', e.target.value);
  };

  const renderContent = () => (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span>Фильтры</span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.resetBtn}
            onClick={resetFilters}
          >
            Сбросить все
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Категория</span>
        <Select
          value={filters.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={isLoadingCategories ? 'Загрузка категорий...' : 'Все категории'}
          clearable={Boolean(filters.category)}
          onClear={() => setFilter('category', '')}
          disabled={isLoadingCategories}
          fullWidth
        />
      </div>

      {/* Sorting */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Сортировка</span>
        <div className={styles.sortGrid}>
          <Select
            value={filters.sortBy}
            onChange={handleSortChange}
            options={SORT_OPTIONS}
            fullWidth
          />
          {filters.sortBy && (
            <button
              type="button"
              className={styles.orderToggleBtn}
              onClick={toggleSortOrder}
              title={filters.order === 'asc' ? 'По возрастанию' : 'По убыванию'}
              aria-label={filters.order === 'asc' ? 'По возрастанию' : 'По убыванию'}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{
                  transform: filters.order === 'desc' ? 'rotate(180deg)' : 'none',
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v10.5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Date filters */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Дата изменения</span>
        <div className={styles.dateRange}>
          <div className={styles.dateRow}>
            <label className={styles.dateLabel} htmlFor="date-after">
              Изменено после:
            </label>
            <input
              id="date-after"
              type="date"
              className={styles.dateInput}
              value={filters.modifiedAfter}
              onChange={handleDateAfterChange}
            />
          </div>

          <div className={styles.dateRow}>
            <label className={styles.dateLabel} htmlFor="date-before">
              Изменено до:
            </label>
            <input
              id="date-before"
              type="date"
              className={styles.dateInput}
              value={filters.modifiedBefore}
              onChange={handleDateBeforeChange}
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="secondary" fullWidth onClick={resetFilters}>
          Сбросить фильтры
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <button
        type="button"
        className={styles.mobileTrigger}
        onClick={() => setIsMobileOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <span>
          Фильтры {hasActiveFilters && '(активны)'}
        </span>
      </button>

      {/* Desktop Panel */}
      <div className={styles.panel}>{renderContent()}</div>

      {/* Mobile Slide-over Drawer */}
      <div
        className={`${styles.mobileDrawerOverlay} ${isMobileOpen ? styles.isOpen : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />
      <div className={`${styles.mobileDrawer} ${isMobileOpen ? styles.isOpen : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Закрыть панель фильтров"
          >
            ×
          </button>
        </div>
        {renderContent()}
      </div>
    </>
  );
};
