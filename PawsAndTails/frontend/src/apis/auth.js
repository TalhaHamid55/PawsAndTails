import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: createBaseQuery("/auth"),
  tagTypes: ["getUserDetail"],
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
      providesTags: (result) =>
        result?.adoptions
          ? [
              ...result.adoptions.map(({ id }) => ({
                type: "getUserDetail",
                id,
              })),
              { type: "getUserDetail", id: "LIST" },
            ]
          : [{ type: "getUserDetail", id: "LIST" }],
    }),

    updateUserDetails: build.mutation({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "getUserDetail", id: "LIST" }],
    }),
  }),
});

export const {
  useSignInMutation,
  useRegisterMutation,
  useGetUserDetailsQuery,
  useUpdateUserDetailsMutation,
} = authApi;
