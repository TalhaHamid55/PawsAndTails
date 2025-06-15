import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: createBaseQuery("/products"),
  tagTypes: ["GetProducts"],
  endpoints: (build) => ({
    addProduct: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetProducts", id: "LIST" }],
    }),

    getAllProducts: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ id }) => ({ type: "GetProducts", id })),
              { type: "GetProducts", id: "LIST" },
            ]
          : [{ type: "GetProducts", id: "LIST" }],
    }),
    getAllProductsByFilters: build.query({
      query: ({
        search,
        category,
        brand,
        petType,
        rating,
        sort,
        minPrice,
        maxPrice,
      }) => {
        const params = new URLSearchParams();

        if (search) params.append("search", search);
        if (brand) params.append("brand", brand);
        if (category) params.append("category", category);
        if (petType) params.append("petType", petType);
        if (rating) params.append("rating", rating);
        if (sort) params.append("sort", sort);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);

        return {
          url: `/getAllProductsByFilters?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "GetProducts",
                id: _id,
              })),
              { type: "GetProducts", id: "LIST" },
            ]
          : [{ type: "GetProducts", id: "LIST" }],
    }),

    getProductById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetProducts", id: "LIST" }],
    }),
    deleteProduct: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetProducts", id: "LIST" }],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsByFiltersQuery,
} = productApi;
