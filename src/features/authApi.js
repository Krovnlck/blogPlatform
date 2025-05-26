import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = 'https://blog-platform.kata.academy/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getCurrentUser: builder.query({
      query: (token) => ({
        url: '/user',
        headers: { Authorization: `Token ${token}` }
      })
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: { user: userData }
      })
    }),
    loginUser: builder.mutation({
      query: (userData) => ({
        url: '/users/login',
        method: 'POST',
        body: { user: userData }
      })
    })
  })
});

export const { useGetCurrentUserQuery, useRegisterUserMutation, useLoginUserMutation } = authApi; 