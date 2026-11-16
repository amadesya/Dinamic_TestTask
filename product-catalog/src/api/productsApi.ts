import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, ProductsResponse, CategoryItem } from '../types/product';
import type {
  ProductQueryParams,
  CategoryProductsParams,
  SearchProductsParams,
  AddProductInput,
  UpdateProductInput,
  DeleteProductResponse,
} from '../types/api';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),
  tagTypes: ['Product', 'Categories'],

  endpoints: (builder) => ({
    // Primary query for catalog with infinite scroll support
    getProducts: builder.query<ProductsResponse, ProductQueryParams | void>({
      query: (params) => {
        const { category, q, ...rest } = params || {};
        let url = '/products';

        if (category) {
          url = `/products/category/${encodeURIComponent(category)}`;
        } else if (q) {
          url = '/products/search';
        }

        return {
          url,
          params: {
            ...(q && !category ? { q } : {}),
            ...rest,
          },
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        if (!queryArgs) return endpointName;
        // Exclude pagination offset 'skip' so subsequent infinite scroll pages share cache entry
        const { skip: _skip, ...filterArgs } = queryArgs;
        return `${endpointName}-${JSON.stringify(filterArgs)}`;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (!arg?.skip || arg.skip === 0) {
          return newItems;
        }

        const existingIds = new Set(currentCache.products.map((p) => p.id));
        const incomingProducts = newItems.products.filter((p) => !existingIds.has(p.id));

        currentCache.products.push(...incomingProducts);
        currentCache.skip = newItems.skip;
        currentCache.limit = newItems.limit;
        currentCache.total = newItems.total;
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Dedicated single product endpoint
    getProductById: builder.query<Product, number | string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id: Number(id) }],
    }),

    // Dedicated search endpoint
    searchProducts: builder.query<ProductsResponse, SearchProductsParams>({
      query: ({ q, ...rest }) => ({
        url: '/products/search',
        params: { q, ...rest },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Detailed categories with slug, name, url
    getCategories: builder.query<CategoryItem[], void>({
      query: () => '/products/categories',
      providesTags: ['Categories'],
    }),

    // Raw string categories list
    getCategoryList: builder.query<string[], void>({
      query: () => '/products/category-list',
      providesTags: ['Categories'],
    }),

    // Products by category
    getProductsByCategory: builder.query<ProductsResponse, CategoryProductsParams>({
      query: ({ category, ...rest }) => ({
        url: `/products/category/${encodeURIComponent(category)}`,
        params: rest,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.products.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // Mutation: Add new product
    addProduct: builder.mutation<Product, AddProductInput>({
      query: (newProduct) => ({
        url: '/products/add',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // Mutation: Update existing product
    updateProduct: builder.mutation<Product, UpdateProductInput>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // Mutation: Delete product
    deleteProduct: builder.mutation<DeleteProductResponse, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
  useGetCategoriesQuery,
  useGetCategoryListQuery,
  useGetProductsByCategoryQuery,
  useLazyGetProductsByCategoryQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
