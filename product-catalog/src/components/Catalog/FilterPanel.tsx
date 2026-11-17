import React, { useState } from 'react';
import styles from './FilterPanel.module.scss';
import { useCatalogFilters } from '../../features/filters/useCatalogFilters';
import { useGetCategoriesQuery } from '../../api/productsApi';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import type { ProductSortField } from '../../types/api';

const SORT_OPTIONS = [
  { label: 'По умолчанию', value: '' },
  { label: 'Сначала дешевле (цена ↑)', value: 'price-asc' },
  { label: 'Сначала дороже (цена ↓)', value: 'price-desc' },
  { label: 'По размеру скидки', value: 'discountPercentage-desc' },
  { label: 'По рейтингу', value: 'rating-desc' },
  { label: 'По названию (А — Я)', value: 'title-asc' },
  { label: 'По названию (Я — А)', value: 'title-desc' },
];

export const FilterPanel: React.FC = () => {
  const { filters, setFilter, setFilters, resetFilters, hasActiveFilters } = useCatalogFilters();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategoriesQuery();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeFiltersCount = [
    filters.category,
    filters.sortBy,
    filters.modifiedAfter,
    filters.modifiedBefore,
  ].filter(Boolean).length;

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.slug,
  }));

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter('category', e.target.value);
  };

  // Current combined sort value
  const currentSortValue = filters.sortBy
    ? `${filters.sortBy}-${filters.order || 'asc'}`
    : '';

  const handleUnifiedSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setFilters({ sortBy: '', order: 'asc' });
      return;
    }
    const [field, order] = val.split('-');
    setFilters({
      sortBy: field as ProductSortField,
      order: (order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
    });
  };

  const handleDateAfterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('modifiedAfter', e.target.value);
  };

  const handleDateBeforeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter('modifiedBefore', e.target.value);
  };

  const filterFields = (
    <>
      {/* Category Filter */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Категория</span>
        <Select
          value={filters.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          placeholder={isLoadingCategories ? 'Загрузка...' : 'Все категории'}
          clearable={Boolean(filters.category)}
          onClear={() => setFilter('category', '')}
          disabled={isLoadingCategories}
          fullWidth
        />
      </div>

      {/* Sorting */}
      <div className={styles.section}>
        <span className={styles.sectionTitle}>Сортировка</span>
        <Select
          value={currentSortValue}
          onChange={handleUnifiedSortChange}
          options={SORT_OPTIONS}
          fullWidth
        />
      </div>

      {/* Date filters */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Период обновления</span>
          {(filters.modifiedAfter || filters.modifiedBefore) && (
            <button
              type="button"
              className={styles.sectionResetBtn}
              onClick={() => {
                setFilter('modifiedAfter', '');
                setFilter('modifiedBefore', '');
              }}
              title="Сбросить даты"
            >
              Сбросить
            </button>
          )}
        </div>
        <div className={styles.dateRange}>
          <div className={styles.dateRow}>
            <label className={styles.dateLabel} htmlFor="date-after">
              От
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
              До
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
    </>
  );

  return (
    <>
      <button
        type="button"
        className={styles.mobileTrigger}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Открыть панель фильтров"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        <span>Фильтры</span>
        {activeFiltersCount > 0 && (
          <span className={styles.activeCount}>{activeFiltersCount}</span>
        )}
      </button>

      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            <span>Параметры</span>
            {activeFiltersCount > 0 && (
              <span className={styles.activeCount}>{activeFiltersCount}</span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={resetFilters}
            >
              Сбросить
            </button>
          )}
        </div>

        {filterFields}

        {hasActiveFilters && (
          <Button variant="secondary" size="sm" fullWidth onClick={resetFilters}>
            Очистить фильтры
          </Button>
        )}
      </div>

      <div
        className={`${styles.mobileDrawerOverlay} ${isMobileOpen ? styles.isOpen : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden={!isMobileOpen}
      />
      <div
        className={`${styles.mobileDrawer} ${isMobileOpen ? styles.isOpen : ''}`}
        aria-hidden={!isMobileOpen}
      >
        <div className={styles.drawerHeader}>
          <div className={styles.title}>
            <span>Параметры фильтрации</span>
            {activeFiltersCount > 0 && (
              <span className={styles.activeCount}>{activeFiltersCount}</span>
            )}
          </div>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={() => setIsMobileOpen(false)}
            aria-label="Закрыть панель фильтров"
          >
            ×
          </button>
        </div>

        <div className={styles.drawerBody}>
          {filterFields}
        </div>

        <div className={styles.drawerFooter}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => setIsMobileOpen(false)}
          >
            Показать результаты
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => {
                resetFilters();
                setIsMobileOpen(false);
              }}
            >
              Сбросить все
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
