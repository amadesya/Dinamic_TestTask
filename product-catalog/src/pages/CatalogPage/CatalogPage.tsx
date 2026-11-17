import React, { useState, useEffect, useRef } from 'react';
import styles from './CatalogPage.module.scss';
import { useCatalogFilters } from '../../features/filters/useCatalogFilters';
import { useGetProductsQuery } from '../../api/productsApi';
import { SearchBar } from '../../components/Catalog/SearchBar';
import { FilterPanel } from '../../components/Catalog/FilterPanel';
import { ProductGrid } from '../../components/Product/ProductGrid';
import { StatePlaceholder } from '../../components/common/StatePlaceholder';

const PAGE_LIMIT = 12;

export const CatalogPage: React.FC = () => {
  const { filters, setFilter, resetFilters, hasActiveFilters } = useCatalogFilters();
  const [skip, setSkip] = useState(0);
  const filterKey = `${filters.q}|${filters.category}|${filters.sortBy}|${filters.order}|${filters.modifiedAfter}|${filters.modifiedBefore}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset pagination offset whenever any filter parameter changes
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setSkip(0);
  }

  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductsQuery({
    limit: PAGE_LIMIT,
    skip,
    q: filters.q || undefined,
    category: filters.category || undefined,
    sortBy: filters.sortBy || undefined,
    order: filters.sortBy ? filters.order : undefined,
    modifiedAfter: filters.modifiedAfter || undefined,
    modifiedBefore: filters.modifiedBefore || undefined,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const hasMore = products.length < total;

  // Infinite scroll IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isFetching || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isFetching && !isLoading) {
          setSkip((prev) => prev + PAGE_LIMIT);
        }
      },
      {
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, isLoading, products.length]);

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Каталог товаров</h1>
          {data && (
            <span className={styles.totalBadge}>
              {total} {total === 1 ? 'товар' : 'товаров'}
            </span>
          )}
        </div>
        <div className={styles.searchArea}>
          <SearchBar />
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <FilterPanel />
        </aside>

        <section className={styles.content}>
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className={styles.activeChipsBar}>
              {filters.q && (
                <span className={styles.chip}>
                  Поиск: &laquo;{filters.q}&raquo;
                  <button
                    type="button"
                    onClick={() => setFilter('q', '', { replace: true })}
                    aria-label="Удалить фильтр поиска"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.category && (
                <span className={styles.chip}>
                  Категория: {filters.category}
                  <button
                    type="button"
                    onClick={() => setFilter('category', '')}
                    aria-label="Удалить фильтр категории"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.sortBy && (
                <span className={styles.chip}>
                  Сортировка: {filters.sortBy} ({filters.order === 'asc' ? '↑' : '↓'})
                  <button
                    type="button"
                    onClick={() => setFilter('sortBy', '')}
                    aria-label="Удалить сортировку"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.modifiedAfter && (
                <span className={styles.chip}>
                  От: {filters.modifiedAfter}
                  <button
                    type="button"
                    onClick={() => setFilter('modifiedAfter', '')}
                    aria-label="Удалить фильтр даты от"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.modifiedBefore && (
                <span className={styles.chip}>
                  До: {filters.modifiedBefore}
                  <button
                    type="button"
                    onClick={() => setFilter('modifiedBefore', '')}
                    aria-label="Удалить фильтр даты до"
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                type="button"
                className={styles.clearChipsBtn}
                onClick={resetFilters}
              >
                Очистить все
              </button>
            </div>
          )}

          {error ? (
            <StatePlaceholder
              variant="error"
              title="Не удалось загрузить товары"
              description="Проверьте интернет-соединение и повторите попытку."
              actionText="Повторить попытку"
              onAction={() => refetch()}
            />
          ) : !isLoading && products.length === 0 ? (
            <StatePlaceholder
              variant="empty"
              title="Товары не найдены"
              description={
                hasActiveFilters
                  ? 'Попробуйте сбросить параметры.'
                  : 'Список товаров пуст.'
              }
              actionText={hasActiveFilters ? 'Сбросить фильтры' : undefined}
              onAction={hasActiveFilters ? resetFilters : undefined}
            />
          ) : (
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isFetchingMore={isFetching && skip > 0}
              hasMore={hasMore}
              sentinelRef={sentinelRef}
              skeletonCount={PAGE_LIMIT}
            />
          )}
        </section>
      </div>
    </div>
  );
};
