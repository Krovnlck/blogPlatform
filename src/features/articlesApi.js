import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://blog-platform.kata.academy/api';

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
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
    }),
    getArticle: builder.query({
      query: (slug) => `/articles/${slug}`
    }),
    createArticle: builder.mutation({
      query: (articleData) => {
        const token = localStorage.getItem('token');
        return {
          url: '/articles',
          method: 'POST',
          headers: { Authorization: `Token ${token}` },
          body: articleData
        };
      }
    }),
    updateArticle: builder.mutation({
      query: ({ slug, ...articleData }) => {
        const token = localStorage.getItem('token');
        return {
          url: `/articles/${slug}`,
          method: 'PUT',
          headers: { Authorization: `Token ${token}` },
          body: articleData
        };
      }
    }),
    deleteArticle: builder.mutation({
      query: (slug) => {
        const token = localStorage.getItem('token');
        return {
          url: `/articles/${slug}`,
          method: 'DELETE',
          headers: { Authorization: `Token ${token}` }
        };
      },
      invalidatesTags: (result, error, slug) => [
        { type: 'Articles', id: slug },
        { type: 'Articles', id: 'LIST' },
      ],
    }),
    favoriteArticle: builder.mutation({
      query: (slug) => {
        const token = localStorage.getItem('token');
        return {
          url: `/articles/${slug}/favorite`,
          method: 'POST',
          headers: { Authorization: `Token ${token}` }
        };
      }
    })
  })
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation
} = articlesApi; 