import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FavoritesPage.module.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectFavoriteIds,
  clearFavorites,
  removeFavorite,
} from '../../features/favorites/favoritesSlice';
import { useGetProductByIdQuery } from '../../api/productsApi';
import { ProductCard } from '../../components/Product/ProductCard';
import { Skeleton } from '../../components/common/Skeleton';
import { StatePlaceholder } from '../../components/common/StatePlaceholder';
import { Button } from '../../components/common/Button';

interface FavoriteCardItemProps {
  id: number;
}

const FavoriteCardItem: React.FC<FavoriteCardItemProps> = ({ id }) => {
  const { data: product, isLoading, error } = useGetProductByIdQuery(id);
  const dispatch = useAppDispatch();

  if (isLoading) {
    return (
      <div className={styles.skeletonCard}>
        <Skeleton variant="rectangular" height={220} />
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <Skeleton variant="text" width="40%" height={14} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="50%" height={24} style={{ marginTop: 'auto' }} />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.errorCard}>
        <p>Товар #{id} недоступен</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch(removeFavorite(id))}
        >
          Удалить из списка
        </Button>
      </div>
    );
  }

  return <ProductCard product={product} />;
};

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useAppSelector(selectFavoriteIds);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClear = () => {
    if (window.confirm('Вы действительно хотите очистить весь список избранного?')) {
      dispatch(clearFavorites());
    }
  };

  if (favoriteIds.length === 0) {
    return (
      <div className={styles.page}>
        <StatePlaceholder
          variant="empty"
          title="В избранном пока ничего нет"
          description="Добавляйте понравившиеся товары в каталогe, нажимая на иконку сердечка, чтобы сохранить их."
          actionText="Перейти в каталог"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Избранное</h1>
          <span className={styles.count}>
            {favoriteIds.length} {favoriteIds.length === 1 ? 'товар' : 'товаров'}
          </span>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
          >
            Очистить список
          </button>
        </div>
      </header>

      <div className={styles.grid}>
        {favoriteIds.map((id) => (
          <FavoriteCardItem key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
