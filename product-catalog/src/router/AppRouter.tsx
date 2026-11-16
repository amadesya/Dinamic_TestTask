import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout/Layout';
import { CatalogPage } from '../pages/CatalogPage/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage/ProductDetailsPage';
import { FavoritesPage } from '../pages/FavoritesPage/FavoritesPage';
import { NotFoundPage } from '../pages/NotFoundPage/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <CatalogPage />,
      },
      {
        path: 'products/:id',
        element: <ProductDetailsPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
