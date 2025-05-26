import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://blog-platform.kata.academy/api';

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Token ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Articles'],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ limit = 5, offset = 0 } = {}) => `/articles?limit=${limit}&offset=${offset}`,
      providesTags: (result) =>
        result && result.articles
          ? [
              ...result.articles.map(({ slug }) => ({ type: 'Articles', id: slug })),
              { type: 'Articles', id: 'LIST' },
            ]
          : [{ type: 'Articles', id: 'LIST' }],
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs;
      },
      merge: (currentCache, newItems) => {
        return newItems;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      }
    }),
    getArticle: builder.query({
      query: (slug) => `/articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Articles', id: slug }],
    }),
    createArticle: builder.mutation({
      query: (articleData) => ({
        url: '/articles',
        method: 'POST',
        body: articleData
      }),
      invalidatesTags: [{ type: 'Articles', id: 'LIST' }],
    }),
    updateArticle: builder.mutation({
      query: ({ slug, ...articleData }) => ({
        url: `/articles/${slug}`,
        method: 'PUT',
        body: articleData
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' }
      ],
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' }
      ],
    }),
    favoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'POST'
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' }
      ],
    }),
    unfavoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `/articles/${slug}/favorite`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' }
      ],
    })
  })
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation
} = articlesApi; 