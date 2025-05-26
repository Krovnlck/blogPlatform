import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/authApi';
import { articlesApi } from '../features/articlesApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, articlesApi.middleware)
}); 