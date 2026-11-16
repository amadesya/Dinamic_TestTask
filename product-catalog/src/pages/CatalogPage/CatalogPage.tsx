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
  const { filters, resetFilters, hasActiveFilters } = useCatalogFilters();
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
        rootMargin: '200px',
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
      <div className={styles.topBar}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Каталог товаров</h1>
          {data && (
            <span className={styles.totalBadge}>
              Найдено: <strong>{total}</strong> {total === 1 ? 'товар' : 'товаров'}
            </span>
          )}
        </div>
        <SearchBar />
      </div>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <FilterPanel />
        </aside>

        <section className={styles.content}>
          {error ? (
            <StatePlaceholder
              variant="error"
              title="Не удалось загрузить товары"
              description="Произошла ошибка при загрузке данных с сервера DummyJSON. Проверьте интернет-соединение и попробуйте снова."
              actionText="Повторить попытку"
              onAction={() => refetch()}
            />
          ) : !isLoading && products.length === 0 ? (
            <StatePlaceholder
              variant="empty"
              title="Товары не найдены"
              description={
                hasActiveFilters
                  ? 'По вашему запросу и выбранным фильтрам ничего не найдено. Попробуйте изменить параметры поиска.'
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

export default CatalogPage;
