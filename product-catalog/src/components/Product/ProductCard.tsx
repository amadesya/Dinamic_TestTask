import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import type { Product } from '../../types/product';
import { Badge } from '../common/Badge';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleFavorite, selectIsFavorite } from '../../features/favorites/favoritesSlice';

export interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, product.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product.id));
  };

  const discount = product.discountPercentage ? Math.round(product.discountPercentage) : 0;
  const originalPrice = discount > 0 && product.price
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <button
          type="button"
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          aria-pressed={isFavorite}
        >
          <svg
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </button>

        <div className={styles.badges}>
          {discount > 0 && (
            <Badge variant="discount" size="sm">
              -{discount}%
            </Badge>
          )}
        </div>

        <Link
          to={`/products/${product.id}`}
          state={{ fromSearch: location.search }}
          style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {product.thumbnail && !imageError ? (
            <img
              src={product.thumbnail}
              alt={product.title || 'Товар'}
              className={styles.thumbnail}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.imageFallback}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              <span>Нет фото</span>
            </div>
          )}
        </Link>
      </div>

      <div className={styles.content}>
        {product.category && (
          <span className={styles.category}>{product.category}</span>
        )}

        <Link
          to={`/products/${product.id}`}
          state={{ fromSearch: location.search }}
          className={styles.title}
          title={product.title}
        >
          {product.title || 'Без названия'}
        </Link>

        <div className={styles.metaRow}>
          {product.rating !== undefined && (
            <span className={styles.rating} title={`Рейтинг ${product.rating}`}>
              <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {product.rating.toFixed(1)}
            </span>
          )}

          {product.stock !== undefined && (
            <span
              className={`
                ${styles.stock}
                ${product.stock === 0 ? styles.outOfStock : product.stock < 10 ? styles.lowStock : ''}
              `}
            >
              {product.stock === 0
                ? 'Нет в наличии'
                : product.stock < 10
                ? `Осталось ${product.stock} шт.`
                : 'В наличии'}
            </span>
          )}
        </div>

        <div className={styles.priceRow}>
          <span className={styles.price}>
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
          {originalPrice && (
            <span className={styles.oldPrice}>${originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};
