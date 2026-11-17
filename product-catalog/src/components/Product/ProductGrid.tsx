import React from 'react';
import styles from './ProductGrid.module.scss';
import type { Product } from '../../types/product';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../common/Skeleton';

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  sentinelRef?: React.RefObject<HTMLDivElement | null>;
  skeletonCount?: number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  isFetchingMore = false,
  hasMore = false,
  sentinelRef,
  skeletonCount = 8,
}) => {
  if (isLoading && products.length === 0) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={`skeleton-${i}`} className={styles.skeletonCard}>
              <Skeleton variant="rectangular" className={styles.skeletonImage} />
              <div className={styles.skeletonBody}>
                <Skeleton variant="text" width="35%" height={12} />
                <Skeleton variant="text" width="90%" height={18} />
                <Skeleton variant="text" width="60%" height={18} />
                <Skeleton variant="text" width="40%" height={22} className={styles.skeletonPrice} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && sentinelRef && (
        <div ref={sentinelRef} className={styles.sentinel}>
          {isFetchingMore && (
            <div className={styles.loadingMore}>
              <span className={styles.spinner} />
              <span>Загрузка товаров...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className={styles.endOfList}>Все доступные товары загружены ({products.length})</p>
      )}
    </div>
  );
};
