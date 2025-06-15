import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const adoptionApi = createApi({
  reducerPath: "adoptionApi",
  baseQuery: createBaseQuery("/adoptions"),
  tagTypes: ["GetAdoption"],
  endpoints: (build) => ({
    addAdoption: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetAdoption", id: "LIST" }],
    }),

    getAllAdoptions: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.adoptions
          ? [
              ...result.adoptions.map(({ id }) => ({
                type: "GetAdoption",
                id,
              })),
              { type: "GetAdoption", id: "LIST" },
            ]
          : [{ type: "GetAdoption", id: "LIST" }],
    }),
    getAllAdoptionsByFilters: build.query({
      query: ({ search, breed, age, location, petType }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (breed) params.append("breed", breed);
        if (age) params.append("age", age);
        if (location) params.append("location", location);
        if (petType) params.append("petType", petType);

        return {
          url: `/getAllAdoptionsByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.adoptions
          ? [
              ...result.adoptions.map(({ _id }) => ({
                type: "GetAdoption",
                id: _id,
              })),
              { type: "GetAdoption", id: "LIST" },
            ]
          : [{ type: "GetAdoption", id: "LIST" }],
    }),

    getAdoptionById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateAdoption: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetAdoption", id: "LIST" }],
    }),
    deleteAdoption: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetAdoption", id: "LIST" }],
    }),
  }),
});

export const {
  useAddAdoptionMutation,
  useGetAllAdoptionsQuery,
  useGetAdoptionByIdQuery,
  useUpdateAdoptionMutation,
  useDeleteAdoptionMutation,
  useGetAllAdoptionsByFiltersQuery,
} = adoptionApi;
