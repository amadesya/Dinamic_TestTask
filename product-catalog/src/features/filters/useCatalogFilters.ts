import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ProductSortField, SortOrder } from '../../types/api';

const VALID_SORT_FIELDS: ReadonlyArray<ProductSortField> = [
  'price',
  'title',
  'rating',
  'discountPercentage',
];

const VALID_SORT_ORDERS: ReadonlyArray<SortOrder> = ['asc', 'desc'];

export interface CatalogFilters {
  q: string;
  category: string;
  sortBy: ProductSortField | '';
  order: SortOrder;
  modifiedAfter: string;
  modifiedBefore: string;
}

export interface SetFilterOptions {
  replace?: boolean;
}

export interface UseCatalogFiltersReturn {
  filters: CatalogFilters;
  setFilter: <K extends keyof CatalogFilters>(
    key: K,
    value: CatalogFilters[K],
    options?: SetFilterOptions
  ) => void;
  setFilters: (
    partial: Partial<CatalogFilters>,
    options?: SetFilterOptions
  ) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook providing bidirectional synchronization between URL search parameters
 * and catalog filter state.
 *
 * Single Source of Truth (SSOT) is the browser URL, ensuring native support for
 * bookmarks, sharing, refresh, and browser Back/Forward navigation.
 */
export function useCatalogFilters(): UseCatalogFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<CatalogFilters>(() => {
    const rawQ = searchParams.get('q') ?? '';
    const rawCategory = searchParams.get('category') ?? '';
    const rawSortBy = searchParams.get('sortBy') ?? '';
    const rawOrder = searchParams.get('order') ?? '';
    const rawModifiedAfter = searchParams.get('modifiedAfter') ?? '';
    const rawModifiedBefore = searchParams.get('modifiedBefore') ?? '';

    const sortBy = VALID_SORT_FIELDS.includes(rawSortBy as ProductSortField)
      ? (rawSortBy as ProductSortField)
      : '';

    const order: SortOrder = VALID_SORT_ORDERS.includes(rawOrder as SortOrder)
      ? (rawOrder as SortOrder)
      : 'asc';

    return {
      q: rawQ.trim(),
      category: rawCategory.trim(),
      sortBy,
      order,
      modifiedAfter: rawModifiedAfter.trim(),
      modifiedBefore: rawModifiedBefore.trim(),
    };
  }, [searchParams]);

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.q ||
        filters.category ||
        filters.sortBy ||
        filters.modifiedAfter ||
        filters.modifiedBefore
    );
  }, [filters]);

  const applyParams = useCallback(
    (newFilters: CatalogFilters, replace: boolean) => {
      const nextParams = new URLSearchParams();

      if (newFilters.q) {
        nextParams.set('q', newFilters.q);
      }
      if (newFilters.category) {
        nextParams.set('category', newFilters.category);
      }
      if (newFilters.sortBy) {
        nextParams.set('sortBy', newFilters.sortBy);
        if (newFilters.order) {
          nextParams.set('order', newFilters.order);
        }
      }
      if (newFilters.modifiedAfter) {
        nextParams.set('modifiedAfter', newFilters.modifiedAfter);
      }
      if (newFilters.modifiedBefore) {
        nextParams.set('modifiedBefore', newFilters.modifiedBefore);
      }

      setSearchParams(nextParams, { replace });
    },
    [setSearchParams]
  );

  const setFilter = useCallback(
    <K extends keyof CatalogFilters>(
      key: K,
      value: CatalogFilters[K],
      options?: SetFilterOptions
    ) => {
      // By default, text search typing uses replace: true to avoid polluting browser history.
      // Category, sorting, and date filters create new history entries (replace: false).
      const defaultReplace = key === 'q';
      const replace = options?.replace ?? defaultReplace;

      const updated: CatalogFilters = {
        ...filters,
        [key]: value,
      };

      applyParams(updated, replace);
    },
    [filters, applyParams]
  );

  const setFilters = useCallback(
    (partial: Partial<CatalogFilters>, options?: SetFilterOptions) => {
      const replace = options?.replace ?? false;
      const updated: CatalogFilters = {
        ...filters,
        ...partial,
      };
      applyParams(updated, replace);
    },
    [filters, applyParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
  };
}
