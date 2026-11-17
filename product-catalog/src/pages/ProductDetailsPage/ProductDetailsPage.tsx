import React from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './ProductDetailsPage.module.scss';
import { useGetProductByIdQuery } from '../../api/productsApi';
import { ImageGallery } from '../../components/Product/ImageGallery';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { StatePlaceholder } from '../../components/common/StatePlaceholder';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { toggleFavorite, selectIsFavorite } from '../../features/favorites/favoritesSlice';
import { calculateDiscountPricing } from '../../utils/pricing';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const productId = Number(id);
  const isValidId = !Number.isNaN(productId) && productId > 0;

  const {
    data: product,
    error,
    isLoading,
    refetch,
  } = useGetProductByIdQuery(productId, {
    skip: !isValidId,
  });

  const isFavorite = useAppSelector((state) =>
    product ? selectIsFavorite(state, product.id) : false
  );

  // Preserve previous filter query params from location state if available
  const fromSearch = (location.state as { fromSearch?: string } | undefined)?.fromSearch ?? '';
  const backToCatalogUrl = `/${fromSearch}`;

  const handleFavoriteToggle = () => {
    if (product) {
      dispatch(toggleFavorite(product.id));
    }
  };

  if (!isValidId) {
    return (
      <div className={styles.page}>
        <StatePlaceholder
          variant="not-found"
          title="Некорректный ID товара"
          description="ID товара в адресной строке должен быть положительным числом."
          actionText="Вернуться в каталог"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.backRow}>
          <Skeleton variant="text" width={160} height={20} />
        </div>
        <div className={styles.skeletonPage}>
          <Skeleton variant="rectangular" height={400} borderRadius={16} />
          <div className={styles.skeletonContent}>
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width="90%" height={36} />
            <Skeleton variant="text" width={140} height={24} />
            <Skeleton variant="rectangular" height={100} borderRadius={12} />
            <Skeleton variant="text" width="100%" height={80} />
            <Skeleton variant="rectangular" height={44} borderRadius={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <StatePlaceholder
          variant="not-found"
          title="Товар не найден"
          description={`Товар с идентификатором #${id} не существует или был удален.`}
          actionText="Вернуться в каталог"
          onAction={() => navigate(backToCatalogUrl)}
          secondaryActionText="Повторить запрос"
          onSecondaryAction={() => refetch()}
        />
      </div>
    );
  }

  const { discount, originalPrice } = calculateDiscountPricing(
    product.price,
    product.discountPercentage
  );

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : [];

  const stockStatusClass =
    product.stock === 0
      ? styles.outOfStock
      : product.stock < 10
      ? styles.lowStock
      : styles.inStock;

  const stockStatusText =
    product.stock === 0
      ? 'Нет в наличии'
      : product.stock < 10
      ? `Осталось мало (${product.stock} шт.)`
      : `В наличии (${product.stock} шт.)`;

  return (
    <div className={styles.page}>
      <div className={styles.backRow}>
        <Link to={backToCatalogUrl} className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Назад в каталог</span>
        </Link>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Image Gallery */}
        <div>
          <ImageGallery images={galleryImages} title={product.title} />
        </div>

        {/* Right Column: Info & Actions */}
        <div className={styles.infoColumn}>
          <div className={styles.metaHeader}>
            {product.brand && <span className={styles.brand}>{product.brand}</span>}
            {product.category && (
              <Badge variant="primary" size="sm">
                {product.category}
              </Badge>
            )}
            <span className={`${styles.stockBadge} ${stockStatusClass}`}>
              {stockStatusText}
            </span>
          </div>

          <h1 className={styles.title}>{product.title}</h1>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <span className={styles.rating}>
              <svg viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {product.rating?.toFixed(1) ?? '—'}
            </span>
            {product.reviews && product.reviews.length > 0 && (
              <span className={styles.reviewsCount}>
                ({product.reviews.length} {product.reviews.length === 1 ? 'отзыв' : 'отзывов'})
              </span>
            )}
          </div>

          {/* Price */}
          <div className={styles.priceBlock}>
            <div className={styles.priceRow}>
              <span className={styles.currentPrice}>
                ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
              </span>
              {originalPrice && (
                <span className={styles.oldPrice}>${originalPrice}</span>
              )}
              {discount > 0 && (
                <Badge variant="discount" size="md">
                  Экономия {discount}%
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className={styles.actions}>
            <Button
              variant="favorite"
              size="lg"
              active={isFavorite}
              className={styles.favoriteButton}
              onClick={handleFavoriteToggle}
              startIcon={
                <svg
                  viewBox="0 0 24 24"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              }
            >
              {isFavorite ? 'В избранном' : 'Добавить в избранное'}
            </Button>
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionSection}>
              <h2 className={styles.sectionHeading}>Описание товара</h2>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionHeading}>Характеристики</h2>
            <table className={styles.specsTable}>
              <tbody>
                {product.sku && (
                  <tr>
                    <th>Артикул (SKU)</th>
                    <td>{product.sku}</td>
                  </tr>
                )}
                {product.brand && (
                  <tr>
                    <th>Бренд</th>
                    <td>{product.brand}</td>
                  </tr>
                )}
                {product.weight !== undefined && (
                  <tr>
                    <th>Вес</th>
                    <td>{product.weight} кг</td>
                  </tr>
                )}
                {product.dimensions && (
                  <tr>
                    <th>Габариты (Ш×В×Г)</th>
                    <td>
                      {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} см
                    </td>
                  </tr>
                )}
                {product.warrantyInformation && (
                  <tr>
                    <th>Гарантия</th>
                    <td>{product.warrantyInformation}</td>
                  </tr>
                )}
                {product.shippingInformation && (
                  <tr>
                    <th>Доставка</th>
                    <td>{product.shippingInformation}</td>
                  </tr>
                )}
                {product.returnPolicy && (
                  <tr>
                    <th>Возврат</th>
                    <td>{product.returnPolicy}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className={styles.reviewsSection}>
          <h2 className={styles.sectionHeading}>Отзывы покупателей ({product.reviews.length})</h2>
          <div className={styles.reviewsList}>
            {product.reviews.map((rev, idx) => (
              <div key={`review-${idx}`} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewerName}>{rev.reviewerName}</span>
                  <span className={styles.reviewDate}>
                    {new Date(rev.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.rating}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      fill={i < rev.rating ? '#f59e0b' : '#e2e8f0'}
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className={styles.reviewComment}>{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
