import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const groomingApi = createApi({
  reducerPath: "groomingApi",
  baseQuery: createBaseQuery("/groomings"),
  tagTypes: ["GetGrooming"],
  endpoints: (build) => ({
    addGrooming: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetGrooming", id: "LIST" }],
    }),

    getAllGroomings: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.groomings
          ? [
              ...result.groomings.map(({ id }) => ({
                type: "GetGrooming",
                id,
              })),
              { type: "GetGrooming", id: "LIST" },
            ]
          : [{ type: "GetGrooming", id: "LIST" }],
    }),
    getAllGroomingsByFilters: build.query({
      query: ({
        search,
        location,
        service,
        availability,
        rating,
        sortBy,
        minPrice,
        maxPrice,
      }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (location) params.append("city", location);
        if (service) params.append("services", service);
        if (availability) params.append("availability", availability);
        if (sortBy) params.append("sort", sortBy);
        if (rating) params.append("rating", rating);

        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);

        return {
          url: `/getAllGroomingsByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.groomings
          ? [
              ...result.groomings.map(({ _id }) => ({
                type: "GetGrooming",
                id: _id,
              })),
              { type: "GetGrooming", id: "LIST" },
            ]
          : [{ type: "GetGrooming", id: "LIST" }],
    }),

    getGroomingById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateGrooming: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetGrooming", id: "LIST" }],
    }),
    deleteGrooming: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetGrooming", id: "LIST" }],
    }),
  }),
});

export const {
  useAddGroomingMutation,
  useGetAllGroomingsQuery,
  useGetGroomingByIdQuery,
  useUpdateGroomingMutation,
  useDeleteGroomingMutation,
  useGetAllGroomingsByFiltersQuery,
} = groomingApi;
