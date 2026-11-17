import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.scss';
import { useAppSelector } from '../../app/hooks';
import { selectFavoritesCount } from '../../features/favorites/favoritesSlice';

export const Header: React.FC = () => {
  const favoritesCount = useAppSelector(selectFavoritesCount);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="Тестовое задание">
          <span className={styles.logoText}>Тестовое задание: Каталог товаров</span>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            Каталог
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `${styles.favoritesButton} ${isActive ? styles.active : ''}`
            }
            aria-label={`Избранное, товаров: ${favoritesCount}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={favoritesCount > 0 ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            <span className={styles.label}>Избранное</span>
            {favoritesCount > 0 && (
              <span className={styles.counterBadge}>{favoritesCount}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};
