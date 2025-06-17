import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery("/auth"),
  tagTypes: ["getUserDetail", "userList"],

  endpoints: (build) => ({
    signIn: build.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: build.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    getUserDetails: build.query({
      query: () => ({
        url: "/getUserDetails",
        method: "GET",
      }),
      providesTags: [{ type: "getUserDetail", id: "LIST" }],
    }),
    getAllUsersByFilters: build.query({
      query: ({ search }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);

        return {
          url: `/getUsersByFilter?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "getUserDetail", id: "LIST" }],
    }),
    updateUserDetails: build.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [
        { type: "getUserDetail", id: "LIST" },
        { type: "userList", id: "LIST" },
      ],
    }),
    deleteUser: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "getUserDetail", id: "LIST" },
        { type: "userList", id: "LIST" },
      ],
    }),

    getUserById: build.query({
      query: ({ id }) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
  useGetAllUsersByFiltersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} = authApi;
