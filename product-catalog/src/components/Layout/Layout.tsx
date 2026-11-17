import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import styles from './Layout.module.scss';

export const Layout: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <a href="#main-content" className={styles.skipLink}>
        Перейти к основному контенту
      </a>
      <Header />
      <main id="main-content" className={styles.main} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <span>Тестовое задание Автохолдинг Динамика</span>
          <span>GitHub: amadesya</span>
        </div>
      </footer>
    </div>
  );
};
