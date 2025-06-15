import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const veterinaryApi = createApi({
  reducerPath: "veterinaryApi",
  baseQuery: createBaseQuery("/veterinaries"),
  tagTypes: ["GetVeterinary"],
  endpoints: (build) => ({
    addVeterinary: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetVeterinary", id: "LIST" }],
    }),

    getAllVeterinarys: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.veterinarys
          ? [
              ...result.veterinarys.map(({ id }) => ({
                type: "GetVeterinary",
                id,
              })),
              { type: "GetVeterinary", id: "LIST" },
            ]
          : [{ type: "GetVeterinary", id: "LIST" }],
    }),
    getAllVeterinarysByFilters: build.query({
      query: ({ search, location, speciality, availability, rating }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (location) params.append("city", location);
        if (speciality) params.append("specialty", speciality);
        if (availability) params.append("day", availability);
        if (rating) params.append("rating", rating);

        return {
          url: `/getAllVeterinarysByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.veterinarys
          ? [
              ...result.veterinarys.map(({ _id }) => ({
                type: "GetVeterinary",
                id: _id,
              })),
              { type: "GetVeterinary", id: "LIST" },
            ]
          : [{ type: "GetVeterinary", id: "LIST" }],
    }),

    getVeterinaryById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateVeterinary: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetVeterinary", id: "LIST" }],
    }),
    deleteVeterinary: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetVeterinary", id: "LIST" }],
    }),
  }),
});

export const {
  useAddVeterinaryMutation,
  useGetAllVeterinarysQuery,
  useGetVeterinaryByIdQuery,
  useUpdateVeterinaryMutation,
  useDeleteVeterinaryMutation,
  useGetAllVeterinarysByFiltersQuery,
} = veterinaryApi;
