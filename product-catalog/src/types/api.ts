import type { Product, ProductsResponse, CategoryItem } from './product';

export type SortOrder = 'asc' | 'desc';

export type ProductSortField = 'price' | 'title' | 'rating' | 'discountPercentage';

export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  select?: string;
  sortBy?: ProductSortField | string;
  order?: SortOrder;
  q?: string;
  category?: string;
  modifiedAfter?: string;
  modifiedBefore?: string;
}

export interface CategoryProductsParams extends Omit<ProductQueryParams, 'category'> {
  category: string;
}

export interface SearchProductsParams extends Omit<ProductQueryParams, 'q'> {
  q: string;
}

export type AddProductInput = Partial<Omit<Product, 'id'>> & {
  title: string;
};

export interface UpdateProductInput {
  id: number;
  data: Partial<Omit<Product, 'id'>>;
}

export interface DeleteProductResponse extends Product {
  isDeleted: boolean;
  deletedOn: string;
}

export type { Product, ProductsResponse, CategoryItem };
