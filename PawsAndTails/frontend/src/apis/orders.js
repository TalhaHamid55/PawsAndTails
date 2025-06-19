import { createApi } from "@reduxjs/toolkit/query/react";
import { createBaseQuery } from "./createBaseQuery";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: createBaseQuery("/orders"),
  tagTypes: ["GetOrders"],
  endpoints: (build) => ({
    addOrder: build.mutation({
      query: (data) => ({
        url: "/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "GetOrders", id: "LIST" }],
    }),

    getAllOrders: build.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.orderss
          ? [
              ...result.orderss.map(({ id }) => ({
                type: "GetOrder",
                id,
              })),
              { type: "GetOrders", id: "LIST" },
            ]
          : [{ type: "GetOrders", id: "LIST" }],
    }),
    getAllOrdersByFilters: build.query({
      query: ({ search, orderNumber }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        return {
          url: `/getAllOrders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.orderss
          ? [
              ...result.orderss.map(({ _id }) => ({
                type: "GetOrder",
                id: _id,
              })),
              { type: "GetOrder", id: "LIST" },
            ]
          : [{ type: "GetOrder", id: "LIST" }],
    }),

    getOrderById: build.query({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    getOrderDetailsById: build.query({
      query: ({ id }) => ({
        url: `/getOrderDetailsById/${id}`,
        method: "GET",
      }),
    }),
    updateOrder: build.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [{ type: "GetOrder", id: "LIST" }],
    }),
    deleteOrder: build.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GetOrder", id: "LIST" }],
    }),
    updateOrderStatus: build.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: [{ type: "GetOrder", id: "LIST" }],
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetAllOrdersByFiltersQuery,
  useGetOrderDetailsByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
