import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import styles from './Layout.module.scss';

const CURRENT_YEAR = new Date().getFullYear();

export const Layout: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <span>Тестовое задание Автохолдинг Динамика</span>
          <span>Powered by Mia Frolova</span>
          <span>GitHub: amadesya</span>
        </div>
      </footer>
    </div>
  );
};
